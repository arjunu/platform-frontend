import { createSelector } from "reselect";

import { IAppState } from "../../store";

export const selectAccessWallet = (state: IAppState) => state.accessWallet;

export const selectIsAccessWalletModalOpen = createSelector(
  selectAccessWallet,
  accessWallet => accessWallet.isModalOpen,
);
