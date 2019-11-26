import { delay } from "redux-saga";
import { all, call, cancel, fork, put, select, take } from "redux-saga/effects";

import { KycFlowMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { EJwtPermissions } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  EKycRequestStatus,
  EKycRequestType,
  ERequestOutsourcedStatus,
  IKycBeneficialOwner,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycRequestState,
  TKycBankAccount,
  TKycStatus,
} from "../../lib/api/kyc/KycApi.interfaces";
import { EUserType, IUser } from "../../lib/api/users/interfaces";
import { IdentityRegistry } from "../../lib/contracts/IdentityRegistry";
import { IAppState } from "../../store";
import { actions, TActionFromCreator } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { selectIsUserVerified, selectUser, selectUserType } from "../auth/selectors";
import { userHasKycAndEmailVerified } from "../eto-flow/selectors";
import { displayErrorModalSaga } from "../generic-modal/sagas";
import { waitUntilSmartContractsAreInitialized } from "../init/sagas";
import { neuCall, neuFork, neuTakeEvery, neuTakeOnly } from "../sagasUtils";
import {
  selectCombinedBeneficialOwnerOwnership,
  selectKycLoading,
  selectKycRequestOutsourcedStatus,
  selectKycRequestStatus,
  selectKycRequestType,
} from "./selectors";
import { deserializeClaims } from "./utils";

export function* loadClientData({ apiKycService }: TGlobalDependencies): Iterable<any> {
  const kycStatus: TKycStatus = yield apiKycService.getKycStatus();

  yield put(actions.kyc.setStatus(kycStatus));

  // TODO: Check `kycStatus.type` and load only appropriate type
  yield put(actions.kyc.kycLoadIndividualData());
  yield put(actions.kyc.kycLoadBusinessData());
}

/**
 * whole watcher feature is just a temporary workaround for a lack of real time communication with backend
 */
let kycWidgetWatchDelay: number = 1000;

function* kycRefreshWidgetSaga({ logger }: TGlobalDependencies): any {
  kycWidgetWatchDelay = 1000;
  while (true) {
    const requestType: EKycRequestType = yield select(selectKycRequestType);
    const status: EKycRequestStatus | undefined = yield select((s: IAppState) =>
      selectKycRequestStatus(s),
    );

    if (
      status === EKycRequestStatus.ACCEPTED ||
      status === EKycRequestStatus.REJECTED ||
      status === EKycRequestStatus.IGNORED
    ) {
      return;
    }

    const outsourcedStatus: ERequestOutsourcedStatus | undefined = yield select((s: IAppState) =>
      selectKycRequestOutsourcedStatus(s.kyc),
    );

    if (
      status === EKycRequestStatus.PENDING ||
      (status === EKycRequestStatus.OUTSOURCED &&
        outsourcedStatus &&
        (outsourcedStatus === ERequestOutsourcedStatus.STARTED ||
          outsourcedStatus === ERequestOutsourcedStatus.CANCELED ||
          outsourcedStatus === ERequestOutsourcedStatus.ABORTED ||
          outsourcedStatus === ERequestOutsourcedStatus.REVIEW_PENDING))
    ) {
      requestType === EKycRequestType.INDIVIDUAL
        ? yield put(actions.kyc.kycLoadIndividualRequest(true))
        : yield put(actions.kyc.kycLoadBusinessRequest(true));
      logger.info("KYC refreshed", status, requestType);
    }

    yield delay(kycWidgetWatchDelay);
    expandWatchTimeout();
  }
}

// it will sleep for 1000, 3000, and then always 10 000
function expandWatchTimeout(): void {
  // tslint:disable-next-line
  if (kycWidgetWatchDelay === 1000) {
    kycWidgetWatchDelay = 3000;
  } else {
    kycWidgetWatchDelay = 10000;
  }
}

let watchTask: any;

function* kycRefreshWidgetSagaWatcher({ logger }: TGlobalDependencies): any {
  while (true) {
    yield take(actions.kyc.kycStartWatching);
    logger.info("started KYC watcher");
    watchTask = yield fork(neuCall, kycRefreshWidgetSaga);
  }
}

function* kycRefreshWidgetSagaWatcherStop({ logger }: TGlobalDependencies): any {
  while (true) {
    yield take(actions.kyc.kycStopWatching);
    if (watchTask) {
      logger.info("stopped KYC watcher");
      yield cancel(watchTask);
    }
  }
}

