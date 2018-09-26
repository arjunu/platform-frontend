import * as Web3Utils from "web3-utils";
import { IAppState } from "../../store";
import { addBigNumbers, multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { selectEtherPriceEur, selectNeuPriceEur } from "../shared/tokenPrice/selectors";
import { IWalletState } from "./reducer";

/**
 * Simple State Selectors
 */

export const selectNeuBalanceEuroAmount = (state: IAppState): string =>
  multiplyBigNumbers([selectNeuPriceEur(state.tokenPrice), selectNeuBalance(state.wallet)]);

export const selectNeuBalance = (state: IWalletState): string =>
  (state.data && state.data.neuBalance) || "0";

export const selectEtherTokenBalance = (state: IWalletState): string | undefined =>
  state.data && state.data.etherTokenBalance;

/**
 * Liquid Assets
 */
export const selectLiquidEtherBalance = (state: IWalletState) =>
  (state.data && addBigNumbers([state.data.etherBalance, state.data.etherTokenBalance])) || "0";

export const selectLiquidEtherBalanceEuroAmount = (state: IAppState) =>
  multiplyBigNumbers([
    selectEtherPriceEur(state.tokenPrice),
    selectLiquidEtherBalance(state.wallet),
  ]);

export const selectLiquidEuroTokenBalance = (state: IWalletState) =>
  (state.data && state.data.euroTokenBalance) || "0";

export const selectLiquidEuroTotalAmount = (state: IAppState) =>
  addBigNumbers([
    selectLiquidEuroTokenBalance(state.wallet),
    selectLiquidEtherBalanceEuroAmount(state),
  ]);

/**
 * Locked Wallet Assets
 */
export const selectLockedEtherBalance = (state: IWalletState) =>
  (state.data &&
    state.data.etherTokenLockedWallet &&
    state.data.etherTokenLockedWallet.LockedBalance) ||
  "0";

export const selectLockedEtherBalanceEuroAmount = (state: IAppState) =>
  multiplyBigNumbers([
    selectEtherPriceEur(state.tokenPrice),
    selectLockedEtherBalance(state.wallet),
  ]);

export const selectLockedEuroTokenBalance = (state: IWalletState) =>
  (state.data &&
    state.data.euroTokenLockedWallet &&
    state.data.euroTokenLockedWallet.LockedBalance) ||
  "0";

export const selectLockedEuroTotalAmount = (state: IAppState) =>
  addBigNumbers([
    selectLockedEtherBalanceEuroAmount(state),
    selectLockedEuroTokenBalance(state.wallet),
  ]);

export const selectLockedWalletHasFunds = (state: IAppState): boolean =>
  selectLockedEuroTotalAmount(state) !== "0";

/**
 * ICBM Wallet Assets
 */
export const selectICBMLockedEtherBalance = (state: IWalletState) =>
  (state.data &&
    state.data.etherTokenICBMLockedWallet &&
    state.data.etherTokenICBMLockedWallet.LockedBalance) ||
  "0";

export const selectICBMLockedEtherBalanceEuroAmount = (state: IAppState) =>
  multiplyBigNumbers([
    selectEtherPriceEur(state.tokenPrice),
    selectICBMLockedEtherBalance(state.wallet),
  ]);

export const selectICBMLockedEuroTokenBalance = (state: IWalletState) =>
  (state.data &&
    state.data.euroTokenICBMLockedWallet &&
    state.data.euroTokenICBMLockedWallet.LockedBalance) ||
  "0";

export const selectICBMLockedEuroTotalAmount = (state: IAppState) =>
  addBigNumbers([
    selectICBMLockedEtherBalanceEuroAmount(state),
    selectICBMLockedEuroTokenBalance(state.wallet),
  ]);

export const selectICBMLockedWalletHasFunds = (state: IWalletState): boolean =>
  addBigNumbers([selectICBMLockedEuroTokenBalance(state), selectICBMLockedEtherBalance(state)]) !==
  "0";

/**
 * Total wallet assets value
 */
export const selectTotalEtherBalance = (state: IWalletState) =>
  addBigNumbers([
    selectLiquidEtherBalance(state),
    selectLockedEtherBalance(state),
    selectICBMLockedEtherBalance(state),
  ]);

export const selectTotalEtherBalanceEuroAmount = (state: IAppState) =>
  addBigNumbers([
    selectLiquidEtherBalanceEuroAmount(state),
    selectLockedEtherBalanceEuroAmount(state),
    selectICBMLockedEtherBalanceEuroAmount(state),
  ]);
export const selectTotalEuroTokenBalance = (state: IWalletState) =>
  addBigNumbers([
    selectLiquidEuroTokenBalance(state),
    selectLockedEuroTokenBalance(state),
    selectICBMLockedEuroTokenBalance(state),
  ]);
export const selectTotalEuroBalance = (state: IAppState) =>
  addBigNumbers([
    selectLiquidEuroTotalAmount(state),
    selectLockedEuroTotalAmount(state),
    selectICBMLockedEuroTotalAmount(state),
  ]);

export const selectEtherNeumarksDue = (state: IWalletState): string =>
  (state.data &&
    state.data.etherTokenICBMLockedWallet &&
    state.data.etherTokenICBMLockedWallet.neumarksDue) ||
  "0";

export const selectEurNeumarksDue = (state: IWalletState): string =>
  (state.data &&
    state.data.euroTokenICBMLockedWallet &&
    state.data.euroTokenICBMLockedWallet.neumarksDue) ||
  "0";

export const selectIcbmWalletConnected = (state: IWalletState): boolean =>
  !!(
    (state.data &&
      state.data.etherTokenICBMLockedWallet &&
      state.data.etherTokenICBMLockedWallet.unlockDate !== "0") ||
    (state.data &&
      state.data.euroTokenICBMLockedWallet &&
      state.data.euroTokenICBMLockedWallet.unlockDate !== "0")
  );

export const selectIsLoading = (state: IWalletState): boolean => !!state.loading;

export const selectWalletError = (state: IWalletState): string | undefined => state.error;

export const selectIsEtherUpgradeTargetSet = (state: IWalletState): boolean =>
  state.data && Web3Utils.isAddress(state.data.etherTokenUpgradeTarget);

export const selectIsEuroUpgradeTargetSet = (state: IWalletState): boolean =>
  state.data && Web3Utils.isAddress(state.data.euroTokenUpgradeTarget);
