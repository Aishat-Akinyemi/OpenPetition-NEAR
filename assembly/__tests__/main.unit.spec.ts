import { context, u128, VM, VMContext } from 'near-sdk-as';
import { createPetition, sign, list, show } from '../index';
import { Petition, petitions, signature } from "../models";
import { toYocto, asNEAR } from '../utils';

const fundedPetition = new Petition('funded respect human rights', `it is everyone's responsibility to respect humans right.`, true, toYocto(10));
const unFundedPetition =  new Petition('unfunded respect human rights', `it is everyone's responsibility to respect humans right.`, false);

function clearPetitions(): void {
  while (petitions.length > 0) {
    petitions.pop();
  }
}
const setCurrentAccount = (): void => {
  VMContext.setCurrent_account_id('alice');
};

const attachDeposit = (deposit: number): void => {
  VMContext.setAttached_deposit(toYocto(deposit));
};

describe('openPetition', () => {
  beforeEach(() => {
    setCurrentAccount;    
  });
  
    describe("Create an unfunded Petition ", () => { 
  it("should create petition", () => {     
    createPetition(unFundedPetition);
    expect<i32>(petitions.length).toBe(1, "should have added one petition");
    expect<string>(petitions[petitions.length - 1].title).toStrictEqual(
      unFundedPetition.title,
      `should have added the petition with title ${unFundedPetition.title}`
    );
    clearPetitions();
  }); 
  it("should create an unfunded Petition", ()=> {     
    createPetition(unFundedPetition);
    expect(petitions[0].isFunded).toBeFalsy();
    clearPetitions();
  });   

  it("should sign an unfunded Petition", ()=> {           
    createPetition(unFundedPetition);    
    expect(sign(1)).toBeTruthy("should sign successfully");      
    expect(signature.length).toBe(1);
    log(signature.first);
    clearPetitions();
  });    
});



describe("Create a funded Petition ", () => { 
  

  it("should create a petition", () => {    
    createPetition(fundedPetition);
    expect(petitions.length).toBe(1, "should have added one petition");
    expect(petitions[petitions.length-1]).toStrictEqual(
      fundedPetition,
      `should have added the petition with title ${fundedPetition.title}`
    );
    clearPetitions();
  }); 

  it("should create a funded Petition", ()=> { 
    createPetition(fundedPetition);
    expect( petitions[petitions.length-1].isFunded).toBeTruthy('isfunded property should be true');
    clearPetitions();
  }); 


  it("should sign a funded Petition with enough attached funds", ()=> {      
    createPetition(fundedPetition);  
    expect(signature.length).toBe(0); 
    VMContext.setPredecessor_account_id('cc');
    attachDeposit(10);
    log(petitions.length);
    sign(petitions.length);
    expect(signature.length).toBe(1); 
    clearPetitions(); 
  });

  throws("should throw an error when trying to sign a funded Petition without attached funds", () => {
    createPetition(fundedPetition);
    sign(petitions.length);
    clearPetitions(); 
  });
  
  throws("should throw an error when trying to sign a funded Petition without attached funds", () => {
    createPetition(fundedPetition);
    sign(petitions.length);
    clearPetitions(); 
  });

  throws("should throw an error when trying to sign a funded Petition without enough attached funds", () => {
    createPetition(fundedPetition);
    VMContext.setAttached_deposit(u128.from("100"));
    expect(sign(petitions.length)).toBeFalsy("should not sign with no attached deposit");
    clearPetitions(); 
  }); 
  
});

describe("get Petitions", () => {
  it("should get Petitions", () => {
    createPetition(fundedPetition);
    createPetition(unFundedPetition);
    expect(list().length).toBe(2, 'list should contain 2 petitions');
    clearPetitions();
  })

});

describe("show details of a Petition", () => {
 it("show details of a Petition", () => {
  createPetition(fundedPetition);
  expect(show(1).body).toBe(fundedPetition.body);  
  clearPetitions();
 });
});

});