/**
 * Individual Request
 */
function* loadIdentityClaim({ contractsService }: TGlobalDependencies): Iterator<any> {
  const identityRegistry: IdentityRegistry = contractsService.identityRegistry;

  const loggedInUser: IUser = yield select<IAppState>(state => selectUser(state.auth));

  const claims: string = yield identityRegistry.getClaims(loggedInUser.userId);

  yield put(actions.kyc.kycSetClaims(deserializeClaims(claims)));
}

/**
 * Individual Request
 */
function* loadIndividualData({ apiKycService, logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateIndividualData(true));
    const result: IHttpResponse<IKycIndividualData> = yield apiKycService.getIndividualData();
    yield put(actions.kyc.kycUpdateIndividualData(false, result.body));
  } catch (e) {
    if (e.status !== 404) {
      logger.error("Failed to load KYC individual data", e);
    }

    yield put(actions.kyc.kycUpdateIndividualData(false));
  }
}

function* submitIndividualData(
  { apiKycService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycSubmitIndividualData>,
): Iterator<any> {
  try {
    const { data, skipContinue } = action.payload;
    const result: IHttpResponse<IKycIndividualData> = yield apiKycService.putIndividualData(data);

    yield put(
      actions.kyc.kycUpdateIndividualData(false, {
        ...result.body,
        isAccreditedUsCitizen: data.isAccreditedUsCitizen,
      }),
    );

    if (!skipContinue) {
      yield put(actions.routing.goToKYCIndividualDocumentVerification());
    }
  } catch (e) {
    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));

    logger.error("Failed to submit KYC individual data", e);
  }
}

function* uploadIndividualFile(
  { apiKycService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycUploadIndividualDocument>,
): Iterator<any> {
  const { file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateIndividualDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadIndividualDocument(file);
    yield put(actions.kyc.kycUpdateIndividualDocument(false, result.body));
    notificationCenter.info(createMessage(KycFlowMessage.KYC_UPLOAD_SUCCESSFUL));
  } catch (e) {
    yield put(actions.kyc.kycUpdateIndividualDocument(false));

    notificationCenter.error(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED));

    logger.error("Failed to upload KYC individual file", e);
  }
}

function* loadIndividualFiles({ apiKycService, logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateIndividualDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getIndividualDocuments();
    yield put(actions.kyc.kycUpdateIndividualDocuments(false, result.body));
  } catch (e) {
    yield put(actions.kyc.kycUpdateIndividualDocuments(false));

    if (e.status !== 404) {
      logger.error("Failed to load KYC individual files", e);
    }
  }
}

function* loadIndividualRequest(
  { apiKycService, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycLoadIndividualRequest>,
): Iterator<any> {
  yield put(actions.kyc.kycLoadClaims());

  try {
    if (!action.payload.inBackground) {
      yield put(actions.kyc.kycUpdateIndividualRequestState(true));
    }
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.getIndividualRequest();
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
  } catch (e) {
    logger.error("Error while getting business KYC data", e);
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, undefined, e.message));
  }
}

function* submitIndividualRequestEffect({ apiKycService }: TGlobalDependencies): Iterator<any> {
  yield put(actions.kyc.kycUpdateIndividualRequestState(true));
  const result: IHttpResponse<IKycRequestState> = yield apiKycService.submitIndividualRequest();
  yield put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
  yield put(
    actions.genericModal.showGenericModal(
      createMessage(KycFlowMessage.KYC_VERIFICATION_TITLE),
      createMessage(KycFlowMessage.KYC_VERIFICATION_DESCRIPTION),
      undefined,
      createMessage(KycFlowMessage.KYC_SETTINGS_BUTTON),
      actions.routing.goToProfile(),
    ),
  );
}

function* submitIndividualRequest({
  notificationCenter,
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(submitIndividualRequestEffect),
      [EJwtPermissions.SUBMIT_KYC_PERMISSION],
      createMessage(KycFlowMessage.KYC_SUBMIT_TITLE),
      createMessage(KycFlowMessage.KYC_SUBMIT_DESCRIPTION),
    );
  } catch (e) {
    yield put(actions.kyc.kycUpdateIndividualRequestState(false));

    notificationCenter.error(createMessage(KycFlowMessage.KYC_SUBMIT_FAILED));

    logger.error("Failed to submit KYC individual request", e);
  }
}

