import { delay, END, eventChannel, Task } from "redux-saga";
import { call, cancel, fork, put, take } from "redux-saga/effects";

import {
  LIGHT_WALLET_PASSWORD_CACHE_TIME,
  LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME,
} from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { LightWallet } from "../../lib/web3/light-wallet/LightWallet";
import { EWeb3ManagerEvents } from "../../lib/web3/Web3Manager/Web3Manager";
import { actions, TAction } from "../actions";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { EWalletType, TWalletMetadata } from "./types";

let lockWalletTask: Task | undefined;

export function* autoLockLightWallet({ web3Manager, logger }: TGlobalDependencies): Iterator<any> {
  logger.info(`Resetting light wallet password in ${LIGHT_WALLET_PASSWORD_CACHE_TIME} ms`);

  yield call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME);

  if (web3Manager.personalWallet) {
    logger.info("Resetting light wallet password now");
    yield put(actions.web3.walletLocked());
    (web3Manager.personalWallet as LightWallet).password = undefined;
  }
}

export function* autoClearWalletPrivateDataWatcher({ logger }: TGlobalDependencies): Iterator<any> {
  logger.info(`Clearing wallet private data in ${LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME} ms`);

  yield call(delay, LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME);

  logger.info("Clearing wallet private data now");
  yield put(actions.web3.clearWalletPrivateDataFromState()); //Better to clear the seed here as well
}

export function* autoLockLightWalletWatcher(
  _deps: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (lockWalletTask) {
    yield cancel(lockWalletTask);
  }
  if (
    action.type === "NEW_PERSONAL_WALLET_PLUGGED" &&
    action.payload.walletMetadata.walletType !== EWalletType.LIGHT
  ) {
    return;
  }
  lockWalletTask = yield neuCall(autoLockLightWallet);
}

export function* cancelLocking(): Iterator<any> {
  if (lockWalletTask) {
    yield cancel(lockWalletTask);
  }
}

export function* loadPreviousWallet({ walletStorage }: TGlobalDependencies): Iterator<any> {
  const storageData = walletStorage.get();

  if (storageData) {
    yield put(actions.web3.loadPreviousWallet(storageData));
  }
}

type TChannelTypes = {
  type: EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED;
  payload: { isUnlocked: boolean; metaData: TWalletMetadata };
};

export function* initWeb3ManagerEvents({ web3Manager }: TGlobalDependencies): any {
  const channel = eventChannel<TChannelTypes>(emit => {
    web3Manager.on(EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED, payload =>
      emit({ type: EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED, payload }),
    );

    return () => {
      web3Manager.removeAllListeners();
    };
  });

  while (true) {
    const event: TChannelTypes | END = yield take(channel);
    switch (event.type) {
      case EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED:
        yield put(
          actions.web3.newPersonalWalletPlugged(event.payload.metaData, event.payload.isUnlocked),
        );
        break;
    }
  }
}

export const web3Sagas = function*(): Iterator<any> {
  yield fork(
    neuTakeEvery,
    ["NEW_PERSONAL_WALLET_PLUGGED", "WEB3_WALLET_UNLOCKED"],
    autoLockLightWalletWatcher,
  );
  yield fork(
    neuTakeEvery,
    ["NEW_PERSONAL_WALLET_PLUGGED", "WEB3_WALLET_UNLOCKED"],
    autoClearWalletPrivateDataWatcher,
  );
  yield fork(
    neuTakeEvery,
    [actions.web3.personalWalletDisconnected, "WEB3_WALLET_LOCKED"],
    cancelLocking,
  );
};
