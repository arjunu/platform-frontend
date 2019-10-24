import { effects } from "redux-saga";
import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { isJwtExpiringLateEnough } from "../../utils/JWTUtils";
import { actions, TActionFromCreator } from "../actions";
import { loadJwt, setJwt } from "../auth/jwt/sagas";
import { loadUser } from "../auth/user/external/sagas";
import { initializeContracts, populatePlatformTermsConstants } from "../contracts/sagas";
import { neuCall, neuTakeEvery, neuTakeOnly } from "../sagasUtils";
import { detectUserAgent } from "../user-agent/sagas";
import { initWeb3ManagerEvents } from "../web3/sagas";
import { WalletMetadataNotFoundError } from "./errors";
import { EInitType } from "./reducer";
import { selectIsSmartContractInitDone } from "./selectors";

function* initSmartcontracts({ web3Manager, logger }: TGlobalDependencies): any {
  try {
    yield fork(neuCall, initWeb3ManagerEvents);
    yield web3Manager.initialize();

    yield neuCall(initializeContracts);
    yield neuCall(populatePlatformTermsConstants);

    yield put(actions.init.done(EInitType.START_CONTRACTS_INIT));
  } catch (e) {
    yield put(
      actions.init.error(
        EInitType.START_CONTRACTS_INIT,
        "Error while connecting with Ethereum blockchain",
      ),
    );
    logger.error("Smart Contract Init Error", e);
  }
}

function* makeSureWalletMetaDataExists({ walletStorage }: TGlobalDependencies): Iterator<any> {
  const metadata = walletStorage.get();
  if (metadata === undefined) {
    throw new WalletMetadataNotFoundError();
  }
}

function* initApp({ logger }: TGlobalDependencies): any {
  try {
    yield neuCall(detectUserAgent);

    const jwt = yield neuCall(loadJwt);

    if (jwt) {
      yield neuCall(makeSureWalletMetaDataExists);
      if (isJwtExpiringLateEnough(jwt)) {
        try {
          yield waitUntilSmartContractsAreInitialized();

          yield neuCall(setJwt, jwt);
          yield neuCall(loadUser);
          yield put(actions.auth.finishSigning());
        } catch (e) {
          yield put(actions.auth.logout());
          logger.error(
            "Cannot retrieve account. This could happen b/c account was deleted on backend",
          );
        }
      } else {
        yield put(actions.auth.logout());
        logger.info("JTW expiring too soon.");
      }
    }

    yield put(actions.init.done(EInitType.APP_INIT));
  } catch (e) {
    if (e instanceof WalletMetadataNotFoundError) {
      logger.error("User has JWT but no Wallet Metadata", e);
      yield put(actions.auth.logout());
    } else {
      yield put(actions.init.error(EInitType.APP_INIT, e.message || "Unknown error"));
      logger.error("App init error", e);
    }
  }
}

export function* initStartSaga(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.init.start>,
): Iterator<any> {
  const { initType } = action.payload;

  switch (initType) {
    case EInitType.APP_INIT:
      return yield neuCall(initApp);
    case EInitType.START_CONTRACTS_INIT:
      return yield neuCall(initSmartcontracts);
    default:
      throw new Error("Unrecognized init type!");
  }
}

export function* checkIfSmartcontractsInitNeeded(): any {
  const isDoneOrInProgress: boolean = yield select(
    (s: IAppState) => s.init.smartcontractsInit.done || s.init.smartcontractsInit.inProgress,
  );

  return !isDoneOrInProgress;
}

export function* initSmartcontractsOnce(): any {
  const isNeeded = yield checkIfSmartcontractsInitNeeded();
  if (!isNeeded) {
    return;
  }

  yield put(actions.init.start(EInitType.START_CONTRACTS_INIT));
}

export function* waitUntilSmartContractsAreInitialized(): Iterator<any> {
  const isSmartContractsInitialized = yield select(selectIsSmartContractInitDone);

  if (!isSmartContractsInitialized) {
    yield neuTakeOnly(actions.init.done, { initType: EInitType.START_CONTRACTS_INIT });
  }
  return;
}

export const initSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "INIT_START", initStartSaga);
  // Smart Contracts are only initialized once during the whole life cycle of the app
  yield fork(initSmartcontractsOnce);
};