function* startIndividualInstantId({
  apiKycService,
  notificationCenter,
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.startInstantId();

    if (result.body.redirectUrl) {
      yield put(actions.routing.openInNewWindow(result.body.redirectUrl));
    }

    yield put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
  } catch (e) {
    logger.error("KYC instant id failed to start", e);

    notificationCenter.error(createMessage(KycFlowMessage.KYC_SUBMIT_FAILED));
  }
}

function* cancelIndividualInstantId({
  apiKycService,
  notificationCenter,
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    yield apiKycService.cancelInstantId();
    yield put(
      actions.kyc.kycUpdateIndividualRequestState(false, { status: EKycRequestStatus.DRAFT }),
    );
  } catch (e) {
    logger.error("KYC instant id failed to stop", e);

    notificationCenter.error(createMessage(KycFlowMessage.KYC_SUBMIT_FAILED)); //module.kyc.sagas.problem.submitting
  }
}

/**
 * Company Request
 */

// legal representative
function* loadLegalRepresentative({ apiKycService, logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentative(true));
    const result: IHttpResponse<IKycLegalRepresentative> = yield apiKycService.getLegalRepresentative();
    yield put(actions.kyc.kycUpdateLegalRepresentative(false, result.body));
  } catch (e) {
    // TODO: There is something wrong here as reponse parsing error is thrown.
    // Will review the code and fix in the separate PR
    logger.error("Failed to load KYC representative", e);

    yield put(actions.kyc.kycUpdateLegalRepresentative(false));
  }
}

function* submitLegalRepresentative(
  { apiKycService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycSubmitLegalRepresentative>,
): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentative(true));
    const result: IHttpResponse<IKycLegalRepresentative> = yield apiKycService.putLegalRepresentative(
      action.payload.data,
    );
    yield put(actions.kyc.kycUpdateLegalRepresentative(false, result.body));
  } catch (e) {
    logger.error("Failed to submit KYC legal representative", e);

    yield put(actions.kyc.kycUpdateLegalRepresentative(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));
  }
}

function* uploadLegalRepresentativeFile(
  { apiKycService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycUploadLegalRepresentativeDocument>,
): Iterator<any> {
  const { file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadLegalRepresentativeDocument(
      file,
    );
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(false, result.body));
  } catch (e) {
    logger.error("Failed to upload KYC legal representative file", e);

    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(false));

    notificationCenter.error(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED));
  }
}

function* loadLegalRepresentativeFiles({
  apiKycService,
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getLegalRepresentativeDocuments();
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(false, result.body));
  } catch (e) {
    logger.error("Failed to load KYC legal representative file", e);

    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(false));
  }
}

// business data
function* setBusinessType(
  { apiKycService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycSetBusinessType>,
): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateBusinessData(true));
    let institutionData: IKycBusinessData = {};
    // TODO: Pretty bad use of `catch` we need to log an error if it's not 404
    try {
      const result: IHttpResponse<IKycBusinessData> = yield apiKycService.getBusinessData();
      institutionData = result.body;
    } catch (_e) {}
    institutionData = { ...institutionData, legalFormType: action.payload.type };
    yield apiKycService.putBusinessData(institutionData);
    yield put(actions.kyc.kycUpdateBusinessData(false, institutionData));
    yield put(actions.routing.goToKYCBusinessData());
  } catch (e) {
    yield put(actions.kyc.kycUpdateBusinessData(false));

    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));

    logger.error("Failed to set KYC business", e);
  }
}

// legal representative
function* loadBusinessData({ apiKycService, logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateBusinessData(true));
    const result: IHttpResponse<IKycBusinessData> = yield apiKycService.getBusinessData();

    yield put(actions.kyc.kycUpdateBusinessData(false, result.body));
  } catch (e) {
    if (e.status !== 404) {
      logger.error("Failed to load KYC business data", e);
    }

    yield put(actions.kyc.kycUpdateBusinessData(false));
  }
}

