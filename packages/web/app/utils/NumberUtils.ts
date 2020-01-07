import BigNumber from "bignumber.js";
import { curry } from "lodash/fp";

import { TBigNumberVariants } from "../lib/web3/types";
import {
  addBigNumbers,
  divideBigNumbers,
  multiplyBigNumbers,
  subtractBigNumbers,
} from "./BigNumberUtils";

export function isZero(value: TBigNumberVariants): boolean {
  const bigNumberValue = new BigNumber(value);

  return bigNumberValue.isZero();
}

export function isLessThanOrEqualToZero(value: TBigNumberVariants): boolean {
  const bigNumberValue = new BigNumber(value);

  return bigNumberValue.lessThanOrEqualTo("0");
}

export const convertFromUlps = (value: TBigNumberVariants, decimals = 18) =>
  new BigNumber(value).div(new BigNumber("10").pow(decimals));

export const convertToUlps = (value: TBigNumberVariants, decimals = 18) =>
  new BigNumber("10")
    .pow(decimals)
    .mul(value)
    .toFixed(0, BigNumber.ROUND_UP);

/*
 * @deprecated
 * */
export function formatFlexiPrecision(
  value: number | string,
  maxPrecision: number,
  minPrecision = 0,
  useGrouping = false,
): string {
  return parseFloat(value as string).toLocaleString(undefined, {
    maximumFractionDigits: maxPrecision,
    minimumFractionDigits: minPrecision,
    useGrouping,
  });
}

type TNormalizeOptions = { min: TBigNumberVariants; max: TBigNumberVariants };

/**
 * Rescaling (min-max normalization)
 * @param {TNormalizeOptions} options - normalisation option
 * @param {TBigNumberVariants} value - value to be normalised
 */
function normalizeValue(options: TNormalizeOptions, value: TBigNumberVariants): string {
  const valueBn = new BigNumber(value);
  const scaleMinBn = new BigNumber(options.min);
  const scaleMaxBn = new BigNumber(options.max);
  const maxAllowedBn = new BigNumber("1");
  const minAllowedBn = new BigNumber("0");

  // Formula: minAllowed + ((maxAllowed - minAllowed) * (value - options.min)) / (options.max - options.min)
  return addBigNumbers([
    minAllowedBn,
    divideBigNumbers(
      multiplyBigNumbers([
        subtractBigNumbers([maxAllowedBn, minAllowedBn]),
        subtractBigNumbers([valueBn, scaleMinBn]),
      ]),
      subtractBigNumbers([scaleMaxBn, scaleMinBn]),
    ),
  ]);
}

export const normalize = curry(normalizeValue);
