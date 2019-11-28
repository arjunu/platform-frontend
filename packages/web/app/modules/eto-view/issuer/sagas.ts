import { call, fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { selectIssuerEtoWithCompanyAndContract } from "../../eto-flow/selectors";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { loadIssuerEto } from "../../eto-flow/sagas";
import { actions, TActionFromCreator } from "../../actions";
import { EEtoViewCampaignOverviewType, EEtoViewType, TCampaignOverviewData } from "../reducer";
import { createMessage } from "../../../components/translatedMessages/utils";
import { EtoMessage } from "../../../components/translatedMessages/messages";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { loadEtoWithCompanyAndContract } from "../../eto/sagas";
import { calculateEtoViewCampaignOverviewType, } from "../sagas";

export function* loadIssuerEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
) {
  console.log("----loadIssuerEtoView");
  try {
    let eto = yield select(selectIssuerEtoWithCompanyAndContract);
    if (eto === undefined) {
      yield neuCall(loadIssuerEto);
      eto = yield select(selectIssuerEtoWithCompanyAndContract);
    }

    //fixme extract this to a sep. saga
    let campaignOverviewData: TCampaignOverviewData;

    const campaignOverviewType: EEtoViewCampaignOverviewType = yield call(calculateEtoViewCampaignOverviewType, eto);

    if (campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS) {
      campaignOverviewData = {
        campaignOverviewType,
        url: "",
        path: ""
      }
    } else {
      campaignOverviewData = {
        campaignOverviewType,
      }
    }

    yield put(actions.etoView.setEtoViewData({ eto, campaignOverviewData, etoViewType: EEtoViewType.ETO_VIEW_ISSUER }));
  } catch (e) {
    logger.error("Could not load eto", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadIssuerEtoPreview(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>
) {
  console.log("----loadIssuerEtoPreview")
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(loadEtoWithCompanyAndContract, payload.previewCode);

    if(eto){
      //fixme extract this to a sep. saga

      let campaignOverviewData: TCampaignOverviewData;

      const campaignOverviewType: EEtoViewCampaignOverviewType = yield call(calculateEtoViewCampaignOverviewType, eto);

      if (campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS) {
        campaignOverviewData = {
          campaignOverviewType,
          url: payload.match.url,
          path: payload.match.path
        }
      } else {
        campaignOverviewData = {
          campaignOverviewType,
        }
      }

      yield put(actions.etoView.setEtoViewData({
        eto,
        campaignOverviewData,
        etoViewType: EEtoViewType.ETO_VIEW_NOT_AUTHORIZED
      }));
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
