import { context, storage, PersistentMap, logging, u128 } from "near-sdk-as";
import { Petition, petitions } from "./models";
import { asNEAR } from "./utils";



export function createPetition(petition: Petition): void {
  petitions.push(petition);
}

export function sign(petitionId: i32): bool {
  const petition = petitions[petitionId- 1];
  if(petition.isFunded){  
    return petition.signWithFunds(context.attachedDeposit);
  }
  else {
    return petition.sign();
  } 
}

export function list(): Array<string> {
  const petitionLength = petitions.length;
  const petitionList = new Array<string>(petitionLength-1);
  for (let index = 0; index < petitionLength; index++) {
    petitionList[index] = petitions[index].title;    
  }
  return petitionList;
}

export function show(petitionId: i32): Petition {
  return petitions[petitionId - 1];  
}

export function getFund(petitionId: i32): string {
  const petition = petitions[petitionId- 1];
  if(petition.isFunded){    
    return asNEAR(petition.funding);
  }
  else {
    return "NOT A FUNDED PETIOTION";
  } 
}

export function listSignatories(petitionId: i32): Array<string> {  
  const signatures = petitions[petitionId -1].signature;
  const signatureLenght = signatures.length;
  const signatureList = new Array<string>(signatureLenght-1);
  for (let index = 0; index < signatureLenght; index++) {
    signatureList[index] = signatures[index];    
  }
  return signatureList;
}



