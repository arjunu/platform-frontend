import BigNumber from "bignumber.js";

import { BANKING_AMOUNT_SCALE } from "../../../../config/constants";
import { compareBigNumbers } from "../../../../utils/BigNumberUtils";
import { convertFromUlps, convertToUlps } from "../../../../utils/NumberUtils";

/**
 * Returns full precision wallet balance if value provided by user match
 * wallet balance with decimal precision set by BANKING_AMOUNT_SCALE and rounded down
 *
 * @param {(BigNumber|string)} nEURWalletBalanceUlps - Total available balance
 * @param {(BigNumber|string)} redeemValueDec - Value provided by user
 *
 * @return {string} full wallet balance if matches or value provided by user formatted to Ulps
 */
export const getRedeemValueUlps = (
  nEURWalletBalanceUlps: BigNumber | string,
  redeemValueDec: BigNumber | string,
) => {
  // Make sure to have value as BigNumber
  const nEURBalanceUlpsBn =
    nEURWalletBalanceUlps instanceof BigNumber
      ? nEURWalletBalanceUlps
      : new BigNumber(nEURWalletBalanceUlps);
  const nEURBalanceDec = convertFromUlps(nEURBalanceUlpsBn);

  // Convert to fixed with precison defined by BANKING_AMOUNT_SCALE and rounding set to ROUND_DOWN
  const nEURBalance = nEURBalanceDec.toFixed(BANKING_AMOUNT_SCALE, BigNumber.ROUND_DOWN);

  // Whole precision number should be passed when there is whole balance redeemed
  // also when user provided value has been used, then it have to be converted to Ulps
  return compareBigNumbers(redeemValueDec, nEURBalance) === 0
    ? nEURWalletBalanceUlps
    : convertToUlps(redeemValueDec);
};
