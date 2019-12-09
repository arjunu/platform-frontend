import { fork, put } from "@neufund/sagas";

import { hashFromIpfsLink } from "../../components/documents/utils";
import { AuthMessage, ToSMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { EJwtPermissions } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IUser } from "../../lib/api/users/interfaces";
import { actions } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { waitUntilSmartContractsAreInitialized } from "../init/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";

/**
 * Handle ToS / agreement
 */
export function* getCurrentAgreementHash({
  contractsService,
  logger,
}: TGlobalDependencies): Generator<any, any, any> {
  yield waitUntilSmartContractsAreInitialized();

  logger.info("Loading current agreement hash");

  try {
    const result = yield contractsService.universeContract.currentAgreement();
    let currentAgreementHash = result[2] as string;
    return hashFromIpfsLink(currentAgreementHash);
  } catch (e) {
    logger.error("Could not load current agreement", e);
    throw e;
  }
}

function* handleAcceptCurrentAgreementEffect({ apiUserService }: TGlobalDependencies): any {
  const currentAgreementHash: string = yield neuCall(getCurrentAgreementHash);

  const user: IUser = yield apiUserService.setLatestAcceptedTos(currentAgreementHash);
  yield put(actions.auth.setUser(user));
}

function* handleAcceptCurrentAgreement({
  logger,
  notificationCenter,
}: TGlobalDependencies): Generator<any, any, any> {
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(handleAcceptCurrentAgreementEffect),
      [EJwtPermissions.SIGN_TOS],
      createMessage(ToSMessage.TOS_ACCEPT_PERMISSION_TITLE),
      createMessage(ToSMessage.TOS_ACCEPT_PERMISSION_TEXT),
    );
  } catch (e) {
    notificationCenter.error(createMessage(AuthMessage.AUTH_TOC_ACCEPT_ERROR));
    logger.error("Could not accept Terms and Conditions", e);
  }
}

export const termsOfServiceSagas = function*(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.tosModal.acceptCurrentTos, handleAcceptCurrentAgreement);
};
