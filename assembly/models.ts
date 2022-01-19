import { storage, PersistentVector, context, PersistentMap, u128 } from 'near-sdk-as';
import { XCC_GAS, AccountId, asNEAR, toYocto } from './utils';

@nearBindgen
export class Petition {    
    public signature : PersistentVector<string> =  new PersistentVector<string>("signatures"); 
    public funding: u128; 
    constructor(
        public title: string,
        public body: string,
        public isFunded : bool,
        public minFundAmount: u128 = u128.Zero
    ) {
        this.funding =  u128.Zero;
    }
    
    sign(): bool {  
        assert(context.sender, "Petition must be signed by an account")
        assert(this.isFunded==false);    
        this.signature.push(context.sender);
        return true;
    }

    signWithFunds(amount: u128): bool {
        assert(context.predecessor, "Petition must be signed by an account");
        assert(this.isFunded, `not a funded petition`);
        assert(u128.ge(amount, this.minFundAmount), 
        `amount provided is less than minimum funding amount: at least ${asNEAR(this.minFundAmount)} required to sign this petition`);
        const currentTotal = this.funding;
        this.funding.set(u128.add(amount, currentTotal));  
        this.signature.push(context.sender);
        return true;
    }    

}


export const petitions = new PersistentVector<Petition>("p");

