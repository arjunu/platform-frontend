import BigNumber from "bignumber.js";
import { createSelector } from "reselect";
import * as Web3Utils from "web3-utils";

import { ETHEREUM_ZERO_ADDRESS, NEUR_ALLOWED_US_STATES } from "../../config/constants";
import { EKycRequestType } from "../../lib/api/kyc/KycApi.interfaces";
import { IAppState } from "../../store";
import { addBigNumbers, multiplyBigNumbers, subtractBigNumbers } from "../../utils/BigNumberUtils";
import { ECountries } from "../../utils/enums/countriesEnum";
import { selectIsUserFullyVerified } from "../auth/selectors";
import { selectIndividualAddress, selectKycRequestType } from "../kyc/selectors";
import { selectEtherPriceEur, selectNeuPriceEur } from "../shared/tokenPrice/selectors";
import { selectTxGasCostEthUlps } from "../tx/sender/selectors";
import { IWalletState, IWalletStateData } from "./reducer";
import { ENEURWalletStatus } from "./types";

export const selectWalletData = (state: IAppState): IWalletStateData | undefined =>
  state.wallet.data;

/**
 * Simple State Selectors
 */
export const selectNeuBalanceEuroAmount = (state: IAppState): string =>
  multiplyBigNumbers([selectNeuPriceEur(state), selectNeuBalance(state)]);

export const selectNeuBalance = (state: IAppState): string =>
  (state.wallet.data && state.wallet.data.neuBalance) || "0";

export const selectNeumarkAddress = (state: IAppState): string =>
  (state.wallet.data && state.wallet.data.neumarkAddress) || "0x";

export const selectEtherTokenBalance = (state: IAppState): string =>
  (state.wallet.data && state.wallet.data.etherTokenBalance) || "0";

export const selectEtherTokenBalanceAsBigNumber = (state: IAppState): BigNumber =>
  new BigNumber(selectEtherTokenBalance(state));

export const selectEtherBalance = (state: IAppState): string =>
  (state.wallet.data && state.wallet.data.etherBalance) || "0";

export const selectEtherBalanceAsBigNumber = (state: IAppState): BigNumber =>
  new BigNumber(selectEtherBalance(state));

/**
 * Liquid Assets
 */
export const selectLiquidEtherBalance = createSelector(
  selectWalletData,
  (data: IWalletStateData | undefined) =>
    data ? addBigNumbers([data.etherBalance, data.etherTokenBalance]) : "0",
);

export const selectLiquidEtherBalanceEuroAmount = (state: IAppState) =>
  multiplyBigNumbers([selectEtherPriceEur(state), selectLiquidEtherBalance(state)]);

export const selectLiquidEuroTokenBalance = createSelector(
  selectWalletData,
  (data: IWalletStateData | undefined) => (data && data.euroTokenBalance) || "0",
);

export const selectLiquidEuroTotalAmount = (state: IAppState) =>
  addBigNumbers([selectLiquidEuroTokenBalance(state), selectLiquidEtherBalanceEuroAmount(state)]);

/**
 * Locked Wallet Assets
 */
export const selectLockedEtherBalance = (state: IAppState) =>
  (state.wallet.data &&
    state.wallet.data.etherTokenLockedWallet &&
    state.wallet.data.etherTokenLockedWallet.LockedBalance) ||
  "0";

export const selectLockedEtherUnlockDate = (state: IAppState) =>
  (state.wallet.data &&
    state.wallet.data.etherTokenLockedWallet &&
    state.wallet.data.etherTokenLockedWallet.unlockDate) ||
  "0";

export const selectLockedEtherBalanceEuroAmount = (state: IAppState) =>
  multiplyBigNumbers([selectEtherPriceEur(state), selectLockedEtherBalance(state)]);

export const selectLockedEuroTokenBalance = createSelector(
  selectWalletData,
  (data: IWalletStateData | undefined) =>
    (data && data.euroTokenLockedWallet && data.euroTokenLockedWallet.LockedBalance) || "0",
);

export const selectLockedEuroTotalAmount = (state: IAppState) =>
  addBigNumbers([selectLockedEtherBalanceEuroAmount(state), selectLockedEuroTokenBalance(state)]);

export const selectEtherLockedWalletHasFunds = createSelector(
  selectLockedEtherBalance,
  etherLockedBalance => etherLockedBalance !== "0",
);

export const selectLockedWalletHasFunds = (state: IAppState): boolean =>
  selectLockedEuroTotalAmount(state) !== "0";

/**
 * ICBM Wallet Assets
 */
