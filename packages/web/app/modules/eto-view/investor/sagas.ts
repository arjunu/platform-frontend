import { match } from "react-router";
import { fork, put } from "redux-saga/effects";
import { call, select } from "typed-redux-saga";

import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EJurisdiction } from "../../../lib/api/eto/EtoProductsApi.interfaces";
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
  routeMatch: match<{ jurisdiction: EJurisdiction }>,
): Generator<any, any, any> {
  yield call(ensureEtoJurisdiction, eto.product.jurisdiction, routeMatch.params.jurisdiction);

  const userIsFullyVerified = yield select(selectIsUserVerifiedOnBlockchain);

  yield put(actions.eto.verifyEtoAccess(eto, userIsFullyVerified));

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

export function* saveEto(eto: TEtoWithCompanyAndContractReadonly): Generator<any, any, any> {
  // this is for backwards compatibility with other flows, e.g. investment
  if (eto.contract) {
    yield put(actions.eto.setEtoDataFromContract(eto.previewCode, eto.contract));
  }
  yield put(actions.eto.setEto({ eto, company: eto.company }));
}

export function* loadInvestorEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  {
    payload: { previewCode, routeMatch },
  }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>,
): Generator<any, any, any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContract,
      previewCode,
    );
    yield call(saveEto, eto);

    const etoData = yield call(loadInvestorEtoViewInternal, eto, routeMatch);
    yield put(actions.etoView.setEtoViewData(etoData));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadInvestorEtoViewById(
  { logger, notificationCenter }: TGlobalDependencies,
  {
    payload: { etoId, routeMatch },
  }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoViewById>,
): Generator<any, any, any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContractById,
      etoId,
    );
    yield call(saveEto, eto);

    const etoData = yield call(loadInvestorEtoViewInternal, eto, routeMatch);
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
