import { context, u128, VM, VMContext } from 'near-sdk-as';
import { toYocto, asNEAR } from '../utils';


const setCurrentAccount = (): void => {
  VMContext.setCurrent_account_id('alice');
};

const attachDeposit = (deposit: number): void => {
  VMContext.setAttached_deposit(toYocto(deposit));
};

describe('', () => {
  beforeEach(() => {
    setCurrentAccount;    
  });
  
  describe("", () => { 
  it("", () => {    
    
    
  }); 
     
});
});


// describe("Create a funded Petition ", () => { 
  

//   it("should create a petition", () => {    
//     createPetition(fundedPetition);
//     expect(petitions.length).toBe(1, "should have added one petition");
//     expect(petitions[petitions.length-1]).toStrictEqual(
//       fundedPetition,
//       `should have added the petition with title ${fundedPetition.title}`
//     );
//     clearPetitions();
//   }); 
// }
  