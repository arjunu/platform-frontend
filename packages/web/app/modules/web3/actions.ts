import { createActionFactory } from "@neufund/shared";

import { createAction, createSimpleAction } from "../actionsUtils";
import { TWalletMetadata } from "./types";

export const web3Actions = {
  personalWalletDisconnected: createActionFactory("PERSONAL_WALLET_DISCONNECTED"),

  newPersonalWalletPlugged: (walletMetadata: TWalletMetadata, isUnlocked: boolean) =>
    createAction("NEW_PERSONAL_WALLET_PLUGGED", { walletMetadata, isUnlocked }),

  walletUnlocked: () => createSimpleAction("WEB3_WALLET_UNLOCKED"),
  walletLocked: () => createSimpleAction("WEB3_WALLET_LOCKED"),
  loadPreviousWallet: (previousWallet: TWalletMetadata) =>
    createAction("LOAD_PREVIOUS_WALLET", previousWallet),
  loadWalletPrivateDataToState: (seed: string, privateKey: string) =>
    createAction("WEB3_LOAD_SEED", { seed, privateKey }),
  clearWalletPrivateDataFromState: () => createSimpleAction("WEB3_CLEAR_SEED"),
  fetchWalletPrivateDataFromWallet: () => createSimpleAction("WEB3_FETCH_SEED"),
};
