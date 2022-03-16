# OpenPetition-NEAR 

#### This smartcontract written in AssemblyScript on NEAR platform is an Open Petition smart contract. 

### Purpose

Users can create, sign and fund petitions.

#### The call methods are: 
- **createPetition** : this method adds petition to the storage
- **signPetition** : this method adds a signature to a petition

#### The view methods are:

- **list**: this lists all the petitions that have been created
- **show**: this shows a particular petition when it's id is called (non-zero based index)
- **listSignatories**: this lists the signatures 
