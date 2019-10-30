import { isEmpty } from "lodash/fp";
import { createSelector } from "reselect";

import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { nomineeIgnoredTemplates } from "../../lib/api/eto/EtoFileUtils";
import { IAppState } from "../../store";
import { objectToFilteredArray } from "../../utils/objectToFilteredArray";
import {
  selectAgreementsStatus,
  selectInvestmentAgreement,
} from "../eto/selectors";
import {
  EEtoAgreementStatus, TEtoWithCompanyAndContract,
  TOfferingAgreementsStatus,
} from "../eto/types";
import { selectRouter } from "../routing/selectors";
import { EAgreementType } from "../tx/transactions/nominee/sign-agreement/types";
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
): TOfferingAgreementsStatus | undefined => {
  const etos = selectNomineeEtos(state);

  if (etos !== undefined) {
    // if nominee has no etos linked yet return `NOT_DONE` for all agreements
    if (isEmpty(etos)) {
      return {
        [EAgreementType.RAAA]: EEtoAgreementStatus.NOT_DONE,
        [EAgreementType.THA]: EEtoAgreementStatus.NOT_DONE,
        [EAgreementType.ISHA]: EEtoAgreementStatus.NOT_DONE,
      };
    }

    const eto = selectActiveNomineeEto(state);
    if (eto !== undefined) {
      return selectAgreementsStatus(state, eto.previewCode);
    }
  }

  return undefined;
};

export const selectIsISHASignedByIssuer = (state: IAppState) => {
  const eto = selectActiveNomineeEto(state);

  if (eto) {
    const investmentAgreement = selectInvestmentAgreement(state, eto.previewCode);

    if (investmentAgreement) {
      return investmentAgreement.isLoading ? undefined : !!investmentAgreement.url;
    }
  }

  return undefined;
};

export const selectCapitalIncrease = (state: IAppState) => {
  const eto = selectActiveNomineeEto(state);

  if (eto) {
    const investmentAgreement = selectInvestmentAgreement(state, eto.previewCode);

    if (investmentAgreement) {
      return investmentAgreement.isLoading ? undefined : !!investmentAgreement.url;
    }
  }

  return undefined;
};

export const selectNomineeTaskStep = (state:IAppState) =>
  state.nomineeFlow.nomineeTask;

export const selectActiveEtoPreviewCodeFromQueryString = createSelector(
  selectRouter,
  state => getActiveEtoPreviewCodeFromQueryString(state.location.search),
);
