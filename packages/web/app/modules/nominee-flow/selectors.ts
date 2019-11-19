import { createSelector } from "reselect";

import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { nomineeIgnoredTemplates } from "../../lib/api/eto/EtoFileUtils";
import { IAppState } from "../../store";
import { DataUnavailableError } from "../../utils/errors";
import { objectToFilteredArray } from "../../utils/objectToFilteredArray";
import { TEtoWithCompanyAndContract, TOfferingAgreementsStatus } from "../eto/types";
import { selectRouter } from "../routing/selectors";
import {
  ENomineeEtoSpecificTask,
  ENomineeFlowError,
  ENomineeRequestError,
  ENomineeRequestStatus,
  ENomineeTask,
  ERedeemShareCapitalTaskSubstate,
  TNomineeRequestStorage,
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
  const linkToIssuerData = state.nomineeFlow.activeTaskData[ENomineeTask.LINK_TO_ISSUER];
  if (linkToIssuerData === undefined) {
    throw new DataUnavailableError("activeTaskData for the 'LINK_TO_ISSUER' step is missing");
  } else {
    return linkToIssuerData.error;
  }
};

export const selectActiveTaskData = (state: IAppState) => state.nomineeFlow.activeTaskData;

export const selectLinkToIssuerNextState = (state: IAppState) => {
  const linkToIssuerData = state.nomineeFlow.activeTaskData[ENomineeTask.LINK_TO_ISSUER];
  if (linkToIssuerData === undefined) {
    throw new DataUnavailableError("activeTaskData for the 'LINK_TO_ISSUER' step is missing");
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
): { [previewCode: string]: TEtoWithCompanyAndContract | undefined } | undefined =>
  state.nomineeFlow.nomineeEtos;

export const selectNomineeEto = (
  state: IAppState,
  previewCode: string,
): TEtoWithCompanyAndContract | undefined => {
  const nomineeEtos = selectNomineeEtos(state);
  return nomineeEtos && nomineeEtos[previewCode];
};

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
    state.nomineeFlow.activeTaskData.byPreviewCode[activeNomineeEtoPreviewCode];

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
    state.nomineeFlow.activeTaskData.byPreviewCode[activeNomineeEtoPreviewCode];

  if (taskData && taskData[ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL]) {
    return taskData[ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL].taskSubstate;
  } else {
    throw new DataUnavailableError(
      `task substate is missing! activeNomineeEtoPreviewCode:${activeNomineeEtoPreviewCode}`,
    );
  }
};

export const selectNomineeTaskStep = (state: IAppState) => state.nomineeFlow.activeNomineeTask;

export const selectActiveEtoPreviewCodeFromQueryString = createSelector(
  selectRouter,
  state => getActiveEtoPreviewCodeFromQueryString(state.location.search),
);
