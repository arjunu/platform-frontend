import BigNumber from "bignumber.js";

export interface ITxData {
  to: string;
  value: string;
  data?: string;
  from: string;
  input?: string;
  gas: string;
  gasPrice: string;
}

export interface IRawTxData extends ITxData {
  nonce: string;
}

export interface IEthereumNetworkConfig {
  rpcUrl: string;
}

export type TBigNumberVariants = string | BigNumber;
