import { TxData } from "web3";

import { EWalletSubType, EWalletType, TWalletMetadata } from "../../modules/web3/types";
import { EthereumAddress, EthereumNetworkId } from "../../utils/opaque-types/types";
import { Web3Adapter } from "./Web3Adapter";

// strings should match signer types on backend
export enum SignerType {
  ETH_SIGN = "eth_sign",
  ETH_SIGN_TYPED_DATA = "eth_signTypedData",
  ETH_SIGN_TYPED_DATA_V3 = "eth_signTypedData_v3",
  ETH_SIGN_GNOSIS_SAFE = "gnosis_safe",
}

export interface IPersonalWallet {
  readonly web3Adapter: Web3Adapter;
  readonly ethereumAddress: EthereumAddress;
  readonly walletType: EWalletType;
  readonly walletSubType: EWalletSubType;

  // returns type of a signer based on walletType and walletSubType
  getSignerType(): SignerType;

  // this will be periodically ran by Web3Manager to ensure that wallet connection is still established
  testConnection(networkId: EthereumNetworkId): Promise<boolean>;

  // sign message with the best available method for a given wallet
  signMessage(data: string): Promise<string>;

  sendTransaction(txData: TxData): Promise<string>;

  getMetadata(): TWalletMetadata;

  isUnlocked(): boolean;
}
