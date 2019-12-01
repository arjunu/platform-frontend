import { call, fork, put, select } from "redux-saga/effects";

import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../actions";
import { loadIssuerEto } from "../../eto-flow/sagas";
import { selectIssuerEtoWithCompanyAndContract } from "../../eto-flow/selectors";
import { loadEtoWithCompanyAndContract } from "../../eto/sagas";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { calculateCampaignOverviewDataIssuer } from "../shared/sagas";
import { EEtoViewType, TCampaignOverviewData } from "../shared/types";

export function* loadIssuerEtoView({
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  try {
    let eto = yield select(selectIssuerEtoWithCompanyAndContract);
    if (eto === undefined) {
      yield neuCall(loadIssuerEto);
      eto = yield select(selectIssuerEtoWithCompanyAndContract);
    }

    const campaignOverviewData: TCampaignOverviewData = yield call(
      calculateCampaignOverviewDataIssuer,
      eto,
    );

    yield put(
      actions.etoView.setEtoViewData({
        eto,
        campaignOverviewData,
        etoViewType: EEtoViewType.ETO_VIEW_ISSUER,
      }),
    );
  } catch (e) {
    logger.error("Could not load eto", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadIssuerEtoPreview(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>,
): Iterator<any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContract,
      payload.previewCode,
    );

    if (eto) {
      const campaignOverviewData: TCampaignOverviewData = yield call(
        calculateCampaignOverviewDataIssuer,
        eto,
      );

      yield put(
        actions.etoView.setEtoViewData({
          eto,
          campaignOverviewData,
          etoViewType: EEtoViewType.ETO_VIEW_ISSUER_PREVIEW,
        }),
      );
    }
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoViewIssuerSagas(): any {
  yield fork(neuTakeEvery, actions.etoView.loadIssuerEtoView, loadIssuerEtoView);
  yield fork(neuTakeEvery, actions.etoView.loadIssuerPreviewEtoView, loadIssuerEtoPreview);
}
