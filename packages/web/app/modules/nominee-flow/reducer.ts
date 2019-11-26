import { ENomineeRequestComponentState } from "../../components/nominee-dashboard/linkToIssuer/types";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { EProcessState } from "../../utils/enums/processStates";
import { actions } from "../actions";
import {
  ENomineeEtoSpecificTask,
  ENomineeFlowError,
  ENomineeRequestError,
  ENomineeTask,
  ENomineeTaskStatus,
  TNomineeFlowState,
} from "./types";

export const initalTaskData = {
  [ENomineeTask.NONE]: {},
  [ENomineeTask.ACCOUNT_SETUP]: {},
  [ENomineeTask.LINK_TO_ISSUER]: {
    nextState: ENomineeRequestComponentState.CREATE_REQUEST,
    error: ENomineeRequestError.NONE,
  },
  [ENomineeTask.LINK_BANK_ACCOUNT]: {},
  byPreviewCode: {},
};

export const initialEtoSpecificTaskData = {
  [ENomineeEtoSpecificTask.ACCEPT_THA]: {},
  [ENomineeEtoSpecificTask.ACCEPT_RAAA]: {},
  [ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL]: {},
  [ENomineeEtoSpecificTask.ACCEPT_ISHA]: {
    uploadState: EProcessState.NOT_STARTED,
    uploadedFileName: undefined,
  },
};

export const initalNomineeTaskStatus = {
  [ENomineeTask.NONE]: ENomineeTaskStatus.NOT_DONE,
  [ENomineeTask.ACCOUNT_SETUP]: ENomineeTaskStatus.NOT_DONE,
  [ENomineeTask.LINK_TO_ISSUER]: ENomineeTaskStatus.NOT_DONE,
  [ENomineeTask.LINK_BANK_ACCOUNT]: ENomineeTaskStatus.NOT_DONE,
  byPreviewCode: {},
};

export const initialNomineeEtoSpecificTaskStatus = {
  [ENomineeEtoSpecificTask.ACCEPT_THA]: ENomineeTaskStatus.NOT_DONE,
  [ENomineeEtoSpecificTask.ACCEPT_RAAA]: ENomineeTaskStatus.NOT_DONE,
  [ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL]: ENomineeTaskStatus.NOT_DONE,
  [ENomineeEtoSpecificTask.ACCEPT_ISHA]: ENomineeTaskStatus.NOT_DONE,
};

const nomineeFlowInitialState: TNomineeFlowState = {
  ready: false,
  loading: false,
  error: ENomineeFlowError.NONE,
  activeNomineeTask: ENomineeTask.NONE,
  nomineeTasksData: initalTaskData,
  activeNomineeEtoPreviewCode: undefined,
  nomineeRequests: {},
  nomineeEtos: {},
  nomineeEtosAdditionalData: {},
  nomineeTasksStatus: initalNomineeTaskStatus,
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
        nomineeTasksData: action.payload.nomineeTasksData,
      };
    case actions.nomineeFlow.setNomineeRequests.getType():
      return {
        ...state,
        nomineeRequests: {
          ...state.nomineeRequests,
          ...action.payload.nomineeRequests,
        },
        nomineeTasksData: {
          ...state.nomineeTasksData,
          [ENomineeTask.LINK_TO_ISSUER]: {
            ...state.nomineeTasksData[ENomineeTask.LINK_TO_ISSUER],
            error: ENomineeRequestError.NONE,
          },
        },
        loading: false,
      };
    case actions.nomineeFlow.storeNomineeRequest.getType():
      return {
        ...state,
        nomineeRequests: {
          ...state.nomineeRequests,
          [action.payload.etoId]: action.payload.nomineeRequest,
        },
        nomineeTasksData: {
          ...state.nomineeTasksData,
          [ENomineeTask.LINK_TO_ISSUER]: {
            ...state.nomineeTasksData[ENomineeTask.LINK_TO_ISSUER],
            error: ENomineeRequestError.NONE,
          },
        },
        loading: false,
      };
    case actions.nomineeFlow.storeNomineeRequestError.getType():
      return {
        ...state,
        nomineeTasksData: {
          ...state.nomineeTasksData,
          [ENomineeTask.LINK_TO_ISSUER]: {
            ...state.nomineeTasksData[ENomineeTask.LINK_TO_ISSUER],
            error: action.payload.requestError,
          },
        },
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
    case actions.nomineeFlow.setNomineeEtoSpecificTasksData.getType():
      return {
        ...state,
        nomineeTasksData: {
          ...state.nomineeTasksData,
          byPreviewCode: action.payload.tasksByPreviewCode,
        },
      };
    case actions.nomineeFlow.setNomineeEtoSpecificTasksStatus.getType():
      return {
        ...state,
        nomineeTasksStatus: {
          ...state.nomineeTasksStatus,
          byPreviewCode: action.payload.tasksStatusByPreviewCode,
        },
      };
    case actions.nomineeFlow.nomineeSetInvestmentAgreementHash.getType():
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
    case actions.nomineeFlow.nomineeSetAgreementsStatus.getType():
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
    case actions.nomineeFlow.nomineeIshaCheckSuccess.getType():
      return {
        ...state,
        nomineeTasksData: {
          ...state.nomineeTasksData,
          byPreviewCode: {
            ...state.nomineeTasksData.byPreviewCode,
            [action.payload.previewCode]: {
              ...state.nomineeTasksData.byPreviewCode[action.payload.previewCode],
              [ENomineeEtoSpecificTask.ACCEPT_ISHA]: {
                uploadState: EProcessState.SUCCESS,
                uploadedFileName: action.payload.uploadedFileName,
              },
            },
          },
        },
      };
    case actions.nomineeFlow.nomineeIshaUploadInProgress.getType():
      return {
        ...state,
        nomineeTasksData: {
          ...state.nomineeTasksData,
          byPreviewCode: {
            ...state.nomineeTasksData.byPreviewCode,
            [action.payload.previewCode]: {
              ...state.nomineeTasksData.byPreviewCode[action.payload.previewCode],
              [ENomineeEtoSpecificTask.ACCEPT_ISHA]: {
                uploadState: EProcessState.IN_PROGRESS,
                uploadedFileName: undefined,
              },
            },
          },
        },
      };
    case actions.nomineeFlow.nomineeRemoveUploadedIsha.getType():
      return {
        ...state,
        nomineeTasksData: {
          ...state.nomineeTasksData,
          byPreviewCode: {
            ...state.nomineeTasksData.byPreviewCode,
            [action.payload.previewCode]: {
              ...state.nomineeTasksData.byPreviewCode[action.payload.previewCode],
              [ENomineeEtoSpecificTask.ACCEPT_ISHA]: {
                uploadState: EProcessState.NOT_STARTED,
                uploadedFileName: undefined,
              },
            },
          },
        },
      };
    case actions.nomineeFlow.nomineeIshaCheckError.getType():
      return {
        ...state,
        nomineeTasksData: {
          ...state.nomineeTasksData,
          byPreviewCode: {
            ...state.nomineeTasksData.byPreviewCode,
            [action.payload.previewCode]: {
              ...state.nomineeTasksData.byPreviewCode[action.payload.previewCode],
              [ENomineeEtoSpecificTask.ACCEPT_ISHA]: {
                uploadState: EProcessState.ERROR,
                uploadedFileName: action.payload.uploadedFileName,
              },
            },
          },
        },
      };
    default:
      return state;
  }
};
