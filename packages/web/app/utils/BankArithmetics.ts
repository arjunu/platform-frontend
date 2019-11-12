import BigNumber from "bignumber.js";

import { toFixedBankingPrecision } from "../components/modals/tx-sender/redeem/utils";
import {
  ENumberInputFormat,
  ERoundingMode,
  toFixedPrecision,
} from "../components/shared/formatters/utils";
import { ISO2022_AMOUNT_SCALE } from "../config/constants";
import { multiplyBigNumbers, subtractBigNumbers } from "./BigNumberUtils";
import { convertToUlps } from "./NumberUtils";

export const iso2002Quantize = (
  value: BigNumber | string,
  inputFormat: ENumberInputFormat,
): string => {
  const valueBn = value instanceof BigNumber ? value : new BigNumber(value);

  if (valueBn.isZero()) {
    return "0";
  }

  return toFixedPrecision({
    value: valueBn,
    decimalPlaces: ISO2022_AMOUNT_SCALE,
    roundingMode: ERoundingMode.HALF_UP,
    inputFormat: inputFormat,
  });
};

export const bankQuantize = (
  value: BigNumber | string,
  inputFormat: ENumberInputFormat,
): string => {
  const valueBn = value instanceof BigNumber ? value : new BigNumber(value);

  if (valueBn.isZero()) {
    return "0";
  }

  return toFixedBankingPrecision(valueBn, inputFormat);
};

export const subtractBankFee = (
  amount: BigNumber | string,
  feeFraction: BigNumber | string,
): string => {
  if (new BigNumber(feeFraction).comparedTo(convertToUlps("1")) === 1) {
    throw new Error("FeeFraction must be fraction number");
  }

  const feeDec = toFixedPrecision({
    value: feeFraction,
    decimalPlaces: ISO2022_AMOUNT_SCALE,
    roundingMode: ERoundingMode.UP,
  });

  const iso2002Amount = iso2002Quantize(amount, ENumberInputFormat.ULPS);
  const feeBn = multiplyBigNumbers([iso2002Amount, feeDec]);
  const totalBn = subtractBigNumbers([iso2002Amount, feeBn]);

  // Calculation result is always FLOAT
  return bankQuantize(totalBn, ENumberInputFormat.FLOAT);
};

export const calculateBankFee = (
  amount: BigNumber | string,
  feeFraction: BigNumber | string,
): string => {
  const amountDec = toFixedBankingPrecision(amount, ENumberInputFormat.ULPS);

  const totalDec = subtractBankFee(amount, feeFraction);
  return subtractBigNumbers([amountDec, totalDec]);
};
