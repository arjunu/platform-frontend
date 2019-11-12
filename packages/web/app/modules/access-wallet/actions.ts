import { createActionFactory } from "@neufund/shared";

import { TMessage } from "../../components/translatedMessages/utils";

export const accessWalletActions = {
  showAccessWalletModal: createActionFactory(
    "SHOW_ACCESS_WALLET_MODAL",
    (title: TMessage, message?: TMessage, inputLabel?: TMessage) => ({
      title,
      message,
      inputLabel,
    }),
  ),
  hideAccessWalletModal: createActionFactory("HIDE_ACCESS_WALLET_MODAL"),
  signingError: createActionFactory("ACCESS_WALLET_SIGNING_ERROR", (errorMessage: TMessage) => ({
    errorMessage,
  })),
  tryToAccessWalletAgain: createActionFactory("TRY_TO_ACCESS_AGAIN"),
  clearSigningError: createActionFactory("ACCESS_WALLET_CLEAR_SIGNING_ERROR"),
  accept: createActionFactory("ACCESS_WALLET_ACCEPT", (password?: string) => ({ password })),
};
