import { storage, PersistentVector, context, PersistentMap, u128, ContractPromise, PersistentSet, base64, PersistentUnorderedMap } from 'near-sdk-as';
import { XCC_GAS, AccountId, asNEAR, toYocto, assert_self, isPositive } from '../../utils';

export type Shares = u128
export type TokenName = string
export type Balance = u128

// Data Storage
// /**donation Id to donations*/
// export const contributions = new AVLTree<DonationId, Donation>('d')
/** maps account to its investor model */
export const investors: PersistentMap<AccountId, Investor> = new PersistentMap<AccountId, Investor>("i"); 
/** the fruits in the basket */
export const fruits = new PersistentSet<Fruit>('f');
  


/** Maps fruits to balance */
export const tokenBalances = new PersistentUnorderedMap<AccountId, PersistentMap<TokenName, Balance>>('tob')




export interface Fruit{
    type: FruitType;
    ref_finance_id: string;
    percentage: number
}

export enum FruitType {
    pool,
    farm,
    stake,
    token,
    near
}

// enum FruitType {
//     pool = "pool",
//     farm = "farm",
//     stake = "stake",
//     token = "token",
//     near = "near"
// }

enum Action {
    Invest
}




@nearBindgen
export class Basket{
    //name of this basket
    name: string;
    //name of the factory contract
    factory: AccountId;
    //basket/portfolio manager
    manager: AccountId;
    fruits: Array<Fruit>;
    divestPeriod: Date;
    investors: PersistentSet<Investor> = new PersistentSet<Investor>("i");
    storage_charge: u32;
    fee: u32; //percentage
    //share of the pool by investors
    shares: PersistentMap<AccountId, Balance>;
    shares_total_supply: Balance;
    //amount of near the contract has
    amount: Array<Balance>;
}


@nearBindgen
export class Investor {
  constructor(
    /** investor near account address unless updated */
    public investorKey: AccountId,
    /** the # of shares assigned to this investor */
    public shares: Balance,
    /** always true once a investor has been created */
    public existing: boolean,    
    /** timestamp of when investor first invested*/
    public joined: u64,
    /** timestamp of when investor info was last updated */
    public updated: u64,
     /** timestamp of when investor last divested*/
     public divestedtime: u64,
    /** is investor currently active in the community (true) or have they left (false) */
    public active: boolean
    )
    {}

    // static getStatus(accountId: string): boolean {
    //     // boolean is 0 | 1, boolean is false | true
    //     // contains returns boolean so cast it to boolean to be able to return it.
    //     return investors.contains(accountId) as boolean;
    // }
  
    static get(accountId: string): Investor {
        const investor = investors.get(accountId);        
        assert(investor!=null, "Error not an investor");
        // Need type assertion to make ts happy and not have runtime check for null
        return investor as Investor
    }

    // static getDelegate(accountId: string): Investor {
    //     assert(investorAddressByDelegatekey.contains(accountId), ERR_NOT_DELEGATE)
    //     return Investor.get(accountId)
    // }

    // static getLoot(accountId: string): u128 {
    //     if (!investors.contains(accountId)){
    //         return u128.Zero;
    //     }
    //     return this.get(accountId).loot;
    // }

    // static getShares(accountId: string): u128 {
    //     if (!investors.contains(accountId)){
    //         return u128.Zero;
    //     }
    //     return this.get(accountId).shares;
    // }

    hasShares(): boolean {
        return isPositive(this.shares)
    }

    // hasLoot(): boolean {
    //     return isPositive(this.loot)
    // }
}


@nearBindgen
export class Accounting {
    constructor(){

    }


}

