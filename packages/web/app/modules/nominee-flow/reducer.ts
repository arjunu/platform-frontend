import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";
import {
  ENomineeLinkBankAccountStatus,
  ENomineeRedeemShareholderCapitalStatus,
  ENomineeRequestError, ENomineeTask,
  ENomineeUploadIshaStatus,
  TNomineeRequestStorage,
} from "./types";
import { TEtoWithCompanyAndContractReadonly } from "../eto/types";

export type TNomineeFlowState = {
  ready:boolean;
  loading: boolean;
  error: ENomineeRequestError;
  activeNomineeEtoPreviewCode: string | undefined;
  nomineeRequests: TNomineeRequestStorage;
  nomineeEtos: { [previewCode: string]: TEtoWithCompanyAndContractReadonly };
  nomineeEtosAdditionalData: { [previewCode: string]: any }, //fixme typings
  linkBankAccount: ENomineeLinkBankAccountStatus;
  redeemShareholderCapital: ENomineeRedeemShareholderCapitalStatus;
  uploadIsha: ENomineeUploadIshaStatus;
  nomineeTask:ENomineeTask,
  capitalIncrease: string | undefined
}

const nomineeFlowInitialState: TNomineeFlowState = {
  ready: false,
  loading: false,
  error: ENomineeRequestError.NONE,
  activeNomineeEtoPreviewCode: undefined,
  nomineeRequests: {},
  nomineeEtos: {},
  nomineeEtosAdditionalData: {},
  linkBankAccount: ENomineeLinkBankAccountStatus.NOT_DONE,
  redeemShareholderCapital: ENomineeRedeemShareholderCapitalStatus.NOT_DONE,
  uploadIsha: ENomineeUploadIshaStatus.NOT_DONE,
  nomineeTask:ENomineeTask.NONE,
  capitalIncrease: undefined
};

export const nomineeFlowReducer: AppReducer<TNomineeFlowState> = (
  state = nomineeFlowInitialState,
  action,
): DeepReadonly<TNomineeFlowState> => {
  switch (action.type) {
    case actions.nomineeFlow.createNomineeRequest.getType():
    case actions.nomineeFlow.loadNomineeTaskData.getType():
      return {
        ...state,
        loading: true,
      };
    case actions.nomineeFlow.storeNomineeTaskData.getType():
      return {
        ...state,
        loading: false,
        ready: true,
        nomineeRequests: action.payload.tasks.nomineeRequests,
        nomineeTask:action.payload.tasks.actualTask
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
    case actions.nomineeFlow.setActiveNomineeEto.getType():
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
            investmentAgreementUrl: action.payload.url
          }
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
            capitalIncrease: action.payload.capitalIncrease
          }
        }
      };
    default:
      return state;
  }
};
