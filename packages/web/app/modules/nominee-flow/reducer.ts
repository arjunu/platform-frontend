import { ENomineeRequestComponentState } from "../../components/nominee-dashboard/linkToIssuer/types";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";
import { TEtoWithCompanyAndContractReadonly, TOfferingAgreementsStatus } from "../eto/types";
import {
  ENomineeEtoSpecificTask,
  ENomineeFlowError,
  ENomineeRequestError,
  ENomineeTask,
  ENomineeTaskStatus,
  ERedeemShareCapitalTaskSubstate,
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

export type TNomineeTaskLinkToIssuerData = { nextState: ENomineeRequestComponentState };

export type TNomineeTaskRedeemShareCapitalData = {
  capitalIncrease: string;
  walletBalance: string;
  taskSubstate: ERedeemShareCapitalTaskSubstate;
};

export type TTaskSpecificData = Partial<{ [key in ENomineeTask]: unknown }> &
  Partial<{ [ENomineeTask.LINK_TO_ISSUER]: TNomineeTaskLinkToIssuerData }> & {
    byPreviewCode: {
      [previewCode: string]: Partial<{ [key in ENomineeEtoSpecificTask]: unknown }> &
        Partial<{
          [ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL]: TNomineeTaskRedeemShareCapitalData;
        }>;
    };
  };

export type TNomineeFlowState = {
  ready: boolean;
  loading: boolean;
  error: ENomineeRequestError | ENomineeFlowError; //TODO ENomineeRequestError should be stored in taskData after the linkToIssuer flow is moved to sagas
  activeNomineeTask: ENomineeTask | ENomineeEtoSpecificTask;
  activeTaskData: TTaskSpecificData;
  activeNomineeEtoPreviewCode: string | undefined;
  nomineeRequests: TNomineeRequestStorage;
  nomineeEtos: { [previewCode: string]: TEtoWithCompanyAndContractReadonly };
  nomineeEtosAdditionalData: { [previewCode: string]: TNomineeEtosAdditionalData };
  nomineeTasksStatus: TNomineeTasksStatus;
};

const nomineeFlowInitialState: TNomineeFlowState = {
  ready: false,
  loading: false,
  error: ENomineeFlowError.NONE,
  activeNomineeTask: ENomineeTask.NONE,
  activeTaskData: {
    byPreviewCode: {},
  },
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
    case actions.nomineeFlow.storeError.getType():
      return {
        ...state,
        error: action.payload.error,
      };
    case actions.nomineeFlow.createNomineeRequest.getType():
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
        activeTaskData: {
          ...state.activeTaskData,
          ...action.payload.activeTaskData,
        },
      };
    case actions.nomineeFlow.setNomineeRequests.getType():
      return {
        ...state,
        nomineeRequests: {
          ...state.nomineeRequests,
          ...action.payload.nomineeRequests,
        },
        error: ENomineeRequestError.NONE,
        loading: false,
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
    default:
      return state;
  }
};
