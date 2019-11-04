import { createAction, createSimpleAction } from "../actionsUtils";
import { IWalletStateData } from "./reducer";

export const walletActions = {
  loadWalletData: () => createSimpleAction("WALLET_LOAD_WALLET_DATA"),
  saveWalletData: (data: IWalletStateData) => createAction("WALLET_SAVE_WALLET_DATA", { data }),
  loadWalletDataError: (errorMsg: string) =>
    createAction("WALLET_LOAD_WALLET_DATA_ERROR", { errorMsg }),
};
