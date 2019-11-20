import { createSelector } from "reselect";

import { IAppState } from "../../store";
import { DeepReadonly } from "../../types";
import { selectBankAccount, selectClaims } from "../kyc/selectors";
import { TBankAccount, TClaims } from "../kyc/types";
import { EBankTransferFlowState } from "./reducer";

export const selectBankTransferFlow = (state: IAppState) => state.bankTransferFLow;

export const selectBankTransferFlowState = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.state,
);

export const selectIsBankTransferModalOpened = createSelector(
  selectBankTransferFlowState,
  state => state !== EBankTransferFlowState.UNINITIALIZED,
);

export const selectBankTransferFlowReference = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.reference,
);

export const selectBankTransferType = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.type,
);

export const selectBankTransferMinAmount = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.minEuroUlps,
);

export const selectBankRedeemMinAmount = createSelector(selectBankTransferFlow, bankTransferFlow =>
  bankTransferFlow.redeem ? bankTransferFlow.redeem.minEuroUlps : "0",
);

export const selectInitialAmount = (state: IAppState) => state.txUserFlowRedeem.initialValue;

export const selectBankFeeUlps = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.bankFeeUlps || "0",
);

export const selectRedeemFeeUlps = createSelector(selectBankTransferFlow, bankTransferFlow =>
  bankTransferFlow.redeem ? bankTransferFlow.redeem.bankFeeUlps : "0",
);

/**
 * Check whether bank account is verified.
 * Tree conditions must be met:
 * 1. User is verified (by API and Contract)
 * 2. User has bank account in API
 * 3. User has bank account in contract (IdentityRegistry)
 */
export const selectIsBankAccountVerified = createSelector<
  IAppState,
  DeepReadonly<TBankAccount> | undefined,
  TClaims | undefined,
  boolean
>(selectBankAccount, selectClaims, (bankAccount, claims) => {
  // claims and bankAccount can be undefined while loading
  if (claims && bankAccount) {
    return bankAccount.hasBankAccount && claims.hasBankAccount;
  }

  return false;
});
