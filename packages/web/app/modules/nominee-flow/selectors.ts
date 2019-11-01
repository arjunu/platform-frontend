import { createSelector } from "reselect";

import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { nomineeIgnoredTemplates } from "../../lib/api/eto/EtoFileUtils";
import { IAppState } from "../../store";
import { objectToFilteredArray } from "../../utils/objectToFilteredArray";
import { TEtoWithCompanyAndContract, TOfferingAgreementsStatus } from "../eto/types";
import { selectRouter } from "../routing/selectors";
import { ENomineeRequestStatus, TNomineeRequestStorage } from "./types";
import { getActiveEtoPreviewCodeFromQueryString } from "./utils";

export const selectNomineeFlow = (state: IAppState) => state.nomineeFlow;

export const selectNomineeStateIsLoading = (state: IAppState) => state.nomineeFlow.loading;

export const selectNomineeDashboardIsReady = (state: IAppState) => state.nomineeFlow.ready;

export const selectNomineeStateError = (state: IAppState) => state.nomineeFlow.error;

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

export const selectNomineeActiveEtoPreviewCode = (state: IAppState) =>
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
  if (
    !activeNomineeEtoPreviewCode ||
    !state.nomineeFlow.nomineeEtosAdditionalData[activeNomineeEtoPreviewCode]
  ) {
    return undefined;
  } else {
    return state.nomineeFlow.nomineeEtosAdditionalData[activeNomineeEtoPreviewCode].capitalIncrease;
  }
};

export const selectNomineeTaskStep = (state: IAppState) => state.nomineeFlow.activeNomineeTask;

export const selectActiveEtoPreviewCodeFromQueryString = createSelector(
  selectRouter,
  state => getActiveEtoPreviewCodeFromQueryString(state.location.search),
);
