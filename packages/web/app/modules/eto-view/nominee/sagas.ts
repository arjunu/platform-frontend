import { all, call, fork, put, select, take } from "redux-saga/effects";

import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";
import { loadActiveNomineeEto } from "../../nominee-flow/sagas";
import {
  selectActiveNomineeEto,
  selectNomineeActiveEtoPreviewCode,
} from "../../nominee-flow/selectors";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { calculateCampaignOverviewDataIssuerNominee } from "../shared/sagas";
import { EEtoViewType, TCampaignOverviewData } from "../shared/types";
import { selectIsUserVerifiedOnBlockchain } from "../../kyc/selectors";

export function* loadNomineeEtoView({
  logger,
  notificationCenter,
}: TGlobalDependencies): Generator<any,any,any> {
  try {
    let activeNomineeEtoPreviewCode = yield select(selectNomineeActiveEtoPreviewCode);

    if (activeNomineeEtoPreviewCode === undefined) {
      yield all([
        neuCall(loadActiveNomineeEto),
        take(actions.nomineeFlow.setActiveNomineeEtoPreviewCode),
      ]);
      activeNomineeEtoPreviewCode = yield select(selectNomineeActiveEtoPreviewCode);
    }

    if (activeNomineeEtoPreviewCode === undefined) {
      return yield put(actions.routing.goToDashboard());
    }

    const eto = yield select(selectActiveNomineeEto);
    if (eto) {
      const campaignOverviewData: TCampaignOverviewData = yield call(
        calculateCampaignOverviewDataIssuerNominee,
        eto,
      );

      yield put(
        actions.etoView.setEtoViewData({
          eto,
          campaignOverviewData,
          userIsFullyVerified: yield select(selectIsUserVerifiedOnBlockchain),
          etoViewType: EEtoViewType.ETO_VIEW_NOT_AUTHORIZED,
        }),
      );
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
