import { fork, put, select } from "redux-saga/effects";

import { neuCall, neuTakeEvery } from "../sagasUtils";
import { actions, TActionFromCreator } from "../actions";
import { loadEtoWithCompanyAndContract } from "../eto/sagas";
import { TGlobalDependencies } from "../../di/setupBindings";
import { createMessage } from "../../components/translatedMessages/utils";
import { EtoMessage } from "../../components/translatedMessages/messages";
import { selectIsUserVerifiedOnBlockchain } from "../kyc/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../eto/types";

export function* loadInvestorEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>
) {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(loadEtoWithCompanyAndContract, payload.previewCode);
    const userIsFullyVerified = yield select(selectIsUserVerifiedOnBlockchain);

    yield put(actions.etoView.setEtoViewData({ eto, userIsFullyVerified }));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}


export function* etoViewSagas(): any {
  yield fork(neuTakeEvery, actions.etoView.loadInvestorEtoView, loadInvestorEtoView);
}
