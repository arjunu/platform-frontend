import { match } from "react-router";
import { call, fork, put, select } from "redux-saga/effects";

import { TEtoViewByIdMatch, TEtoViewByPreviewCodeMatch } from "../../../components/appRoutes";
import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../actions";
import { loadEtoWithCompanyAndContract, loadEtoWithCompanyAndContractById } from "../../eto/sagas";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { selectIsUserVerifiedOnBlockchain } from "../../kyc/selectors";
import { ensureEtoJurisdiction } from "../../routing/sagas";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { calculateCampaignOverviewData } from "../shared/sagas";
import { EEtoViewType, TCampaignOverviewData } from "../shared/types";

function* loadInvestorEtoViewInternal(
  eto: TEtoWithCompanyAndContractReadonly,
  routeMatch: match<TEtoViewByPreviewCodeMatch | TEtoViewByIdMatch>,
): Iterator<any> {
  yield call(ensureEtoJurisdiction, eto.product.jurisdiction, routeMatch.params.jurisdiction);

  const userIsFullyVerified = yield select(selectIsUserVerifiedOnBlockchain);

  yield put(actions.eto.verifyEtoAccess(eto, true));

  const campaignOverviewData: TCampaignOverviewData = yield call(
    calculateCampaignOverviewData,
    routeMatch,
    eto,
  );

  return {
    eto,
    userIsFullyVerified,
    campaignOverviewData,
    etoViewType: EEtoViewType.ETO_VIEW_INVESTOR,
  };
}

export function* loadInvestorEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>,
): Iterator<any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContract,
      payload.previewCode,
    );

    const etoData = yield call(loadInvestorEtoViewInternal, eto, payload.routeMatch);
    yield put(actions.etoView.setEtoViewData(etoData));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadInvestorEtoViewById(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoViewById>,
): Iterator<any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContractById,
      payload.etoId,
    );

    const etoData = yield call(loadInvestorEtoViewInternal, eto, payload.routeMatch);
    yield put(actions.etoView.setEtoViewData(etoData));
  } catch (e) {
    logger.error("Could not load eto", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO));
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoViewInvestorSagas(): any {
  yield fork(neuTakeEvery, actions.etoView.loadInvestorEtoView, loadInvestorEtoView);
  yield fork(neuTakeEvery, actions.etoView.loadInvestorEtoViewById, loadInvestorEtoViewById);
}
