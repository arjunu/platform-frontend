import BigNumber from "bignumber.js";
import { fork, put, select, take, takeLatest } from "redux-saga/effects";

import { Q18 } from "../../../../config/constants";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { multiplyBigNumbers, subtractBigNumbers } from "../../../../utils/BigNumberUtils";
import { actions, TActionFromCreator } from "../../../actions";
import { neuCall, neuDebounce } from "../../../sagasUtils";
import { selectLiquidEtherBalance } from "../../../wallet/selectors";
import { generateRandomEthereumAddress, isAddressValid } from "../../../web3/utils";
import { generateEthWithdrawTransaction } from "../../transactions/withdraw/sagas";
import { ETxSenderType } from "../../types";
import { EValidationState } from "../../validator/reducer";
import { selectTxValidationState } from "../../validator/selectors";
import { SmartContractDoesNotAcceptEtherError } from "../../validator/withdraw/errors";
import { isAddressValidAcceptsEther } from "../../validator/withdraw/sagas";
import { toFormValueEth } from "./utils";

export function* getMaxWithdrawAmount(to: string | undefined): Iterator<any> {
  const maxEtherUlps = yield select(selectLiquidEtherBalance);

  const txDetails = yield neuCall(generateEthWithdrawTransaction, {
    to: to || generateRandomEthereumAddress(),
    valueUlps: maxEtherUlps,
  });

  const costUlps = multiplyBigNumbers([txDetails.gasPrice, txDetails.gas]);
  const valueUlps = subtractBigNumbers([maxEtherUlps, costUlps]);

  const maximumAvailableEther = new BigNumber(valueUlps).div(Q18).toString();
  return maximumAvailableEther;
}

export function* detectMaxWithdraw(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.txUserFlowWithdraw.runUserFlowOperations>,
): Iterator<any> {
  // Add case where address is undefined
  // Add case where value is undefined
  const { to, value } = action.payload;

  let modifiedValue = value;

  const maxAvailEther = yield select(selectLiquidEtherBalance);
  const fixedEther = toFormValueEth(maxAvailEther);

  const modifiedTo = isAddressValid(to) ? to : generateRandomEthereumAddress();

  if (fixedEther === value) {
    try {
      yield neuCall(isAddressValidAcceptsEther, modifiedTo, modifiedValue);
      modifiedValue = yield getMaxWithdrawAmount(modifiedTo);
    } catch (error) {
      if (error instanceof SmartContractDoesNotAcceptEtherError) {
        modifiedValue = yield getMaxWithdrawAmount(generateRandomEthereumAddress());
      }
    }
  }
  yield put(
    actions.txValidator.validateDraft({ to, value: modifiedValue, type: ETxSenderType.WITHDRAW }),
  );
  yield put(
    actions.txUserFlowWithdraw.setTxUserFlowInputData({
      to,
      value,
    }),
  );
}

export function* userFlowAcceptForm(): Iterator<any> {
  // This assumes that the user clicked submit
  let validationState;
  yield take(actions.txValidator.setValidationState.getType());
  while (true) {
    validationState = yield select(selectTxValidationState);
    if (validationState === undefined || validationState === EValidationState.VALIDATING) {
      yield take(actions.txValidator.setValidationState.getType());
    } else break;
  }
  if (validationState === EValidationState.VALIDATION_OK) {
    yield put(actions.txSender.txSenderAcceptDraft());
  }
}

export function* clearValidationSaga(): Iterator<any> {
  yield put(actions.txValidator.setValidationState(EValidationState.OUTDATED));
}

export const txUserFlowSagasWatcher = function*(): Iterator<any> {
  yield fork(neuDebounce, 300, actions.txUserFlowWithdraw.runUserFlowOperations, detectMaxWithdraw);
  yield takeLatest(actions.txUserFlowWithdraw.runUserFlowOperations, clearValidationSaga);
  yield takeLatest(actions.txUserFlowWithdraw.userFlowAcceptForm, userFlowAcceptForm);
};

// TODO: Add dedicated tests for detectMaxWithdraw
