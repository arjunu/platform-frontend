import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";
import { TEtoWithCompanyAndContractReadonly, TOfferingAgreementsStatus } from "../eto/types";
import {
  ENomineeEtoSpecificTask,
  ENomineeRequestError,
  ENomineeTask,
  ENomineeTaskStatus,
  TNomineeRequestStorage,
} from "./types";

export type ENomineeEtoSpecificTasksStatus = {
  [previewCode: string]: { [key in ENomineeEtoSpecificTask]: ENomineeTaskStatus };
};

export type TNomineeTasksStatus = { [key in ENomineeTask]: ENomineeTaskStatus } & {
  byPreviewCode: ENomineeEtoSpecificTasksStatus;
};

export type TNomineeEtosAdditionalData = {
  investmentAgreementUrl: string | undefined;
  offeringAgreementsStatus: TOfferingAgreementsStatus;
  capitalIncrease: string | undefined;
};

export type TNomineeFlowState = {
  ready: boolean;
  loading: boolean;
  error: ENomineeRequestError | string; //TODO ENomineeRequestError is for backward compat, this has to be fixed
  activeNomineeTask: ENomineeTask | ENomineeEtoSpecificTask;
  activeNomineeEtoPreviewCode: string | undefined;
  nomineeRequests: TNomineeRequestStorage;
  nomineeEtos: { [previewCode: string]: TEtoWithCompanyAndContractReadonly };
  nomineeEtosAdditionalData: { [previewCode: string]: TNomineeEtosAdditionalData };
  nomineeTasksStatus: TNomineeTasksStatus;
};

const nomineeFlowInitialState: TNomineeFlowState = {
  ready: false,
  loading: false,
  error: ENomineeRequestError.NONE,
  activeNomineeTask: ENomineeTask.NONE,
  activeNomineeEtoPreviewCode: undefined,
  nomineeRequests: {},
  nomineeEtos: {},
  nomineeEtosAdditionalData: {},
  nomineeTasksStatus: {
    [ENomineeTask.NONE]: ENomineeTaskStatus.NOT_DONE,
    [ENomineeTask.ACCOUNT_SETUP]: ENomineeTaskStatus.NOT_DONE,
    [ENomineeTask.LINK_TO_ISSUER]: ENomineeTaskStatus.NOT_DONE,
    [ENomineeTask.LINK_BANK_ACCOUNT]: ENomineeTaskStatus.NOT_DONE,
    byPreviewCode: {},
  },
};

export const nomineeFlowReducer: AppReducer<TNomineeFlowState> = (
  state = nomineeFlowInitialState,
  action,
): DeepReadonly<TNomineeFlowState> => {
  switch (action.type) {
    case actions.nomineeFlow.storeNomineeTasksStatus.getType():
      return {
        ...state,
        nomineeTasksStatus: action.payload.nomineeTasksStatus,
      };
    case actions.nomineeFlow.createNomineeRequest.getType():
    case actions.nomineeFlow.loadNomineeTaskData.getType():
      return {
        ...state,
        loading: true,
      };
    case actions.nomineeFlow.storeActiveNomineeTask.getType():
      return {
        ...state,
        loading: false,
        ready: true,
        activeNomineeTask: action.payload.activeNomineeTask,
      };
    case actions.nomineeFlow.storeNomineeRequest.getType():
      return {
        ...state,
        nomineeRequests: {
          ...state.nomineeRequests,
          [action.payload.etoId]: action.payload.nomineeRequest,
        },
        error: ENomineeRequestError.NONE,
        loading: false,
      };
    case actions.nomineeFlow.loadingDone.getType():
      return {
        ...state,
        loading: false,
      };
    case actions.nomineeFlow.setActiveNomineeEtoPreviewCode.getType():
      return {
        ...state,
        activeNomineeEtoPreviewCode: action.payload.previewCode,
      };
    case actions.nomineeFlow.setNomineeEtos.getType():
      return {
        ...state,
        nomineeEtos: action.payload.etos,
      };
    case actions.eto.setInvestmentAgreementHash.getType():
      return {
        ...state,
        nomineeEtosAdditionalData: {
          ...state.nomineeEtosAdditionalData,
          [action.payload.previewCode]: {
            ...state.nomineeEtosAdditionalData[action.payload.previewCode],
            investmentAgreementUrl: action.payload.url,
          },
        },
      };
    case actions.eto.setAgreementsStatus.getType():
      return {
        ...state,
        nomineeEtosAdditionalData: {
          ...state.nomineeEtosAdditionalData,
          [action.payload.previewCode]: {
            ...state.nomineeEtosAdditionalData[action.payload.previewCode],
            offeringAgreementsStatus: action.payload.statuses,
          },
        },
      };
    case actions.eto.setCapitalIncrease.getType():
      return {
        ...state,
        nomineeEtosAdditionalData: {
          ...state.nomineeEtosAdditionalData,
          [action.payload.previewCode]: {
            ...state.nomineeEtosAdditionalData[action.payload.previewCode],
            capitalIncrease: action.payload.capitalIncrease,
          },
        },
      };
    default:
      return state;
  }
};
