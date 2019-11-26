import { createSelector } from "reselect";

import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { nomineeIgnoredTemplates } from "../../lib/api/eto/EtoFileUtils";
import { IAppState } from "../../store";
import { DataUnavailableError } from "../../utils/errors";
import { objectToFilteredArray } from "../../utils/objectToFilteredArray";
import { selectStartOfOnchainState } from "../eto/selectors";
import {
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
  TOfferingAgreementsStatus,
} from "../eto/types";
import { selectRouter } from "../routing/selectors";
import {
  ENomineeEtoSpecificTask,
  ENomineeFlowError,
  ENomineeRequestError,
  ENomineeRequestStatus,
  ENomineeTask,
  ERedeemShareCapitalTaskSubstate,
  TNomineeEtoSpecificTaskData,
  TNomineeEtoSpecificTasksStatus,
  TNomineeRequestStorage,
  TNomineeTaskAcceptIshaData,
} from "./types";
import { getActiveEtoPreviewCodeFromQueryString } from "./utils";

export const selectNomineeFlow = (state: IAppState) => state.nomineeFlow;

export const selectNomineeStateIsLoading = (state: IAppState) => state.nomineeFlow.loading;

export const selectNomineeDashboardIsReady = (state: IAppState) => state.nomineeFlow.ready;

export const selectNomineeFlowError = (state: IAppState) => state.nomineeFlow.error;

export const selectNomineeFlowHasError = (state: IAppState) => {
  const error = selectNomineeFlowError(state);
  return error !== ENomineeFlowError.NONE;
};

export const selectNomineeRequestError = (state: IAppState): ENomineeRequestError => {
  const linkToIssuerData = state.nomineeFlow.nomineeTasksData[ENomineeTask.LINK_TO_ISSUER];
  if (linkToIssuerData === undefined) {
    throw new DataUnavailableError("taskData for the 'LINK_TO_ISSUER' step is missing");
  } else {
    return linkToIssuerData.error;
  }
};

export const selectNomineeTasksData = (state: IAppState) => state.nomineeFlow.nomineeTasksData;

export const selectLinkToIssuerNextState = (state: IAppState) => {
  const linkToIssuerData = state.nomineeFlow.nomineeTasksData[ENomineeTask.LINK_TO_ISSUER];
  if (linkToIssuerData === undefined) {
    throw new DataUnavailableError("taskData for the 'LINK_TO_ISSUER' step is missing");
  } else {
    return linkToIssuerData && linkToIssuerData.nextState;
  }
};

export const selectNomineeRequests = (state: IAppState): TNomineeRequestStorage =>
  state.nomineeFlow.nomineeRequests;

export const selectLinkedNomineeEtoId = (state: IAppState): string | undefined =>
  state.nomineeFlow.nomineeRequests &&
  Object.keys(state.nomineeFlow.nomineeRequests).find(
    requestId =>
      state.nomineeFlow.nomineeRequests[requestId].state === ENomineeRequestStatus.APPROVED,
  );

export const selectNomineeEtos = (
  state: IAppState,
): { [previewCode: string]: TEtoWithCompanyAndContract | undefined } =>
  state.nomineeFlow.nomineeEtos;

export const selectNomineeTasksStatus = (state: IAppState) => state.nomineeFlow.nomineeTasksStatus;

export const selectNomineeActiveEtoPreviewCode = (state: IAppState): string | undefined =>
  state.nomineeFlow.activeNomineeEtoPreviewCode;

export const selectActiveNomineeEto = createSelector(
  selectNomineeEtos,
  selectNomineeActiveEtoPreviewCode,
  (etos, etoPreviewCode) => {
    if (etoPreviewCode && etos) {
      return etos[etoPreviewCode];
    }

    return undefined;
  },
);

export const selectNomineeEtoState = (state: IAppState) => {
  const eto = selectActiveNomineeEto(state);
  return eto ? eto.state : undefined;
};

export const selectNomineeEtoTemplatesArray = (state: IAppState): IEtoDocument[] => {
  const eto = selectActiveNomineeEto(state);
  const filterFunction = (key: string) =>
    !nomineeIgnoredTemplates.some((templateKey: string) => templateKey === key);

  return eto !== undefined ? objectToFilteredArray(filterFunction, eto.templates) : [];
};

export const selectNomineeEtoDocumentsStatus = (
  state: IAppState,
  previewCode: string,
): TOfferingAgreementsStatus | undefined => {
  const statuses = state.nomineeFlow.nomineeEtosAdditionalData[previewCode];
  return statuses && statuses.offeringAgreementsStatus;
};

