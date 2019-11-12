import { effects } from "redux-saga";
import { fork, put, select } from "redux-saga/effects";

import { EtoDocumentsMessage, EtoFlowMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { EJwtPermissions } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  EEtoState,
  TCompanyEtoData,
  TEtoSpecsData,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TEtoProducts } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { IAppState } from "../../store";
import { actions, TActionFromCreator } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { InvalidETOStateError } from "../eto/errors";
import { loadEtoContract } from "../eto/sagas";
import { selectNomineeEtoWithCompanyAndContract } from "../nominee-flow/selectors";
import { neuCall, neuTakeEvery, neuTakeLatest } from "../sagasUtils";
import { etoFlowActions } from "./actions";
import {
  selectIsNewPreEtoStartDateValid,
  selectIssuerEto,
  selectIssuerEtoWithCompanyAndContract,
  selectNewPreEtoStartDate,
  selectPreEtoStartDateFromContract,
} from "./selectors";
import { bookBuildingStatsToCsvString, createCsvDataUri, downloadFile } from "./utils";

export function* loadIssuerEto({
  apiEtoService,
  notificationCenter,
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    const company: TCompanyEtoData = yield apiEtoService.getCompany();
    const eto: TEtoSpecsData = yield apiEtoService.getMyEto();

    if (eto.state === EEtoState.ON_CHAIN) {
      yield neuCall(loadEtoContract, eto);
    }

    yield put(actions.etoFlow.setEto({ eto, company }));
  } catch (e) {
    logger.error("Failed to load Issuer ETO", e);
    notificationCenter.error(createMessage(EtoFlowMessage.ETO_LOAD_FAILED));
    yield put(actions.routing.goToDashboard());
  }
}

function* changeBookBuildingStatusEffect(
  { apiEtoService }: TGlobalDependencies,
  status: boolean,
): Iterator<any> {
  yield apiEtoService.changeBookBuildingState(status);
}

export function* changeBookBuildingStatus(
  { notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof etoFlowActions.changeBookBuildingStatus>,
): Iterator<any> {
  const { status } = action.payload;

  try {
    const message = status
      ? createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_START_BOOKBUILDING)
      : createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_STOP_BOOKBUILDING);

    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(changeBookBuildingStatusEffect, status),
      [EJwtPermissions.DO_BOOK_BUILDING],
      message,
    );
  } catch (e) {
    logger.error("Failed to change book-building status", e);
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
    );
  } finally {
    yield put(actions.etoFlow.loadIssuerEto());
    yield put(actions.routing.goToDashboard());
  }
}

export function* downloadBookBuildingStats({
  apiEtoService,
  notificationCenter,
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    const detailedStatsResponse: IHttpResponse<
      any
    > = yield apiEtoService.getDetailedBookBuildingStats();

    const dataAsString = yield bookBuildingStatsToCsvString(detailedStatsResponse.body);

    yield downloadFile(createCsvDataUri(dataAsString), "whitelisted_investors.csv");
  } catch (e) {
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_GET_BOOKBUILDING_STATS),
    );
    logger.error(`Failed to load bookbuilding stats pledge`, e);
  }
}

export function* saveCompany(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof etoFlowActions.saveCompanyStart>,
): Iterator<any> {
  try {
    yield apiEtoService.patchCompany(action.payload.company);

    yield put(actions.routing.goToDashboard());
  } catch (e) {
    logger.error("Failed to save company", e);
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
    );
  } finally {
    yield put(actions.etoFlow.loadDataStop());
  }
}

export function* saveEto(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof etoFlowActions.saveEtoStart>,
): Iterator<any> {
  try {
    const currentEto: TEtoSpecsData = yield effects.select(selectIssuerEto);

    // Eto is only allowed to be modified during PREVIEW state
    if (currentEto.state !== EEtoState.PREVIEW) {
      throw new InvalidETOStateError(currentEto.state, EEtoState.PREVIEW);
    }

    if (action.payload.options.patch) {
      yield apiEtoService.patchMyEto(action.payload.eto);
    } else {
      // It's a fix for Shareholder Agreement form
      // as right now `patch` is not working properly for `Advisory Board`
      // TODO: Remove `options` after `Advisory Board` gets fixed on the API side
      yield apiEtoService.putMyEto({
        ...currentEto,
        ...action.payload.eto,
      });
    }

    yield put(actions.routing.goToDashboard());
  } catch (e) {
    logger.error("Failed to save ETO", e);
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
    );
  } finally {
    yield put(actions.etoFlow.loadDataStop());
  }
}

