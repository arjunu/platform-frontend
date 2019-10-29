import { TCompanyEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
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

export type TNomineeFlowState = {
  ready:boolean;
  loading: boolean;
  error: ENomineeRequestError;
  activeNomineeEtoPreviewCode: string | undefined;
  nomineeRequests: TNomineeRequestStorage;
  nomineeEtos: { [previewCode: string]: TEtoSpecsData | undefined } | undefined;
  nomineeEtosCompanies: { [companyId: string]: TCompanyEtoData | undefined };
  linkBankAccount: ENomineeLinkBankAccountStatus;
  redeemShareholderCapital: ENomineeRedeemShareholderCapitalStatus;
  uploadIsha: ENomineeUploadIshaStatus;
  nomineeTask:ENomineeTask
}

const nomineeFlowInitialState: TNomineeFlowState = {
  ready: false,
  loading: false,
  error: ENomineeRequestError.NONE,
  activeNomineeEtoPreviewCode: undefined,
  nomineeRequests: {},
  nomineeEtos: undefined,
  nomineeEtosCompanies: {},
  linkBankAccount: ENomineeLinkBankAccountStatus.NOT_DONE,
  redeemShareholderCapital: ENomineeRedeemShareholderCapitalStatus.NOT_DONE,
  uploadIsha: ENomineeUploadIshaStatus.NOT_DONE,
  nomineeTask:ENomineeTask.NONE
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
        nomineeEtosCompanies: action.payload.companies,
      };
    default:
      return state;
  }
};
