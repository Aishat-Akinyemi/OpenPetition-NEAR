import { context, storage, logging, u128, PersistentSet, base64, datetime, AVLTree, util, env, base58, Context, ContractPromiseBatch, PersistentMap  } from "near-sdk-as";
import { XCC_GAS, AccountId, asNEAR, assert_single_promise_success, assert_self, decodePk, toYocto } from "../../utils";
import { BasketMetadata } from "./models";
//declare constants
export const ACCESS_KEY_ALLOWANCE: u128 =  toYocto(1); 
const ON_CREATE_BASKET_CALLBACK_GAS: u64 = 20000000000000; // 20 Tgas ("teragas")
const NO_DEPOSIT: u128 = u128.Zero;


// deployable contracts may be stored as Base64 encoded strings in some registry deployed as part of this factory contract
const CODE = includeBytes('../../1.wasm');

const baskets: PersistentMap<AccountId, BasketMetadata> = new PersistentMap<AccountId, BasketMetadata>("b");
let daos = new AVLTree<u32, string>('M')
   // we need to add the access key of who would be calling this contract, I'm assuming it is this factory contract
   export function create_basket_contract( 
    accountid: AccountId,  
    new_method: string,
    args: u8[],//should include things like who is creating the basket
    ):void {

    assert_self();       
    const pkey = context.senderPublicKey; 
     // decode param, can include ed25529: prefix
    let public_key_arr = decodePk(pkey)
    //re-encode as string, canonical format
    let canonical_pk = base58.encode(public_key_arr)
    
    let attached_deposit :u128 = context.attachedDeposit;
    
    let factory_account_id  = context.contractName;
    // let factory_account_id = env::current_account_id().as_bytes().to_vec();
    // let account_id = account_id.as_bytes().to_vec();
    ContractPromiseBatch.create(accountid)
    .create_account()                          // create new account
    .transfer(attached_deposit)                         // fund it
    //.add_full_access_key((key))     // add a full access key so the caller can control the new account
    .deploy_contract(Uint8Array.wrap(changetype<ArrayBuffer>(CODE)))          // deploy some pre-existing contract to the new account
    .function_call(
        new_method,
        args,
        NO_DEPOSIT,
        XCC_GAS
    ).then(factory_account_id)
    .function_call(
        "on_basket_created",
        accountid,
        NO_DEPOSIT,
        ON_CREATE_BASKET_CALLBACK_GAS
    );

    logging.log(`{"EVENT_JSON":{            
        "event":"create basket",
        "data":{
          "accountId":"${accountid}",
          "registered":${Context.blockTimestamp},
          "manager":"${Context.predecessor}"
        }}}`);
}  


// export function get_baskets():Array<BasketMetadata>{
   
// }

export function get_basket_by_account(accountId: AccountId):BasketMetadata|string{
    return baskets.getSome(accountId);
}

function onBasketCreated(accountid: AccountId, basketMetadata: BasketMetadata):void{
    assert_single_promise_success();
    baskets.set(accountid, basketMetadata);
}








