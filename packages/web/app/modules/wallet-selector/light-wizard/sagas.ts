import { call, fork, put, select } from "redux-saga/effects";

import {
  BackupRecoveryMessage,
  GenericErrorMessage,
  GenericModalMessage,
  SignInUserErrorMessage,
} from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { EJwtPermissions } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EUserType, IUser, IUserInput } from "../../../lib/api/users/interfaces";
import { EmailAlreadyExists, UserNotExisting } from "../../../lib/api/users/UsersApi";
import {
  LightError,
  LightWallet,
  LightWalletLocked,
} from "../../../lib/web3/light-wallet/LightWallet";
import {
  createLightWalletVault,
  deserializeLightWalletVault,
} from "../../../lib/web3/light-wallet/LightWalletUtils";
import { IPersonalWallet } from "../../../lib/web3/PersonalWeb3";
import { IAppState } from "../../../store";
import { invariant } from "../../../utils/invariant";
import { connectLightWallet } from "../../access-wallet/sagas";
import { actions, TActionFromCreator } from "../../actions";
import { checkEmailPromise } from "../../auth/email/sagas";
import { createJwt } from "../../auth/jwt/sagas";
import { selectUserType } from "../../auth/selectors";
import { createUser, loadUser, logoutUser, updateUser } from "../../auth/user/external/sagas";
import { userHasKycAndEmailVerified } from "../../eto-flow/selectors";
import { displayInfoModalSaga } from "../../generic-modal/sagas";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { selectIsUnlocked } from "../../web3/selectors";
import { EWalletSubType, ILightWalletMetadata } from "../../web3/types";
import { selectUrlUserType } from "../selectors";
import { mapLightWalletErrorToErrorMessage } from "./errors";
import { getWalletMetadataByURL } from "./metadata/sagas";
import { getVaultKey } from "./utils";

export const DEFAULT_HD_PATH = "m/44'/60'/0'";

export async function setupLightWalletPromise(
  { vaultApi, lightWalletConnector, web3Manager, logger }: TGlobalDependencies,
  email: string,
  password: string,
  seed?: string,
): Promise<ILightWalletMetadata> {
  try {
    const lightWalletVault = await createLightWalletVault({
      password,
      hdPathString: DEFAULT_HD_PATH,
      recoverSeed: seed,
    });
    const walletInstance = await deserializeLightWalletVault(
      lightWalletVault.walletInstance,
      lightWalletVault.salt,
    );

    const vaultKey = await getVaultKey(lightWalletVault.salt, password);
    await vaultApi.store(vaultKey, lightWalletVault.walletInstance);

    const lightWallet = await lightWalletConnector.connect(
      {
        walletInstance,
        salt: lightWalletVault.salt,
      },
      email,
      password,
    );

    await web3Manager.plugPersonalWallet(lightWallet);
    return lightWallet.getMetadata() as ILightWalletMetadata;
  } catch (e) {
    logger.warn("Error while trying to connect with light wallet: ", e);
    throw e;
  }
}

