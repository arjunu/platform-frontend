import BigNumber from "bignumber.js";
import { curry } from "lodash/fp";

import { TBigNumberVariants } from "../lib/web3/types";

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

type TNormalizeOptions = { min: number; max: number };

function normalizeValue(options: TNormalizeOptions, value: number): number {
  const minAllowed = 0;
  const maxAllowed = 1;

  return (
    ((maxAllowed - minAllowed) * (value - options.min)) / (options.max - options.min) + minAllowed
  );
}

export const normalize = curry(normalizeValue);
