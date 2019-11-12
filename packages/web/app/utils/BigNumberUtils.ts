import BigNumber from "bignumber.js";

import { TBigNumberVariants } from "./../lib/web3/types";

/**
 * Add string as BigNumbers
 */
export const addBigNumbers = (numbers: TBigNumberVariants[]): string =>
  numbers
    .reduce((acc: BigNumber, number) => acc.plus(new BigNumber(number)), new BigNumber("0"))
    .toString();

/**
 * Subtract string as BigNumbers
 */
export const subtractBigNumbers = ([head, ...tail]: TBigNumberVariants[]): string =>
  tail
    .reduce((acc: BigNumber, number) => acc.minus(new BigNumber(number)), new BigNumber(head))
    .toString();

/**
 * Multiply string as BigNumbers
 */
export const multiplyBigNumbers = (numbers: TBigNumberVariants[]): string =>
  numbers
    .reduce((acc: BigNumber, number) => acc.mul(new BigNumber(number)), new BigNumber("1"))
    .toString();

/**
 * Divide any number representation as BigNumbers
 */
export const divideBigNumbers = (
  dividend: TBigNumberVariants,
  divisor: TBigNumberVariants,
): string => new BigNumber(dividend).div(divisor).toString();

export const compareBigNumbers = (a: TBigNumberVariants, b: TBigNumberVariants): number =>
  new BigNumber(a).comparedTo(b);