function* submitBusinessData(
  { apiKycService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycSubmitBusinessData>,
): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateBusinessData(true));
    const result: IHttpResponse<IKycBusinessData> = yield apiKycService.putBusinessData(
      action.payload.data,
    );
    yield put(actions.kyc.kycUpdateBusinessData(false, result.body));
  } catch (e) {
    yield put(actions.kyc.kycUpdateBusinessData(false));

    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));

    logger.error("Failed to submit KYC business data", e);
  }
}

function* uploadBusinessFile(
  { apiKycService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycUploadBusinessDocument>,
): Iterator<any> {
  const { file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateBusinessDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadBusinessDocument(file);
    yield put(actions.kyc.kycUpdateBusinessDocument(false, result.body));
    notificationCenter.info(createMessage(KycFlowMessage.KYC_UPLOAD_SUCCESSFUL));
  } catch (e) {
    yield put(actions.kyc.kycUpdateBusinessDocument(false));

    notificationCenter.error(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED));

    logger.error("Failed to upload KYC business file", e);
  }
}

function* loadBusinessFiles({ apiKycService, logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateBusinessDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getBusinessDocuments();
    yield put(actions.kyc.kycUpdateBusinessDocuments(false, result.body));
  } catch (e) {
    yield put(actions.kyc.kycUpdateBusinessDocuments(false));

    if (e.status !== 404) {
      logger.error("Failed to load KYC business files", e);
    }
  }
}

// beneficial owners
function* loadBeneficialOwners({ apiKycService, logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwners(true));
    const result: IHttpResponse<IKycBeneficialOwner[]> = yield apiKycService.getBeneficialOwners();
    yield put(actions.kyc.kycUpdateBeneficialOwners(false, result.body));
  } catch (e) {
    yield put(actions.kyc.kycUpdateBeneficialOwners(false));

    logger.error("Failed to load KYC beneficial owners", e);
  }
}

function* createBeneficialOwner({
  apiKycService,
  notificationCenter,
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    const result: IHttpResponse<IKycBeneficialOwner> = yield apiKycService.postBeneficialOwner({});
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, result.body.id, result.body));
  } catch (e) {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));

    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));

    logger.error("Failed to create KYC beneficial owner", e);
  }
}

function* submitBeneficialOwner(
  { apiKycService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycSubmitBeneficialOwner>,
): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    const result: IHttpResponse<IKycBeneficialOwner> = yield apiKycService.putBeneficialOwner(
      action.payload.owner,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, result.body.id, result.body));
  } catch (e) {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));

    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SAVING_DATA));

    logger.error("Failed to submit KYC beneficial owner", e);
  }
}

function* deleteBeneficialOwner(
  { apiKycService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycDeleteBeneficialOwner>,
): Iterator<any> {
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    yield apiKycService.deleteBeneficialOwner(action.payload.id);
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, action.payload.id, undefined));
  } catch (e) {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));

    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));

    logger.error("Failed to delete KYC beneficial owner", e);
  }
}

function* uploadBeneficialOwnerFile(
  { apiKycService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycUploadBeneficialOwnerDocument>,
): Iterator<any> {
  const { boid, file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadBeneficialOwnerDocument(
      boid,
      file,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, false, result.body));
    notificationCenter.info(createMessage(KycFlowMessage.KYC_UPLOAD_SUCCESSFUL));
  } catch (e) {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, false));

    notificationCenter.error(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED));

    logger.error("Failed to upload KYC beneficial owner file", e);
  }
}

function* loadBeneficialOwnerFiles(
  { apiKycService, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycLoadBeneficialOwnerDocumentList>,
): Iterator<any> {
  const { boid } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getBeneficialOwnerDocuments(
      boid,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, false, result.body));
  } catch (e) {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, false));

    logger.error("Failed to load KYC beneficial owner file", e);
  }
}

