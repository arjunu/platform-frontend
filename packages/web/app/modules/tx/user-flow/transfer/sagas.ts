import { put, select, take, takeLatest } from "redux-saga/effects";

import { actions } from "../../../actions";
import { selectTxValidationState } from "../../validator/selectors";
import { EValidationState } from "./../../validator/reducer";

export function* userFlowAcceptForm(): Iterator<any> {
  // This assumes that the user clicked submit
  let validationState;
  yield take(actions.txValidator.setValidationState);
  while (true) {
    validationState = yield select(selectTxValidationState);
    if (validationState === undefined || validationState === EValidationState.VALIDATING) {
      yield take(actions.txValidator.setValidationState);
    } else break;
  }
  if (validationState === EValidationState.VALIDATION_OK) {
    yield put(actions.txSender.txSenderAcceptDraft());
  }
}

export const txTransferUserFlowSagasWatcher = function*(): Iterator<any> {
  yield takeLatest(actions.txUserFlowTransfer.userFlowAcceptForm, userFlowAcceptForm);
};
