import { fork, put, select } from "redux-saga/effects";

import { MarketingEmailsMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";
import { neuTakeEvery } from "../sagasUtils";
import { selectUnsubscriptionLinkFromQueryString } from "./selectors";

function* unsubscribeEmail({
  marketingEmailsApi,
  notificationCenter,
  logger,
}: TGlobalDependencies): Generator<any, any, any> {
  const unsubscribeLink = yield select(selectUnsubscriptionLinkFromQueryString);

  if (!unsubscribeLink) {
    logger.error("Unsubscribe marketing emails link is empty");
    return;
  }

  try {
    yield marketingEmailsApi.unsubscribeMarketingEmails(unsubscribeLink);

    yield put(actions.routing.goToUnsubscriptionSuccess());
  } catch (e) {
    logger.error("Failed to unsubscribe from marketing emails", e);
    notificationCenter.error(createMessage(MarketingEmailsMessage.UNSUBSCRIBE_ERROR));
  }
}

export function* marketingEmailsSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.marketingEmails.unsubscribe, unsubscribeEmail);
}
