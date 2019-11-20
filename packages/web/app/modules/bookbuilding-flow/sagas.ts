import { delay } from "redux-saga";
import { fork, put, select } from "redux-saga/effects";

import { BookbuildingFlowMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { BOOKBUILDING_WATCHER_DELAY, EJwtPermissions } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { EtoPledgeNotFound } from "../../lib/api/eto/EtoPledgeApi";
import { IPledge } from "../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { EUserType } from "../../lib/api/users/interfaces";
import { actions, TActionFromCreator } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { selectIsUserFullyVerified, selectUserType } from "../auth/selectors";
import { neuCall, neuTakeEvery, neuTakeLatestUntil } from "../sagasUtils";

export function* saveMyPledgeEffect(
  { apiEtoPledgeService }: TGlobalDependencies,
  etoId: string,
  pledge: IPledge,
): Iterator<any> {
  const pledgeResult: IHttpResponse<IPledge> = yield apiEtoPledgeService.saveMyPledge(
    etoId,
    pledge,
  );

  yield put(actions.bookBuilding.setPledge(etoId, pledgeResult.body));
  yield put(actions.bookBuilding.loadBookBuildingStats(etoId));
}

export function* saveMyPledge(
  { notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.bookBuilding.savePledge>,
): Iterator<any> {
  const { etoId, pledge } = action.payload;

  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(saveMyPledgeEffect, etoId, pledge),
      [EJwtPermissions.DO_BOOK_BUILDING],
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_CONFIRM_PLEDGE),
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_PLEDGE_DESCRIPTION),
    );
  } catch (e) {
    notificationCenter.error(
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_FAILED_TO_SAVE_PLEDGE),
    );
    logger.error(`Failed to save pledge`, e);
  }
}

export function* deleteMyPledgeEffect(
  { apiEtoPledgeService }: TGlobalDependencies,
  etoId: string,
): any {
  yield apiEtoPledgeService.deleteMyPledge(etoId);

  yield put(actions.bookBuilding.setPledge(etoId));
  yield put(actions.bookBuilding.loadBookBuildingStats(etoId));
}

export function* deleteMyPledge(
  { notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.bookBuilding.deletePledge>,
): Iterator<any> {
  const { etoId } = action.payload;
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(deleteMyPledgeEffect, etoId),
      [EJwtPermissions.DO_BOOK_BUILDING],
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_CONFIRM_PLEDGE_REMOVAL),
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_CONFIRM_PLEDGE_REMOVAL_DESCRIPTION),
    );
  } catch (e) {
    notificationCenter.error(
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_PLEDGE_REMOVAL_FAILED),
    );
    logger.error(`Failed to delete pledge`, e);
  }
}

export function* watchBookBuildingStats(
  { logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.bookBuilding.bookBuildingStartWatch>,
): Iterator<any> {
  while (true) {
    logger.info("Querying for bookbuilding stats...");
    try {
      yield neuCall(
        loadBookBuildingStats,
        actions.bookBuilding.loadBookBuildingStats(action.payload.etoId),
      );
    } catch (e) {
      logger.error("Error getting bookbuilding stats", e);
    }
    yield delay(BOOKBUILDING_WATCHER_DELAY);
  }
}

export function* loadBookBuildingStats(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.bookBuilding.loadBookBuildingStats>,
): Iterator<any> {
  try {
    const etoId = action.payload.etoId;
    const statsResponse: IHttpResponse<any> = yield apiEtoService.getBookBuildingStats(etoId);

    yield put(actions.bookBuilding.setBookBuildingStats(etoId, statsResponse.body));
  } catch (e) {
    notificationCenter.error(
      createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_FAILED_TO_GET_BOOKBUILDING_STATS),
    );

    logger.error(`Failed to load bookbuilding stats pledge`, e);
  }
}

export function* loadMyPledge(
  { apiEtoPledgeService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.bookBuilding.loadPledge>,
): Iterator<any> {
  try {
    const { etoId } = action.payload;

    const userType: ReturnType<typeof selectUserType> = yield select(selectUserType);
    const isVerified: ReturnType<typeof selectIsUserFullyVerified> = yield select(
      selectIsUserFullyVerified,
    );

    if (userType !== EUserType.INVESTOR || !isVerified) return;

    yield put(actions.bookBuilding.loadBookBuildingStats(etoId));

    const pledgeResponse: IHttpResponse<IPledge> = yield apiEtoPledgeService.getMyPledge(etoId);
    yield put(actions.bookBuilding.setPledge(etoId, pledgeResponse.body));
  } catch (e) {
    if (!(e instanceof EtoPledgeNotFound)) {
      notificationCenter.error(
        createMessage(BookbuildingFlowMessage.PLEDGE_FLOW_FAILED_TO_LOAD_PLEDGE),
      );
      logger.error("Failed to load pledge", e);
    }
  }
}

export function* bookBuildingFlowSagas(): Iterator<any> {
  yield fork(neuTakeEvery, actions.bookBuilding.loadBookBuildingStats, loadBookBuildingStats);
  yield fork(
    neuTakeLatestUntil,
    actions.bookBuilding.bookBuildingStartWatch,
    actions.bookBuilding.bookBuildingStopWatch,
    watchBookBuildingStats,
  );
  yield fork(neuTakeEvery, actions.bookBuilding.loadPledge, loadMyPledge);
  yield fork(neuTakeEvery, actions.bookBuilding.savePledge, saveMyPledge);
  yield fork(neuTakeEvery, actions.bookBuilding.deletePledge, deleteMyPledge);
}
