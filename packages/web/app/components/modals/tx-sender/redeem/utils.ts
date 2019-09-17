import BigNumber from "bignumber.js";

import { BANKING_AMOUNT_SCALE } from "../../../../config/constants";
import { compareBigNumbers } from "../../../../utils/BigNumberUtils";
import { convertToBigInt } from "../../../../utils/Number.utils";
import {
  ENumberInputFormat,
  ERoundingMode,
  toFixedPrecision,
} from "../../../shared/formatters/utils";

export const toFixedBankingPrecision = (
  value: number | BigNumber | string,
  inputFormat: ENumberInputFormat = ENumberInputFormat.ULPS,
) =>
  toFixedPrecision({
    value,
    decimalPlaces: BANKING_AMOUNT_SCALE,
    roundingMode: ERoundingMode.DOWN,
    inputFormat,
  });

export const getPossibleMaxUlps = (maxUlpsValue: string, providedDecimal: number | string) => {
  const nEURBalance = toFixedBankingPrecision(maxUlpsValue);

  // Whole precision number should be passed when there is whole balance redeemed
  // also when user provided value has been used, then it have to be converted to Q18 via convertToBigInt
  return compareBigNumbers(providedDecimal, nEURBalance) === 0
    ? maxUlpsValue
    : convertToBigInt(providedDecimal);
};
