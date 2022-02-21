import { storage, PersistentVector, context, PersistentMap, u128, ContractPromise, ContractPromiseBatch, Context } from 'near-sdk-as';
import { XCC_GAS, AccountId, asNEAR, toYocto, assert_self, assert_single_promise_success } from './utils';

class OnTransferArgs {
    constructor(public petitionId:i32, public amount: u128, public receiver:string) { }
  }
@nearBindgen
export class Petition {  
    
    private funding: Funds = new Funds(); 
    private creator: string = context.predecessor;
    private signatureCount: u64 = 0;
    constructor(        
        public title: string,
        public body: string,
        public isFunded : bool,
        public minFundAmount: u128 = u128.Zero  
    ) {
        this.creator = context.predecessor;
    }
    
    sign(petitionInd:u64): bool {  
        assert(context.sender, "Petition must be signed by an account")
        assert(this.isFunded==false);    
        signature.push(petitionInd.toString()+'_'+context.sender);
        this.signatureCount++;
        return true;
    }

    signWithFunds(petitionInd:u64, amount: u128): bool {
        assert(context.predecessor, "Petition must be signed by an account");
        assert(this.isFunded, `not a funded petition`);
        assert(u128.ge(amount, this.minFundAmount), 
        `amount provided is less than minimum funding amount: at least ${asNEAR(this.minFundAmount)} required to sign this petition`);
        signature.push(petitionInd.toString()+'_'+context.sender);
        this.signatureCount++;
        this.funding.update(amount);
        return true;
    } 
    
    disburseFunds(petitionId: i32, amount:u128, collector:string): bool {
        assert(this.creator == context.predecessor, "only the creator of this petition can disburse funds");
        //assert(this.funding.receivedFunds> u128.Zero, "This petition has no undisbursed funds.")
        //assert(this.funding.receivedFunds >= amount, "amount transferred must be smaller than or equal to funding");
        const promise = ContractPromiseBatch.create(collector).transfer(amount);
       promise.then(Context.contractName).function_call("recordFundTransfer", new OnTransferArgs(petitionId, amount, collector), u128.Zero, XCC_GAS);
        // this.recordFundTransfer(amount, collector);
        return true;
    }
    
    // recordFundTransfer(amount: u128, receiver:string): void {
    //     assert_self();
    //     //assert_single_promise_success();
    //     this.funding.record_transfer(amount, receiver); 
    // }

}

@nearBindgen
export class Funds {
    public count : u32 = 0;
    public total: u128 = u128.Zero;
    public average: f64;
    public receivedFunds: u128 = u128.Zero;
    public transferredFunds: u128 = u128.Zero;
    public receivers: PersistentVector<string> = new PersistentVector<string>("receivers");

    update(value: u128): void {        
        // track money received separately
        this.receivedFunds = u128.add(this.receivedFunds, value);    
        // update tracking data
        this.count += 1;
        this.total = u128.add(this.total, value);
        this.average = u128.div(this.total, u128.from(this.count)).toF64();
      }
    
      record_transfer(amount: u128, receiver:string): void {
        this.transferredFunds = u128.add(this.transferredFunds, amount);
        // this.receivedFunds = u128.sub(this.receivedFunds, amount);
        this.receivers.push(receiver);
      }
}

export const petitions = new PersistentVector<Petition>("p");
export const signature : PersistentVector<string> =  new PersistentVector<string>("signatures");

