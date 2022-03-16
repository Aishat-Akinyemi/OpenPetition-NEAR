import { base58, Context, ContractPromise, env, u128 } from 'near-sdk-as';
import { Fruit } from './basket-contract/assembly/models';

/**
 * == CONSTANTS ================================================================
 *
 * ONE_NEAR = unit of NEAR token in yocto Ⓝ (1e24)
 * XCC_GAS = gas for cross-contract calls, ~5 Tgas (teragas = 1e12) per "hop"
 * MIN_ACCOUNT_BALANCE = 3 NEAR min to keep account alive via storage staking
 *
 * TODO: revist MIN_ACCOUNT_BALANCE after some real data is included b/c this
 *  could end up being much higher
 */
export const ONE_NEAR = u128.from('1000000000000000000000000');
export const XCC_GAS = 5000000000000;
export const MIN_ACCOUNT_BALANCE = u128.mul(ONE_NEAR, u128.from(3));
/// Fee divisor, allowing to provide fee in bps.
export const FEE_DIVISOR: u32 = 10_000;
/// Initial shares supply .
export const INIT_SHARES_SUPPLY: u128 = u128.from(1000000000000000000000000);
/**
 * == TYPES ====================================================================
 */

/**
 * Account IDs in NEAR are just strings.
 */
export type AccountId = string;

/**
 * == FUNCTIONS ================================================================
 */

/**
 * @function asNEAR
 * @param amount {u128} - Yocto Ⓝ token quantity as an unsigned 128-bit integer
 * @returns {string}    - Amount in NEAR, as a string
 *
 * @example
 *
 *    asNEAR(7000000000000000000000000)
 *    // => '7'
 */
export function asNEAR(amount: u128): string {
  return u128.div(amount, ONE_NEAR).toString();
}

/**
 * @function toYocto
 * @param amount {number} - Integer to convert
 * @returns {u128}        - Amount in yocto Ⓝ as an unsigned 128-bit integer
 *
 * @example
 *
 *    toYocto(7)
 *    // => 7000000000000000000000000
 */
export function toYocto(amount: number): u128 {
  return u128.mul(ONE_NEAR, u128.from(amount))
}

/**
 * Function to assert that the contract has called itself
 */
 export function assert_self(): void {
  const caller = Context.predecessor
  const self = Context.contractName
  assert(caller == self, "Only this contract may call itself");
}

export function assert_single_promise_success(): void {
  const x = ContractPromise.getResults()
  assert(x.length == 1, "Expected exactly one promise result")
  assert(x[0].succeeded, "Expected PromiseStatus to be successful")
}

// decode a string representing a Key in the form ed25519:xxxxxxxxxxxxxx into a Uint8Array
export function decodePk(key: string): Uint8Array {
  if (key.indexOf(':') > -1) {
    const keyParts = key.split(':')
    let prefix = keyParts[0]
    if (prefix == 'ed25519') {
      // prefix key with base58 0 -- yes, it's actually a decimal 1 :P
      return base58.decode('1' + keyParts[1])
    } else {
      assert(false, "Bad key")
      return new Uint8Array(0)
    }
  } else {
    let decodedKey = base58.decode(key)
    if (isValidKey(key, decodedKey)) {
      return base58.decode('1' + key)
    } else {
      assert(false, "Invalid key: " + key)
      return new Uint8Array(0)
    }
  }
}

export function isValidKey(key: string, decodedKey: Uint8Array): boolean {
  // key cannot be blank
  if (key == '') {
    return false
  }
  // base58 encoded key must be 43-44 characters long (or 51 with prefix 'ed25519:')
  if (![43, 44, 51].includes(key.length)) {
    return false
  }
  // remove prefix if found
  key = key.indexOf(':') > -1 ? key.split(':')[1] : key
  // check decoded byte length
  if (![32, 33].includes(decodedKey.byteLength)) {
    return false
  }
  return true
}

export function assertValidId(id: string): void {
  assert(env.isValidAccountID(id), "INVALID ACCOUNT ID");
}

export function isPositive(num: u128): boolean {
  return u128.gt(num, u128.Zero) == 1;
}


export function is_valid_percentage(array:Fruit[]):boolean{
  const initialValue = 0;
  const sumWithInitial = array.reduce(
  (previousValue, currentValue) => previousValue + currentValue.percentage,
  initialValue
  );

  return (sumWithInitial==100 ? true: false );

}


