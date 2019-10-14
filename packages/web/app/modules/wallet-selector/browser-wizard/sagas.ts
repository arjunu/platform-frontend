import { delay } from "redux-saga";
import { fork, put, race, select, take } from "redux-saga/effects";

import { BrowserWalletErrorMessage } from "../../../components/translatedMessages/messages";
import { BROWSER_WALLET_RECONNECT_INTERVAL } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import {
  BrowserWallet,
  BrowserWalletAccountApprovalRejectedError,
} from "../../../lib/web3/browser-wallet/BrowserWallet";
import { IAppState } from "../../../store";
import { actions } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { mapBrowserWalletErrorToErrorMessage } from "./errors";

export function* browserWalletConnectionWatcher(): any {
  while (true) {
    // does it really wait to connection to finish? if my machine is slow then I can get
    // many connection request to Metamask: I accept first one but then after some time next sign message appears
    // each of those result in valid login action and going to dashboard, even if I'm already logged in
    // so we have races/calls done without waiting for the connect action to complete
    yield neuCall(tryConnectingWithBrowserWallet);

    const { success } = yield race({
      fail: take("BROWSER_WALLET_CONNECTION_ERROR"),
      success: take(["@@router/LOCATION_CHANGE", actions.walletSelector.connected]),
    });

    if (success) {
      return;
    }

    yield delay(BROWSER_WALLET_RECONNECT_INTERVAL);
  }
}

export function* tryConnectingWithBrowserWallet({
  browserWalletConnector,
  web3Manager,
  logger,
}: TGlobalDependencies): any {
  const state: IAppState = yield select();

  if (!state.browserWalletWizardState.approvalRejected) {
    try {
      const browserWallet: BrowserWallet = yield browserWalletConnector.connect(
        web3Manager.networkId,
      );
      // todo: why to do it here if ensureWalletConnection does it?
      yield web3Manager.plugPersonalWallet(browserWallet);
      yield put(actions.walletSelector.connected());
    } catch (e) {
      if (e instanceof BrowserWalletAccountApprovalRejectedError) {
        yield put(actions.walletSelector.browserWalletAccountApprovalRejectedError());
      } else {
        const error = mapBrowserWalletErrorToErrorMessage(e);
        yield put(actions.walletSelector.browserWalletConnectionError(error));
        if (error.messageType === BrowserWalletErrorMessage.GENERIC_ERROR) {
          logger.error("Error while trying to connect with browser wallet", e);
        }
      }
    }
  }
}

export function* browserWalletSagas(): Iterator<any> {
  // todo: seems that we have another watcher over web3ConnectionWatcher
  yield fork(neuTakeEvery, "BROWSER_WALLET_TRY_CONNECTING", browserWalletConnectionWatcher);
}