// request
function* loadBusinessRequest(
  { apiKycService, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.kyc.kycLoadBusinessRequest>,
): Iterator<any> {
  yield put(actions.kyc.kycLoadClaims());

  try {
    if (!action.payload.inBackground) {
      yield put(actions.kyc.kycUpdateBusinessRequestState(true));
    }
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.getBusinessRequest();
    yield put(actions.kyc.kycUpdateBusinessRequestState(false, result.body));
  } catch (e) {
    logger.error("Error while getting business KYC data", e);

    yield put(actions.kyc.kycUpdateBusinessRequestState(false, undefined, e.message));
  }
}

function* submitBusinessRequestEffect({ apiKycService }: TGlobalDependencies): Iterator<any> {
  const userType = yield select((s: IAppState) => selectUserType(s));
  const kycAndEmailVerified = yield select((s: IAppState) => userHasKycAndEmailVerified(s));

  yield put(actions.kyc.kycUpdateBusinessRequestState(true));
  const result: IHttpResponse<IKycRequestState> = yield apiKycService.submitBusinessRequest();
  yield put(actions.kyc.kycUpdateBusinessRequestState(false, result.body));

  const buttonAction =
    !kycAndEmailVerified && userType === EUserType.NOMINEE
      ? actions.routing.goToDashboard()
      : actions.routing.goToProfile();

  yield put(
    actions.genericModal.showGenericModal(
      createMessage(KycFlowMessage.KYC_VERIFICATION_TITLE),
      createMessage(KycFlowMessage.KYC_VERIFICATION_DESCRIPTION),
      undefined,
      createMessage(KycFlowMessage.KYC_SETTINGS_BUTTON),
      buttonAction,
    ),
  );
}

function* submitBusinessRequest({
  notificationCenter,
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    // check whether combined value of beneficial owners percentages is less or equal 100%
    const ownerShip = yield select((s: IAppState) => selectCombinedBeneficialOwnerOwnership(s.kyc));
    if (ownerShip > 100) {
      yield call(
        displayErrorModalSaga,
        createMessage(KycFlowMessage.KYC_ERROR),
        createMessage(KycFlowMessage.KYC_BENEFICIAL_OWNERS),
      );
      return;
    }

    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(submitBusinessRequestEffect),
      [EJwtPermissions.SUBMIT_KYC_PERMISSION],
      createMessage(KycFlowMessage.KYC_SUBMIT_TITLE),
      createMessage(KycFlowMessage.KYC_SUBMIT_DESCRIPTION),
    );
  } catch (e) {
    yield put(actions.kyc.kycUpdateBusinessRequestState(false));

    notificationCenter.error(createMessage(KycFlowMessage.KYC_SUBMIT_FAILED));

    logger.error("Failed to submit KYC business request", e);
  }
}

export function* loadBankAccountDetails({
  apiKycService,
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  try {
    // bank details depend on claims `hasBankAccount` flag
    // so to have consistent ui we need to reload claims
    yield put(actions.kyc.kycLoadClaims());

    const isVerified: boolean = yield select(selectIsUserVerified);

    // bank account api can only be called when account is verified
    if (isVerified) {
      const result: TKycBankAccount = yield apiKycService.getBankAccount();

      yield put(actions.kyc.setQuintessenceBankAccountDetails(result.ourAccount));

      if (result.verifiedUserAccount !== undefined) {
        yield put(
          actions.kyc.setBankAccountDetails({
            hasBankAccount: true,
            details: result.verifiedUserAccount,
          }),
        );
      } else {
        yield put(
          actions.kyc.setBankAccountDetails({
            hasBankAccount: false,
          }),
        );
      }
    } else {
      yield put(
        actions.kyc.setBankAccountDetails({
          hasBankAccount: false,
        }),
      );
    }
  } catch (e) {
    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_LOADING_BANK_DETAILS));

    logger.error("Error while loading kyc bank details", e);

    yield put(
      actions.kyc.setBankAccountDetails({
        hasBankAccount: false,
      }),
    );
  }
}

export function* waitForKycStatus(): Iterator<any> {
  const kycLoading = yield select((s: IAppState) => selectKycLoading(s));
  if (kycLoading) {
    yield take(actions.kyc.kycFinishedLoadingData);
  }
}

function* waitForKycStatusLoad(): Iterator<any> {
  yield take([actions.kyc.kycLoadBusinessData, actions.kyc.kycLoadIndividualData]);
  yield put(actions.kyc.kycFinishedLoadingData());
}