export const selectICBMLockedEtherBalance = (state: IAppState): string =>
  (state.wallet.data &&
    state.wallet.data.etherTokenICBMLockedWallet &&
    state.wallet.data.etherTokenICBMLockedWallet.LockedBalance) ||
  "0";

export const selectICBMLockedEtherBalanceEuroAmount = (state: IAppState) =>
  multiplyBigNumbers([selectEtherPriceEur(state), selectICBMLockedEtherBalance(state)]);

export const selectICBMLockedEuroTokenBalance = (state: IAppState) =>
  (state.wallet &&
    state.wallet.data &&
    state.wallet.data.euroTokenICBMLockedWallet &&
    state.wallet.data.euroTokenICBMLockedWallet.LockedBalance) ||
  "0";

export const selectICBMLockedEuroTotalAmount = (state: IAppState) =>
  addBigNumbers([
    selectICBMLockedEtherBalanceEuroAmount(state),
    selectICBMLockedEuroTokenBalance(state),
  ]);

export const selectICBMLockedWalletHasFunds = (state: IAppState): boolean =>
  addBigNumbers([selectICBMLockedEuroTokenBalance(state), selectICBMLockedEtherBalance(state)]) !==
  "0";

/**
 * Total wallet assets value
 */
export const selectTotalEtherBalance = (state: IAppState) =>
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
export const selectTotalEuroTokenBalance = (state: IAppState) =>
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

export const selectEtherLockedNeumarksDue = (state: IAppState): string =>
  (state.wallet.data &&
    state.wallet.data.etherTokenLockedWallet &&
    state.wallet.data.etherTokenLockedWallet.neumarksDue) ||
  "0";

export const selectEuroLockedNeumarksDue = (state: IAppState): string =>
  (state.wallet.data &&
    state.wallet.data.euroTokenLockedWallet &&
    state.wallet.data.euroTokenLockedWallet.neumarksDue) ||
  "0";

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
    (state.data && state.data.etherTokenICBMLockedWallet.unlockDate !== "0") ||
    (state.data && state.data.euroTokenICBMLockedWallet.unlockDate !== "0")
  );

export const selectLockedWalletConnected = (state: IAppState): boolean =>
  !!(
    (state.wallet.data && state.wallet.data.etherTokenLockedWallet.unlockDate !== "0") ||
    (state.wallet.data && state.wallet.data.euroTokenLockedWallet.unlockDate !== "0")
  );

export const selectIsLoading = (state: IAppState): boolean => state.wallet.loading;

export const selectWalletError = (state: IAppState): string | undefined => state.wallet.error;

export const selectIsEtherUpgradeTargetSet = (state: IAppState): boolean =>
  !!(
    state.wallet.data &&
    state.wallet.data.etherTokenUpgradeTarget &&
    Web3Utils.isAddress(state.wallet.data.etherTokenUpgradeTarget) &&
    state.wallet.data.etherTokenUpgradeTarget !== ETHEREUM_ZERO_ADDRESS
  );

export const selectIsEuroUpgradeTargetSet = (state: IAppState): boolean =>
  !!(
    state.wallet.data &&
    state.wallet.data.euroTokenUpgradeTarget &&
    Web3Utils.isAddress(state.wallet.data.euroTokenUpgradeTarget) &&
    state.wallet.data.euroTokenUpgradeTarget !== ETHEREUM_ZERO_ADDRESS
  );

/* General State Selectors */
export const selectMaxAvailableEther = (state: IAppState): string =>
  subtractBigNumbers([selectLiquidEtherBalance(state), selectTxGasCostEthUlps(state)]);

export const selectNEURStatus = (state: IAppState): ENEURWalletStatus => {
  const isUserFullyVerified = selectIsUserFullyVerified(state);

  if (!isUserFullyVerified) {
    return ENEURWalletStatus.DISABLED_NON_VERIFIED;
  }

  const kycType = selectKycRequestType(state);
  const address = selectIndividualAddress(state);

  // In case it's Individual request and country is US we need to apply additional checks
  if (
    kycType === EKycRequestType.INDIVIDUAL &&
    address &&
    address.country === ECountries.UNITED_STATES
  ) {
    // It's likely possible `usState` is not defined but in case it's is assume NEUR access is restricted
    if (address.usState === undefined || !NEUR_ALLOWED_US_STATES.includes(address.usState)) {
      return ENEURWalletStatus.DISABLED_RESTRICTED_US_STATE;
    }
  }

  return ENEURWalletStatus.ENABLED;
};
