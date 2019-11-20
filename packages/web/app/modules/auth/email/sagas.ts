import { Effect, fork, put, select } from "redux-saga/effects";

import { AuthMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EUserType, IVerifyEmailUser } from "../../../lib/api/users/interfaces";
import { EmailAlreadyExists } from "../../../lib/api/users/UsersApi";
import { TStoredWalletMetadata } from "../../../lib/persistence/WalletStorage";
import { IAppState } from "../../../store";
import { actions } from "../../actions";
import { userHasKycAndEmailVerified } from "../../eto-flow/selectors";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import {
  selectActivationCodeFromQueryString,
  selectEmailFromQueryString,
} from "../../web3/selectors";
import { EWalletType } from "../../web3/types";
import { selectUserEmail, selectUserType, selectVerifiedUserEmail } from "../selectors";
import { ELogoutReason } from "../types";
import { loadUser } from "../user/external/sagas";

/**
 * Email Verification
 */
export function* verifyUserEmail({
  notificationCenter,
  walletStorage,
}: TGlobalDependencies): Iterator<any> {
  const userCode = yield select(selectActivationCodeFromQueryString);
  const urlEmail = yield select(selectEmailFromQueryString);
  const userEmail = yield select((s: IAppState) => selectUserEmail(s.auth));

  if (userEmail && userEmail !== urlEmail) {
    // Logout if there is different user session active
    yield put(actions.auth.logout({ logoutType: ELogoutReason.ALREADY_LOGGED_IN }));
    yield notificationCenter.error(
      {
        messageType: AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED_SAME_EMAIL,
      },
      { "data-test-id": "modules.auth.sagas.verify-user-email.toast.verification-failed" },
    );
    return;
  }

  const verifiedEmail = yield select((s: IAppState) => selectVerifiedUserEmail(s.auth));

  yield neuCall(verifyUserEmailPromise, userCode, urlEmail, verifiedEmail);
  yield neuCall(loadUser);

  const walletMetadata = walletStorage.get();
  // Update metadata email only when wallet type is LightWallet
  if (walletMetadata && walletMetadata.walletType === EWalletType.LIGHT) {
    const updatedMetadata: TStoredWalletMetadata = { ...walletMetadata, email: urlEmail };
    walletStorage.set(updatedMetadata);
  }

  const userType = yield select((s: IAppState) => selectUserType(s));
  const kycAndEmailVerified = yield select((s: IAppState) => userHasKycAndEmailVerified(s));

  if (!kycAndEmailVerified && userType === EUserType.NOMINEE) {
    yield put(actions.routing.goToDashboard());
  } else {
    yield put(actions.routing.goToProfile());
  }
}

export async function verifyUserEmailPromise(
  { apiUserService, notificationCenter }: TGlobalDependencies,
  userCode: IVerifyEmailUser,
  urlEmail: string,
  verifiedEmail: string,
): Promise<void> {
  if (urlEmail === verifiedEmail) {
    notificationCenter.info(createMessage(AuthMessage.AUTH_EMAIL_ALREADY_VERIFIED));
    return;
  }
  if (!userCode) return;
  try {
    await apiUserService.verifyUserEmail(userCode);
    notificationCenter.info(createMessage(AuthMessage.AUTH_EMAIL_VERIFIED));
  } catch (e) {
    if (e instanceof EmailAlreadyExists) {
      notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_ALREADY_EXISTS));
    } else {
      notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED));
    }
  }
}

export async function checkEmailPromise(
  { apiUserService }: TGlobalDependencies,
  email: string,
): Promise<boolean> {
  const emailStatus = await apiUserService.emailStatus(email);
  return emailStatus.isAvailable;
}

export function* authEmailSagas(): Iterator<Effect> {
  yield fork(neuTakeEvery, actions.auth.verifyEmail, verifyUserEmail);
}