export function* lightWalletBackupWatch({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    const user: IUser = yield select((state: IAppState) => state.auth.user);
    yield neuCall(updateUser, { ...user, backupCodesVerified: true });
    yield call(
      displayInfoModalSaga,
      createMessage(BackupRecoveryMessage.BACKUP_SUCCESS_TITLE),
      createMessage(BackupRecoveryMessage.BACKUP_SUCCESS_DESCRIPTION),
    );
    yield neuCall(loadUser);

    const userType = yield select(selectUserType);
    const kycAndEmailVerified = yield select(userHasKycAndEmailVerified);

    if (!kycAndEmailVerified && userType === EUserType.NOMINEE) {
      yield put(actions.routing.goToDashboard());
    } else {
      yield put(actions.routing.goToProfile());
    }
  } catch (e) {
    logger.error("Light Wallet Backup Error", e);
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* loadSeedFromWalletWatch({
  logger,
  web3Manager,
}: TGlobalDependencies): Iterator<any> {
  try {
    const isUnlocked = yield select((s: IAppState) => selectIsUnlocked(s.web3));
    if (!isUnlocked) {
      throw new LightWalletLocked();
    }
    const lightWallet = web3Manager.personalWallet as LightWallet;
    const { seed, privateKey } = yield call(lightWallet.getWalletPrivateData);
    yield put(actions.web3.loadWalletPrivateDataToState(seed, privateKey));
  } catch (e) {
    logger.error("Load seed from wallet failed", e);
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* lightWalletRecoverWatch(
  { lightWalletConnector, web3Manager, apiUserService }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.walletSelector.lightWalletRecover>,
): Iterator<any> {
  try {
    const userType: EUserType = yield select((state: IAppState) => selectUrlUserType(state.router));

    const { password, email, seed } = action.payload;
    const walletMetadata: ILightWalletMetadata = yield neuCall(
      setupLightWalletPromise,
      email,
      password,
      seed,
    );

    yield neuCall(createJwt, [EJwtPermissions.CHANGE_EMAIL_PERMISSION]);
    const userUpdate: IUserInput = {
      salt: walletMetadata.salt,
      backupCodesVerified: true,
      type: userType,
      walletType: walletMetadata.walletType,
      walletSubtype: EWalletSubType.UNKNOWN,
    };
    const isEmailAvailable = yield neuCall(checkEmailPromise, email);
    try {
      const user: IUser = yield apiUserService.me();
      if (isEmailAvailable) {
        userUpdate.newEmail = walletMetadata.email;
        yield neuCall(updateUser, userUpdate);
      } else {
        if (user.verifiedEmail === email.toLowerCase()) yield neuCall(updateUser, userUpdate);
        else {
          throw new EmailAlreadyExists();
        }
      }
    } catch (e) {
      if (e instanceof UserNotExisting) {
        if (!isEmailAvailable) {
          throw new EmailAlreadyExists();
        }
        userUpdate.newEmail = walletMetadata.email;
        yield call(createUser, userUpdate);
      } else throw e;
    }

    const wallet: IPersonalWallet = yield connectLightWallet(
      lightWalletConnector,
      walletMetadata,
      password,
    );
    yield web3Manager.plugPersonalWallet(wallet);
    yield neuCall(logoutUser);

    yield put(actions.routing.goToSuccessfulRecovery());
  } catch (e) {
    yield neuCall(handleLightWalletError, e);
  }
}

export function* lightWalletRegisterWatch(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.walletSelector.lightWalletRegister>,
): Iterator<any> {
  try {
    const { password, email } = action.payload;
    const isEmailAvailable = yield neuCall(checkEmailPromise, email);

    if (!isEmailAvailable) {
      throw new EmailAlreadyExists();
    }
    yield neuCall(setupLightWalletPromise, email, password);
    yield put(actions.walletSelector.connected());
  } catch (e) {
    yield neuCall(handleLightWalletError, e);
  }
}

function* handleLightWalletError({ logger }: TGlobalDependencies, e: Error): any {
  yield put(actions.walletSelector.reset());

  let error;
  if (e instanceof EmailAlreadyExists) {
    error = createMessage(GenericErrorMessage.USER_ALREADY_EXISTS);
  } else if (e instanceof LightError) {
    logger.error("Light wallet recovery/register error", e);
    error = mapLightWalletErrorToErrorMessage(e);
  } else {
    error = createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE);
  }

  yield put(
    actions.genericModal.showErrorModal(createMessage(GenericModalMessage.ERROR_TITLE), error),
  );
}

export function* lightWalletLoginWatch(
  { web3Manager, lightWalletConnector, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.walletSelector.lightWalletLogin>,
): Iterator<any> {
  const { password } = action.payload;
  try {
    const walletMetadata: ILightWalletMetadata | undefined = yield call(
      getWalletMetadataByURL,
      password,
    );

    if (!walletMetadata) {
      return invariant(walletMetadata, "Missing metadata");
    }

    const wallet: LightWallet = yield connectLightWallet(
      lightWalletConnector,
      walletMetadata,
      password,
    );

    yield web3Manager.plugPersonalWallet(wallet);

    yield put(actions.walletSelector.connected());
  } catch (e) {
    logger.error("Light Wallet login error", e);
    yield put(actions.walletSelector.reset());
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* lightWalletSagas(): Iterator<any> {
  yield fork(neuTakeEvery, actions.walletSelector.lightWalletLogin, lightWalletLoginWatch);
  yield fork(neuTakeEvery, actions.walletSelector.lightWalletRegister, lightWalletRegisterWatch);
  yield fork(neuTakeEvery, actions.walletSelector.lightWalletBackedUp, lightWalletBackupWatch);
  yield fork(neuTakeEvery, actions.walletSelector.lightWalletRecover, lightWalletRecoverWatch);
  yield fork(neuTakeEvery, "WEB3_FETCH_SEED", loadSeedFromWalletWatch);
}
