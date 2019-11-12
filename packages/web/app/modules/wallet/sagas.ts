import * as promiseAll from "promise-all";
import { delay } from "redux-saga";
import { fork, put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { ICBMLockedAccount } from "../../lib/contracts/ICBMLockedAccount";
import { LockedAccount } from "../../lib/contracts/LockedAccount";
import { EthereumAddress } from "../../utils/opaque-types/types";
import { actions } from "../actions";
import { numericValuesToString } from "../contracts/utils";
import { waitUntilSmartContractsAreInitialized } from "../init/sagas";
import { neuCall, neuTakeEvery, neuTakeUntil } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { ILockedWallet, IWalletStateData } from "./reducer";

const WALLET_DATA_FETCHING_INTERVAL = 12000;

function* loadWalletDataSaga({ logger }: TGlobalDependencies): any {
  try {
    const ethAddress = yield select(selectEthereumAddressWithChecksum);
    yield put(actions.gas.gasApiEnsureLoading());
    yield take(actions.gas.gasApiLoaded);

    const state: IWalletStateData = yield neuCall(loadWalletDataAsync, ethAddress);
    yield put(actions.wallet.saveWalletData(state));
    logger.info("Wallet Loaded");
  } catch (e) {
    yield put(actions.wallet.loadWalletDataError("Error while loading wallet data."));
    logger.error("Error while loading wallet data: ", e);
  }
}

async function loadICBMWallet(
  ethAddress: EthereumAddress,
  lockedAccount?: ICBMLockedAccount | LockedAccount,
): Promise<ILockedWallet> {
  if (lockedAccount) {
    const balance = await lockedAccount.balanceOf(ethAddress);
    return numericValuesToString({
      LockedBalance: balance[0],
      neumarksDue: balance[1],
      unlockDate: balance[2],
    });
  } else {
    // todo: may be removed when contracts deployed on production
    return {
      LockedBalance: "0",
      neumarksDue: "0",
      unlockDate: "0",
    };
  }
}

export async function loadWalletDataAsync(
  { contractsService, web3Manager }: TGlobalDependencies,
  ethAddress: EthereumAddress,
): Promise<IWalletStateData> {
  return {
    ...(await promiseAll({
      euroTokenICBMLockedWallet: loadICBMWallet(ethAddress, contractsService.icbmEuroLock),
      etherTokenICBMLockedWallet: loadICBMWallet(ethAddress, contractsService.icbmEtherLock),
      euroTokenLockedWallet: loadICBMWallet(ethAddress, contractsService.euroLock),
      etherTokenLockedWallet: loadICBMWallet(ethAddress, contractsService.etherLock),
      etherTokenUpgradeTarget: contractsService.icbmEtherLock.currentMigrationTarget,
      euroTokenUpgradeTarget: contractsService.icbmEuroLock.currentMigrationTarget,
    })),
    ...numericValuesToString(
      await promiseAll({
        etherTokenBalance: contractsService.etherToken.balanceOf(ethAddress),
        euroTokenBalance: contractsService.euroToken.balanceOf(ethAddress),
        etherBalance: web3Manager.internalWeb3Adapter.getBalance(ethAddress),
        neuBalance: contractsService.neumark.balanceOf(ethAddress),
      }),
    ),
  };
}

function* walletBalanceWatcher(): any {
  yield waitUntilSmartContractsAreInitialized();

  while (true) {
    yield neuCall(loadWalletDataSaga);
    yield delay(WALLET_DATA_FETCHING_INTERVAL);
  }
}

export function* walletSagas(): any {
  yield fork(neuTakeEvery, "WALLET_LOAD_WALLET_DATA", loadWalletDataSaga);
  yield neuTakeUntil(actions.auth.setUser, actions.auth.logout, walletBalanceWatcher);
}
