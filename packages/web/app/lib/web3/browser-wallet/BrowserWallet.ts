import * as hex2ascii from "hex2ascii";
import * as Web3 from "web3";

import { EWalletSubType, EWalletType, IBrowserWalletMetadata } from "../../../modules/web3/types";
import { EthereumAddress, EthereumNetworkId } from "../../../utils/opaque-types/types";
import { IPersonalWallet, SignerType } from "../PersonalWeb3";
import { Web3Adapter } from "../Web3Adapter";
import { SignerRejectConfirmationError } from "../Web3Manager/Web3Manager";
import { parseBrowserWalletError } from "./BrowserWalletConnector";

export class BrowserWalletError extends Error {}
export class BrowserWalletMissingError extends BrowserWalletError {}
export class BrowserWalletMismatchedNetworkError extends BrowserWalletError {
  constructor(
    public readonly desiredNetworkId: EthereumNetworkId,
    public readonly actualNetworkId: EthereumNetworkId,
  ) {
    super("MismatchedNetworkError");
  }
}
export class BrowserWalletLockedError extends BrowserWalletError {}
export class BrowserWalletAccountApprovalRejectedError extends BrowserWalletError {}
export class BrowserWalletAccountApprovalPendingError extends BrowserWalletError {}
export class BrowserWalletConfirmationRejectedError extends BrowserWalletError {}
export class BrowserWalletUnknownError extends BrowserWalletError {}

export class BrowserWallet implements IPersonalWallet {
  public readonly walletType = EWalletType.BROWSER;

  constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly walletSubType: EWalletSubType,
    public readonly ethereumAddress: EthereumAddress,
  ) {}

  public getSignerType(): SignerType {
    switch (this.walletSubType) {
      case EWalletSubType.METAMASK:
        return SignerType.ETH_SIGN_TYPED_DATA;
      case EWalletSubType.GNOSIS:
        return SignerType.ETH_SIGN_GNOSIS_SAFE;
      default:
        return SignerType.ETH_SIGN;
    }
  }

  public async testConnection(networkId: string): Promise<boolean> {
    const currentNetworkId = await this.web3Adapter.getNetworkId();
    if (currentNetworkId !== networkId) {
      return false;
    }

    return !!(await this.web3Adapter.getAccountAddress());
  }

  public async signMessage(data: string): Promise<string> {
    try {
      if (this.walletSubType === EWalletSubType.METAMASK) {
        const typedDataDecoded = JSON.parse(hex2ascii(data));
        // We can await as signTypedData function already awaits inside for result of RPC call.
        return await this.web3Adapter.signTypedData(this.ethereumAddress, typedDataDecoded);
      } else if (this.walletSubType === EWalletSubType.GNOSIS) {
        const typedDataDecoded = hex2ascii(data);
        return await this.web3Adapter.walletSignTypedData(this.ethereumAddress, typedDataDecoded);
      } else {
        return await this.web3Adapter.ethSign(this.ethereumAddress, "0x" + data);
      }
    } catch (e) {
      const error = parseBrowserWalletError(e);
      if (error instanceof BrowserWalletConfirmationRejectedError) {
        throw new SignerRejectConfirmationError();
      } else {
        throw error;
      }
    }
  }

  public async sendTransaction(data: Web3.TxData): Promise<string> {
    try {
      return await this.web3Adapter.sendTransaction(data);
    } catch (e) {
      const error = parseBrowserWalletError(e);
      if (error instanceof BrowserWalletConfirmationRejectedError) {
        throw new SignerRejectConfirmationError();
      } else {
        throw error;
      }
    }
  }

  public getMetadata(): IBrowserWalletMetadata {
    return {
      address: this.ethereumAddress,
      walletType: EWalletType.BROWSER,
      walletSubType: this.walletSubType,
    };
  }

  public isUnlocked(): boolean {
    return true;
  }
}
