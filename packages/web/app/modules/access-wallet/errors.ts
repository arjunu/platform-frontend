import {
  GenericErrorMessage,
  MismatchedWalletAddressErrorMessage,
} from "../../components/translatedMessages/messages";
import { createMessage, TMessage } from "../../components/translatedMessages/utils";
import { BrowserWalletError } from "../../lib/web3/browser-wallet/BrowserWallet";
import { LedgerError } from "../../lib/web3/ledger-wallet/errors";
import { LightWalletError } from "../../lib/web3/light-wallet/LightWallet";
import { mapSignerErrorToErrorMessage } from "../../lib/web3/Web3Manager/errors";
import { SignerError } from "../../lib/web3/Web3Manager/Web3Manager";
import { EthereumAddress } from "../../utils/opaque-types/types";
import { mapBrowserWalletErrorToErrorMessage } from "../wallet-selector/browser-wizard/errors";
import { mapLedgerErrorToErrorMessage } from "../wallet-selector/ledger-wizard/errors";
import { mapLightWalletErrorToErrorMessage } from "../wallet-selector/light-wizard/errors";

export class MismatchedWalletAddressError extends Error {
  constructor(
    public readonly desiredAddress: EthereumAddress,
    public readonly actualAddress: EthereumAddress,
  ) {
    super(
      `Plugged wallet address is: ${actualAddress}, expected wallet address is: ${desiredAddress}`,
    );
  }
}

export function mapSignMessageErrorToErrorMessage(error: Error): TMessage {
  if (error instanceof BrowserWalletError) {
    return mapBrowserWalletErrorToErrorMessage(error);
  }
  if (error instanceof LedgerError) {
    return mapLedgerErrorToErrorMessage(error);
  }
  if (error instanceof LightWalletError) {
    return mapLightWalletErrorToErrorMessage(error);
  }
  if (error instanceof SignerError) {
    return mapSignerErrorToErrorMessage(error);
  }
  if (error instanceof MismatchedWalletAddressError) {
    return createMessage(MismatchedWalletAddressErrorMessage.MISMATCHED_WALLET_ADDRESS, {
      desiredAddress: error.desiredAddress,
      actualAddress: error.actualAddress,
    });
  }

  return createMessage(GenericErrorMessage.GENERIC_ERROR);
}
