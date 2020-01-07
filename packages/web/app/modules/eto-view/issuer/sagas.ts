import { fork, put } from "redux-saga/effects";
import { call, select } from "typed-redux-saga";

import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../actions";
import { loadIssuerEto } from "../../eto-flow/sagas";
import { selectIssuerEtoWithCompanyAndContract } from "../../eto-flow/selectors";
import { loadEtoWithCompanyAndContract, loadEtoWithCompanyAndContractById } from "../../eto/sagas";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import {
  calculateCampaignOverviewData,
  calculateCampaignOverviewDataIssuerNominee,
} from "../shared/sagas";
import { EEtoViewType, TCampaignOverviewData } from "../shared/types";

export function* selectOrLoadEto(): Generator<any, any, any> {
  let eto = yield select(selectIssuerEtoWithCompanyAndContract);
  if (eto === undefined) {
    yield neuCall(loadIssuerEto);
    eto = yield select(selectIssuerEtoWithCompanyAndContract);
  }
  return eto;
}

export function* loadIssuerEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  _: TActionFromCreator<typeof actions.etoView.loadIssuerEtoView>,
): Generator<any, any, any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly | undefined = yield call(selectOrLoadEto);

    if (eto) {
      const userIsFullyVerified = true;
      const etoViewType = EEtoViewType.ETO_VIEW_ISSUER;
      const campaignOverviewData: TCampaignOverviewData = yield call(
        calculateCampaignOverviewDataIssuerNominee,
        eto,
      );

      yield put(
        actions.etoView.setEtoViewData({
          eto,
          campaignOverviewData,
          userIsFullyVerified,
          etoViewType,
        }),
      );
    } else {
      throw new Error("could not load issuer eto");
    }
  } catch (e) {
    logger.error("Could not load eto", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadIssuerEtoPreview(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadIssuerPreviewEtoView>,
): Generator<any, any, any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContract,
      payload.previewCode,
    );

    if (eto) {
      const userIsFullyVerified = true;
      const etoViewType = EEtoViewType.ETO_VIEW_ISSUER_PREVIEW;

      const campaignOverviewData: TCampaignOverviewData = yield call(
        calculateCampaignOverviewData,
        payload.routeMatch,
        eto,
      );

      yield put(
        actions.etoView.setEtoViewData({
          eto,
          campaignOverviewData,
          userIsFullyVerified,
          etoViewType,
        }),
      );
    }
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadIssuerPreviewByIdEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadIssuerPreviewEtoViewById>,
): Generator<any, any, any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContractById,
      payload.etoId,
    );

    if (eto) {
      const userIsFullyVerified = true;
      const etoViewType = EEtoViewType.ETO_VIEW_ISSUER_PREVIEW;
      const campaignOverviewData: TCampaignOverviewData = yield call(
        calculateCampaignOverviewData,
        payload.routeMatch,
        eto,
      );

      yield put(
        actions.etoView.setEtoViewData({
          eto,
          campaignOverviewData,
          userIsFullyVerified,
          etoViewType,
        }),
      );
    }
  } catch (e) {
    logger.error("Could not load eto", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO));
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoViewIssuerSagas(): any {
  yield fork(neuTakeEvery, actions.etoView.loadIssuerEtoView, loadIssuerEtoView);
  yield fork(neuTakeEvery, actions.etoView.loadIssuerPreviewEtoView, loadIssuerEtoPreview);
  yield fork(
    neuTakeEvery,
    actions.etoView.loadIssuerPreviewEtoViewById,
    loadIssuerPreviewByIdEtoView,
  );
}
