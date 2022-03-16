import { context, storage, PersistentMap, logging, u128, PersistentSet, u256 } from "near-sdk-as";
import { AccountId, asNEAR, assertValidId, assert_self,  FEE_DIVISOR,  is_valid_percentage, toYocto } from "../../utils";
import { Balance, Fruit, FruitType, Investor } from "./models";
/**DATA STORAGE */
let fruit:Array<Fruit> = [{
    type: FruitType.pool,
    ref_finance_id: 'dd',
    percentage: 20
}]

const shares: PersistentMap<AccountId, Balance> = new PersistentMap<AccountId, Balance>("s");
const fruits: PersistentSet<Fruit> = new PersistentSet<Fruit>("f"); 
/**
* Returns the manager. Some methods can only be called by the portfolio manager
* @param manager 
*/
export function isManager(manager: AccountId): boolean {
  assertValidId(manager)
  return manager == storage.getSome<string>("manager");
}

/**
* Returns the investory/shareholder this will be used for access control to 
* certain methods.
* @param shareholder
*/
export function onlyShareholder(shareholder: AccountId): boolean {
    assertValidId(shareholder)
    return Investor.get(shareholder).hasShares();
  }

// ****************************
// INITIALIZATION
// ****************************



export function initialize(
    factory: AccountId,
    name: AccountId,
    _fruits: Array<Fruit>,
    // divestPeriod: Date,
    manager: AccountId,
    fee: u32
){
    
    //set manager in the storage
    assert(storage.get<string>("init") == null, "ERROR: ALREADY INITIALISED");
    assertValidId(name);
    assertValidId(factory);
    assert!(fee < FEE_DIVISOR, 'FEE TOO LARGE');
    assert(is_valid_percentage(_fruits), 'THE PERCENTAGE OF THE FRUITS IS INCORRECT');
    assert(_fruits.length > 2, 'PORTFOLIO/BASKET MUST CONTAIN AT LEAST 2 ITEMS ')
    storage.set<string>("factory", factory);    
    storage.set<string>("manager", manager);
    storage.set<u32>("fee", fee);

   
    _fruits.forEach(fruit => {
        fruits.add(fruit);
    });
    storage.set<u128>("shares_total_supply", u128.Zero);
    storage.set<string>("init", "DONE");
}

 /// Register given account with 0 balance in shares.
/// Storage payment should be checked by caller.
function share_register(accountId: AccountId){
    assert!(shares.contains(accountId), "ALREADY REGISTERED");
    shares.set(accountId, u128.Zero);
}

/// Returns balance of shares for given user.
  function share_balance_of( account_id: AccountId) : Balance {
   let isExist = shares.contains(account_id);
    if(isExist){
        shares.get(account_id);
        return shares.getSome(account_id);
    }
    else return u128.Zero;
  }

/// Returns total number of shares in this basket.
function share_total_balance() : Balance {
return storage.getSome("shares_total_supply");
}

/// Returns list of fruits in this pool.
function getFruits() : Array<Fruit> {
   return fruits.values();   
}

 /// Adds the amounts of fruits to liquidity pool and returns number of shares that this user receives.
/// Updates amount to amount kept in the pool.
// function add_liquidity(
//     account_id: AccountId,
//     amount: Balance
// ):Balance{
//     let shares;
      
//     if (u128.gt(storage.getSome("shares_total_supply"), u128.Zero) ) {
//         let fair_supply = u256.Max;        
//     }

// }

function distribute(){
    assert_self();
    return("distribute");
}

function divest_single_investor(){
    return("div");
}

function invest(){
    return("inv");
}

function on_receive_investment(){
    assert_self();





    return("rece");
}

function on_receive_returns(){
    assert_self();
    return("rr");

}

export function divest_and_hold(){
    assert_self();
    return("dnh");
}

export function divest_and_distribute_all(){
    return("dda");

}

export function distribute_all(){

}

export function update_basket_config(){

}

export function get_investor_shares(){

 }

export function get_total_investment(){

}

// function _ref_int(fruits: Fruit[], amount: Balance) {
//     let attached_deposit = u128.sub(amount, toYocto(10));
//     array.forEach(element => {
        
//     });

// }



