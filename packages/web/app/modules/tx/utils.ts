import BigNumber from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { TxData } from "web3";

import { TBigNumberVariants } from "../../lib/web3/types";
import { multiplyBigNumbers } from "../../utils/BigNumberUtils";

export const GAS_PRICE_MULTIPLIER = 1 + parseFloat(process.env.NF_GAS_PRICE_OVERHEAD || "0");

export const GAS_LIMIT_MULTIPLIER = 1 + parseFloat(process.env.NF_GAS_LIMIT_OVERHEAD || "0");

export const EMPTY_DATA = "";

export const ETH_ADDRESS_SIZE = 42;

export const MINIMUM_ETH_RESERVE_GAS_UNITS = "1000000";

export const calculateGasPriceWithOverhead = (gasPrice: TBigNumberVariants) =>
  new BigNumber(multiplyBigNumbers([gasPrice, GAS_PRICE_MULTIPLIER.toString()])).ceil().toString();

export const calculateGasLimitWithOverhead = (gasLimit: TBigNumberVariants) =>
  new BigNumber(multiplyBigNumbers([gasLimit, GAS_LIMIT_MULTIPLIER.toString()])).ceil().toString();

export const encodeTransaction = (txData: Partial<TxData>) => ({
  from: addHexPrefix(txData.from!),
  to: addHexPrefix(txData.to!),
  gas: addHexPrefix(new BigNumber((txData.gas && txData.gas.toString()) || "0").toString(16)),
  gasPrice: addHexPrefix(
    new BigNumber((txData.gasPrice && txData.gasPrice.toString()) || "0").toString(16),
  ),
  value: addHexPrefix(new BigNumber((txData.value && txData.value.toString()) || "0").toString(16)),
  data: addHexPrefix(txData.data || EMPTY_DATA),
});
