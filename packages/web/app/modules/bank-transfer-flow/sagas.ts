import BigNumber from "bignumber.js";
import { takeEvery } from "redux-saga";
import { all, fork, put, select, take } from "redux-saga/effects";

import { hashFromIpfsLink } from "../../components/documents/utils";
import { getRedeemValueUlps } from "../../components/modals/tx-sender/redeem/utils";
import { isEmptyValue, isValidNumber } from "../../components/shared/formatters/utils";
import { BankTransferFlowMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { TKycBankTransferPurpose } from "../../lib/api/kyc/KycApi.interfaces";
import { calculateBankFee, subtractBankFee } from "../../utils/BankArithmetics";
import { invariant } from "../../utils/invariant";
import { convertFromUlps } from "../../utils/NumberUtils";
import { actions, TActionFromCreator } from "../actions";
import { selectIsUserFullyVerified } from "../auth/selectors";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectLiquidEuroTokenBalance } from "../wallet/selectors";
import {
  selectBankTransferFlowReference,
  selectIsBankAccountVerified,
  selectIsBankTransferModalOpened,
  selectRedeemFeeUlps,
} from "./selectors";
import { ICalculatedRedeemData } from "./types";

function* generateReference({ apiKycService }: TGlobalDependencies): Iterable<any> {
  const { purpose }: TKycBankTransferPurpose = yield apiKycService.nEurPurchaseRequestPreparation();

  return purpose;
}

function* start(
  { logger, notificationCenter, contractsService }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.bankTransferFlow.startBankTransfer>,
): any {
  try {
    const isAllowed: boolean = yield select(selectIsUserFullyVerified);

    invariant(isAllowed, "Bank Flow is not allowed, account is not verified completely");

    const transferType = action.payload.type;

    const reference: string = yield neuCall(generateReference);

    const minEuroUlps: BigNumber = yield contractsService.euroTokenController
      .minDepositAmountEurUlps;

    yield put(
      actions.bankTransferFlow.setTransferDetails(transferType, minEuroUlps.toString(), reference),
    );

    const isVerified: boolean = yield select(selectIsBankAccountVerified);

    // Only show agreement when bank account was not yet verified
    if (!isVerified) {
      yield put(actions.bankTransferFlow.continueToAgreement());
      yield take(actions.bankTransferFlow.continueProcessing);
    }

    yield put(actions.bankTransferFlow.continueToSummary());
  } catch (e) {
    yield put(actions.bankTransferFlow.stopBankTransfer());

    notificationCenter.error(createMessage(BankTransferFlowMessage.BANK_TRANSFER_FLOW_ERROR));

    logger.error(`Failed to start bank transfer flow`, e);
  }
}

function* stop(): any {
  const isInProgress: boolean = yield select(selectIsBankTransferModalOpened);

  if (isInProgress) {
    yield put(actions.bankTransferFlow.stopBankTransfer());
  }
}

function* downloadNEurTokenAgreement({ contractsService, intlWrapper }: TGlobalDependencies): any {
  const [, , agreementHashWithIpfs] = yield contractsService.euroToken.currentAgreement();

  const agreementHash = hashFromIpfsLink(agreementHashWithIpfs);

  yield put(
    actions.immutableStorage.downloadImmutableFile(
      {
        ipfsHash: agreementHash,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        asPdf: true,
      },
      intlWrapper.intl.formatIntlMessage(
        "bank-verification.info.download-neur-token-agreement.file-name",
      ),
    ),
  );
}

export function* getRedeemData({ contractsService }: TGlobalDependencies): any {
  const { bankFeeUlps, minEuroUlps } = yield all({
    bankFeeUlps: contractsService.euroTokenController.withdrawalFeeFraction,
    minEuroUlps: contractsService.euroTokenController.minWithdrawAmountEurUlps,
  });

  yield put(actions.bankTransferFlow.setRedeemData(bankFeeUlps.toString(), minEuroUlps.toString()));
}

export function* completeBankTransfer({ apiKycService, logger }: TGlobalDependencies): any {
  try {
    const reference: string = yield select(selectBankTransferFlowReference);

    // TODO: replace by correct amount when implemented
    yield apiKycService.nEurPurchaseRequest("1", reference);
  } catch (e) {
    logger.error(`Not able to complete bank transfer`, e);
  }
}

/**
 * This saga calculates values to be displayed to user
 *
 * @param {string} amount - value provided by user
 */
export function* calculateRedeemData(amount: string): Iterator<any> {
  const walletBalanceUlps: string = yield select(selectLiquidEuroTokenBalance);
  const bankFeeFractionUlps: string = yield select(selectRedeemFeeUlps);

  // by default use BANKING_AMOUNT_SCALE as decimal precision
  const providedAmountUlps = getRedeemValueUlps(walletBalanceUlps, amount);
  // use all decimal places without rounding
  const providedAmountDec = convertFromUlps(providedAmountUlps);

  const totalRedeemed = subtractBankFee(providedAmountUlps, bankFeeFractionUlps);
  const bankFee = calculateBankFee(providedAmountUlps, totalRedeemed);

  return {
    amount: providedAmountDec,
    amountUlps: providedAmountUlps,
    bankFee,
    totalRedeemed,
  };
}

export function* calculateRedeemDataSaga(
  action: TActionFromCreator<typeof actions.bankTransferFlow.calculateRedeemData>,
): Iterator<any> {
  const amount = action.payload.amount;
  if (!isValidNumber(amount) || (isEmptyValue(amount) && 0)) {
    return;
  }
  const calculatedData: ICalculatedRedeemData = yield calculateRedeemData(amount);

  yield put(actions.bankTransferFlow.setCalculatedRedeemData(calculatedData));
}

export function* bankTransferFlowSaga(): any {
  yield fork(neuTakeEvery, actions.bankTransferFlow.startBankTransfer, start);
  yield fork(neuTakeEvery, actions.bankTransferFlow.continueToSuccess, completeBankTransfer);
  yield fork(
    neuTakeEvery,
    actions.bankTransferFlow.downloadNEurTokenAgreement,
    downloadNEurTokenAgreement,
  );
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", stop);
  yield fork(neuTakeEvery, actions.bankTransferFlow.getRedeemData, getRedeemData);
  yield takeEvery(actions.bankTransferFlow.calculateRedeemData, calculateRedeemDataSaga);
}
