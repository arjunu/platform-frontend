import { put, take } from "@neufund/sagas";

import { TMessage } from "../../components/translatedMessages/utils";
import { actions } from "../actions";

export function* displayInfoModalSaga(title: TMessage, description?: TMessage): any {
  yield put(actions.genericModal.showInfoModal(title, description));

  // wait until its dismissed
  yield take(actions.genericModal.hideGenericModal);
}

export function* displayErrorModalSaga(title: TMessage, description?: TMessage): any {
  yield put(actions.genericModal.showErrorModal(title, description));

  // wait until its dismissed
  yield take(actions.genericModal.hideGenericModal);
}