export const selectIsISHASignedByIssuer = (state: IAppState, previewCode: string) => {
  const etoData = state.nomineeFlow.nomineeEtosAdditionalData[previewCode];
  return etoData && etoData.investmentAgreementUrl;
};

export const selectCapitalIncrease = (state: IAppState) => {
  const activeNomineeEtoPreviewCode = selectNomineeActiveEtoPreviewCode(state);
  const taskData =
    activeNomineeEtoPreviewCode &&
    state.nomineeFlow.nomineeTasksData.byPreviewCode[activeNomineeEtoPreviewCode];

  return (
    taskData &&
    taskData[ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL] &&
    taskData[ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL].capitalIncrease
  );
};

export const selectRedeemShareCapitalTaskSubstate = (
  state: IAppState,
): ERedeemShareCapitalTaskSubstate => {
  const activeNomineeEtoPreviewCode = selectNomineeActiveEtoPreviewCode(state);
  const taskData =
    activeNomineeEtoPreviewCode &&
    state.nomineeFlow.nomineeTasksData.byPreviewCode[activeNomineeEtoPreviewCode];

  if (taskData && taskData[ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL]) {
    return taskData[ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL].taskSubstate;
  } else {
    throw new DataUnavailableError(
      `task substate is missing! activeNomineeEtoPreviewCode:${activeNomineeEtoPreviewCode}`,
    );
  }
};

export const selectNomineeTaskStep = (state: IAppState) => state.nomineeFlow.activeNomineeTask;

export const selectActiveEtoPreviewCodeFromQueryString = createSelector(selectRouter, state =>
  getActiveEtoPreviewCodeFromQueryString(state.location.search),
);

export const selectNomineeInvestmentAgreementHash = (state: IAppState, previewCode: string) => {
  const nomineeEtosAdditionalData = state.nomineeFlow.nomineeEtosAdditionalData[previewCode];
  return nomineeEtosAdditionalData && nomineeEtosAdditionalData.investmentAgreementUrl;
};

export const selectEtoSpecificTasksStatus = (
  state: IAppState,
  previewCode: string,
): TNomineeEtoSpecificTasksStatus | undefined =>
  state.nomineeFlow.nomineeTasksStatus.byPreviewCode[previewCode];

export const selectEtoSpecificTaskData = (
  state: IAppState,
  previewCode: string,
): TNomineeEtoSpecificTaskData | undefined =>
  state.nomineeFlow.nomineeTasksData.byPreviewCode[previewCode];

export const selectAcceptIshaStateData = (
  state: IAppState,
): TNomineeTaskAcceptIshaData | undefined => {
  const previewCode = selectNomineeActiveEtoPreviewCode(state);
  const taskData = previewCode && selectEtoSpecificTaskData(state, previewCode);

  if (!(taskData && taskData[ENomineeEtoSpecificTask.ACCEPT_ISHA])) {
    return undefined;
  } else {
    return taskData[ENomineeEtoSpecificTask.ACCEPT_ISHA];
  }
};

export const selectNomineeAcceptIshaUploadState = (state: IAppState) => {
  const acceptIshaStateData = selectAcceptIshaStateData(state);
  return acceptIshaStateData && acceptIshaStateData.uploadState;
};

export const selectNomineeAcceptIshaUploadedFileName = (state: IAppState) => {
  const acceptIshaStateData = selectAcceptIshaStateData(state);
  return acceptIshaStateData && acceptIshaStateData.uploadedFileName;
};

export const selectNomineeCompanyName = (state: IAppState, previewCode: string) => {
  const eto = selectNomineeEtos(state)[previewCode];
  return eto && eto.company.name;
};

export const selectNomineeActiveEtoCompanyName = (state: IAppState) => {
  const previewCode = selectNomineeActiveEtoPreviewCode(state);
  return previewCode && selectNomineeCompanyName(state, previewCode);
};

export const selectClaimStateDeadlineTimestamp = (state: IAppState) => {
  const previewCode = selectNomineeActiveEtoPreviewCode(state);
  const startOfClaimState =
    previewCode && selectStartOfOnchainState(state, previewCode, EETOStateOnChain.Claim);

  if (startOfClaimState) {
    const timeLeft = startOfClaimState.getTime() - Date.now();
    return timeLeft > 0 ? startOfClaimState.getTime() : Date.now();
  } else {
    return undefined;
  }
};
