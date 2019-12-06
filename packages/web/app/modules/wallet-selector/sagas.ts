import { fork, put } from "redux-saga/effects";

import { actions } from "../actions";
import { handleSignInUser } from "../auth/user/sagas";
import { neuCall, neuTakeEvery, neuTakeLatestUntil } from "../sagasUtils";
import { loadPreviousWallet } from "../web3/sagas";

export function* walletSelectorConnect(): Generator<any, any, any> {
  yield put(actions.walletSelector.messageSigning());

  yield neuCall(handleSignInUser);
}

export function* walletSelectorReset(): Generator<any, any, any> {
  yield neuCall(loadPreviousWallet);
}

export function* walletSelectorSagas(): Generator<any, any, any> {
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.connected,
    actions.walletSelector.reset,
    walletSelectorConnect,
  );
  yield fork(neuTakeEvery, actions.walletSelector.reset, walletSelectorReset);
}