export function* loadKycRequestData(): Iterator<any> {
  // Wait for contracts to init
  yield waitUntilSmartContractsAreInitialized();

  yield put(actions.kyc.kycLoadIndividualRequest());
  yield put(actions.kyc.kycLoadBusinessRequest());

  // TODO: KYC_LOAD_CLAIMS is called 3 times on init (kycLoadIndividualRequest, kycLoadBusinessRequest and here)
  yield put(actions.kyc.kycLoadClaims());

  yield put(actions.kyc.kycLoadClientData());

  yield all([
    neuTakeOnly(actions.kyc.kycUpdateIndividualRequestState, {
      individualRequestStateLoading: false,
    }),
    neuTakeOnly(actions.kyc.kycUpdateBusinessRequestState, { businessRequestStateLoading: false }),
    take(actions.kyc.kycSetClaims),
    neuTakeOnly(actions.kyc.kycUpdateBusinessData, {
      businessDataLoading: false,
    }),
    neuTakeOnly(actions.kyc.kycUpdateIndividualData, { individualDataLoading: false }),
  ]);
}

export function* kycSagas(): Iterator<any> {
  yield fork(neuTakeEvery, actions.kyc.kycLoadClientData, loadClientData);

  yield fork(neuTakeEvery, actions.kyc.kycLoadIndividualData, loadIndividualData);
  yield fork(neuTakeEvery, actions.kyc.kycSubmitIndividualData, submitIndividualData);
  yield fork(neuTakeEvery, actions.kyc.kycUploadIndividualDocument, uploadIndividualFile);
  yield fork(neuTakeEvery, actions.kyc.kycLoadIndividualDocumentList, loadIndividualFiles);
  // Outsourced
  yield fork(neuTakeEvery, actions.kyc.kycStartInstantId, startIndividualInstantId);
  yield fork(neuTakeEvery, actions.kyc.kycCancelInstantId, cancelIndividualInstantId);
  yield fork(neuTakeEvery, actions.kyc.kycLoadIndividualRequest, loadIndividualRequest);
  yield fork(neuTakeEvery, actions.kyc.kycSubmitIndividualRequest, submitIndividualRequest);

  yield fork(neuTakeEvery, actions.kyc.kycLoadLegalRepresentative, loadLegalRepresentative);
  yield fork(neuTakeEvery, actions.kyc.kycSubmitLegalRepresentative, submitLegalRepresentative);
  yield fork(
    neuTakeEvery,
    actions.kyc.kycUploadLegalRepresentativeDocument,
    uploadLegalRepresentativeFile,
  );
  yield fork(
    neuTakeEvery,
    actions.kyc.kycLoadLegalRepresentativeDocumentList,
    loadLegalRepresentativeFiles,
  );

  yield fork(neuTakeEvery, actions.kyc.kycSetBusinessType, setBusinessType);
  yield fork(neuTakeEvery, actions.kyc.kycLoadBusinessData, loadBusinessData);
  yield fork(neuTakeEvery, actions.kyc.kycSubmitBusinessData, submitBusinessData);
  yield fork(neuTakeEvery, actions.kyc.kycUploadBusinessDocument, uploadBusinessFile);
  yield fork(neuTakeEvery, actions.kyc.kycLoadBusinessDocumentList, loadBusinessFiles);

  yield fork(neuTakeEvery, actions.kyc.kycLoadBeneficialOwners, loadBeneficialOwners);
  yield fork(neuTakeEvery, actions.kyc.kycAddBeneficialOwner, createBeneficialOwner);
  yield fork(neuTakeEvery, actions.kyc.kycSubmitBeneficialOwner, submitBeneficialOwner);
  yield fork(neuTakeEvery, actions.kyc.kycDeleteBeneficialOwner, deleteBeneficialOwner);
  yield fork(neuTakeEvery, actions.kyc.kycUploadBeneficialOwnerDocument, uploadBeneficialOwnerFile);
  yield fork(
    neuTakeEvery,
    actions.kyc.kycLoadBeneficialOwnerDocumentList,
    loadBeneficialOwnerFiles,
  );

  yield fork(neuTakeEvery, actions.kyc.kycLoadBusinessRequest, loadBusinessRequest);
  yield fork(neuTakeEvery, actions.kyc.kycSubmitBusinessRequest, submitBusinessRequest);

  yield fork(neuTakeEvery, actions.kyc.loadBankAccountDetails, loadBankAccountDetails);

  yield fork(neuTakeEvery, actions.kyc.kycLoadClaims, loadIdentityClaim);

  yield fork(waitForKycStatusLoad);
  yield neuFork(kycRefreshWidgetSagaWatcher);
  yield neuFork(kycRefreshWidgetSagaWatcherStop);
}