export function* submitEtoDataEffect({
  apiEtoService,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  yield apiEtoService.submitCompanyAndEto();

  notificationCenter.info(createMessage(EtoDocumentsMessage.ETO_SUBMIT_SUCCESS));

  yield put(actions.etoFlow.loadIssuerEto());
  yield put(actions.routing.goToDashboard());
}

export function* submitEtoData({ notificationCenter, logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(submitEtoDataEffect),
      [EJwtPermissions.SUBMIT_ETO_PERMISSION],
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_TITLE), //eto.modal.submit-title
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_DESCRIPTION), //eto.modal.submit-description
    );
  } catch (e) {
    logger.error("Failed to Submit ETO data", e);
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
    );
  }
}

function* startSetDateTX(_: TGlobalDependencies): Iterator<any> {
  const state: IAppState = yield select();
  if (selectIsNewPreEtoStartDateValid(state)) {
    yield put(actions.txTransactions.startEtoSetDate());
  }
}

export function* cleanupSetDateTX(): any {
  const newStartDate: Date | undefined = yield select(selectNewPreEtoStartDate);
  const oldStartDate: Date | undefined = yield select(selectPreEtoStartDateFromContract);

  if (newStartDate !== oldStartDate) {
    yield put(actions.etoFlow.loadIssuerEto());
  }
  yield put(actions.etoFlow.clearNewStartDate());
}

export function* loadProducts({
  apiEtoProductService,
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  try {
    const products: TEtoProducts = yield apiEtoProductService.getProducts();

    yield put(actions.etoFlow.setProducts(products));
  } catch (e) {
    logger.error("Failed to load eto products", e);

    notificationCenter.error(createMessage(EtoFlowMessage.ETO_PRODUCTS_LOAD_FAILED));
  }
}

export function* changeProductType(
  { apiEtoProductService, logger, notificationCenter }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.etoFlow.changeProductType>,
): Iterator<any> {
  try {
    const eto: TEtoSpecsData = yield apiEtoProductService.changeProductType(
      action.payload.productId,
    );

    yield put(actions.etoFlow.setEto({ eto }));

    notificationCenter.info(createMessage(EtoFlowMessage.ETO_TERMS_PRODUCT_CHANGE_SUCCESSFUL), {
      autoClose: 10000,
      "data-test-id": "eto-flow-product-changed-successfully",
    });
  } catch (e) {
    logger.error("Failed to change eto product", e);

    notificationCenter.error(createMessage(EtoFlowMessage.ETO_TERMS_PRODUCT_CHANGE_FAILED));
  }
}

export function* publishEtoDataEffect({
  apiEtoService,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  yield apiEtoService.publishCompanyAndEto();

  notificationCenter.info(createMessage(EtoDocumentsMessage.ETO_SUBMIT_SUCCESS));

  yield put(actions.etoFlow.loadIssuerEto());
  yield put(actions.routing.goToDashboard());
}

export function* publishEtoData({
  notificationCenter,
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(publishEtoDataEffect),
      [EJwtPermissions.SUBMIT_ETO_PERMISSION],
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_TITLE),
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_DESCRIPTION),
    );
  } catch (e) {
    logger.error("Failed to Submit ETO data", e);
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
    );
  }
}

export function* loadIssuerStep(): Iterator<any> {
  yield neuCall(loadIssuerEto);

  const issuerEto: ReturnType<typeof selectNomineeEtoWithCompanyAndContract> = yield select(
    selectIssuerEtoWithCompanyAndContract,
  );

  if (issuerEto === undefined) {
    throw new Error("Issuer eto should be defined before loading eto agreements");
  }

  yield put(actions.eto.loadEtoAgreementsStatus(issuerEto));

  yield put(actions.kyc.kycLoadIndividualDocumentList());
}

export function* etoFlowSagas(): any {
  yield fork(neuTakeEvery, etoFlowActions.loadIssuerEto, loadIssuerEto);
  yield fork(neuTakeEvery, etoFlowActions.saveCompanyStart, saveCompany);
  yield fork(neuTakeEvery, etoFlowActions.saveEtoStart, saveEto);
  yield fork(neuTakeEvery, etoFlowActions.submitDataStart, submitEtoData);
  yield fork(neuTakeEvery, etoFlowActions.changeBookBuildingStatus, changeBookBuildingStatus);
  yield fork(neuTakeLatest, etoFlowActions.downloadBookBuildingStats, downloadBookBuildingStats);
  yield fork(neuTakeLatest, etoFlowActions.uploadStartDate, startSetDateTX);
  yield fork(neuTakeLatest, etoFlowActions.cleanupStartDate, cleanupSetDateTX);
  yield fork(neuTakeLatest, etoFlowActions.loadProducts, loadProducts);
  yield fork(neuTakeLatest, etoFlowActions.loadIssuerStep, loadIssuerStep);
  yield fork(neuTakeLatest, etoFlowActions.changeProductType, changeProductType);
  yield fork(neuTakeLatest, etoFlowActions.publishDataStart, publishEtoData);
}
