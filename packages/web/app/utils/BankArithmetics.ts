import BigNumber from "bignumber.js";

import { BANKING_AMOUNT_SCALE, ISO2022_AMOUNT_SCALE } from "../config/constants";
import { multiplyBigNumbers, subtractBigNumbers } from "./BigNumberUtils";
import { convertFromUlps, convertToUlps } from "./NumberUtils";

/**
 * Frontend implementation of quantize function
 *
 * @param {(BigNumber|string)} value - value to quantize
 * @return {string} Quantized string with precision set by ISO2022_AMOUNT_SCALE constant rounded HALF_UP
 */
export const iso2002Quantize = (value: BigNumber | string): string => {
  const valueBn = value instanceof BigNumber ? value : new BigNumber(value);

  if (valueBn.isZero()) {
    return "0";
  }

  return valueBn.toFixed(ISO2022_AMOUNT_SCALE, BigNumber.ROUND_HALF_UP);
};

/**
 * Frontend implementation of wei quantize function
 *
 * @param {(BigNumber|string)} value - value to quantize
 * @return {string} Quantized string with precision set by BANKING_AMOUNT_SCALE constant rounded DOWN
 */
export const bankQuantize = (value: BigNumber | string): string => {
  const valueBn = value instanceof BigNumber ? value : new BigNumber(value);

  if (valueBn.isZero()) {
    return "0";
  }

  return valueBn.toFixed(BANKING_AMOUNT_SCALE, BigNumber.ROUND_DOWN);
};

/**
 * Calculate total redeemed with fee subtracted
 *
 * @param {(BigNumber|string)} amountUlps - Amount to redeem
 * @param {(BigNumber|string)} feeFraction - Bank fee fraction
 */
export const subtractBankFee = (
  amountUlps: BigNumber | string,
  feeFraction: BigNumber | string,
): string => {
  if (new BigNumber(feeFraction).comparedTo(convertToUlps("1")) === 1) {
    throw new Error("FeeFraction must be fraction number");
  }

  const amountDec = convertFromUlps(amountUlps);
  const feeFractionDec = convertFromUlps(feeFraction);

  const iso2002Amount = iso2002Quantize(amountDec);

  const feeBn = multiplyBigNumbers([iso2002Amount, feeFractionDec]);
  const total = subtractBigNumbers([iso2002Amount, feeBn]);
  return bankQuantize(total);
};
/**
 *
 * @param {(BigNumber|string)} amountProvidedUlps - amount provided by user in Ulps
 * @param {(BigNumber|string)} totalRedeemedDec - total redeemed value with subtracted fee
 *
 * @return {string} Calculated fee
 */
export const calculateBankFee = (
  amountProvidedUlps: BigNumber | string,
  totalRedeemedDec: BigNumber | string,
): string => {
  const amountDec = convertFromUlps(amountProvidedUlps);
  const fee = subtractBigNumbers([amountDec, totalRedeemedDec]);

  return bankQuantize(fee);
};
