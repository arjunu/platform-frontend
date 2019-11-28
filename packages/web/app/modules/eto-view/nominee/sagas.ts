import { all, call, fork, put, select, take } from "redux-saga/effects";

import { selectActiveNomineeEto, selectNomineeActiveEtoPreviewCode } from "../../nominee-flow/selectors";
import { actions } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { loadActiveNomineeEto } from "../../nominee-flow/sagas";
import { EEtoViewCampaignOverviewType, EEtoViewType, TCampaignOverviewData } from "../reducer";
import { calculateEtoViewCampaignOverviewType } from "../sagas";
import { createMessage } from "../../../components/translatedMessages/utils";
import { EtoMessage } from "../../../components/translatedMessages/messages";
import { TGlobalDependencies } from "../../../di/setupBindings";

export function* loadNomineeEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
) {
  console.log("---loadNomineeEtoView")
  try {
    let activeNomineeEtoPreviewCode = yield select(selectNomineeActiveEtoPreviewCode)

    if (activeNomineeEtoPreviewCode === undefined) {
      yield all([
        neuCall(loadActiveNomineeEto),
        take(actions.nomineeFlow.setActiveNomineeEtoPreviewCode)]
      );
      activeNomineeEtoPreviewCode = yield select(selectNomineeActiveEtoPreviewCode)
    }

    if (activeNomineeEtoPreviewCode === undefined) {
      return yield put(actions.routing.goToDashboard())
    }

    const eto = yield select(selectActiveNomineeEto)
    if (eto) {
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

      yield put(actions.etoView.setEtoViewData({
        eto,
        campaignOverviewData,
        etoViewType: EEtoViewType.ETO_VIEW_NOT_AUTHORIZED
      }));
    }

  } catch (e) {
    logger.error("Could not load nominee eto", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoViewNomineeSagas(): any {
  yield fork(neuTakeEvery, actions.etoView.loadNomineeEtoView, loadNomineeEtoView);
}
