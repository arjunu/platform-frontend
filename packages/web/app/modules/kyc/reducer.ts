import {
  IKycBeneficialOwner,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycRequestState,
  KycBankQuintessenceBankAccount,
  TKycStatus,
} from "../../lib/api/kyc/KycApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";
import { TBankAccount, TClaims } from "./types";
import { appendIfExists, omitUndefined, updateArrayItem } from "./utils";

export interface IKycState {
  status: TKycStatus | undefined;

  // individual
  individualRequestState?: IKycRequestState;
  individualRequestStateLoading?: boolean;
  individualRequestError?: string;

  individualData?: IKycIndividualData;
  individualDataLoading?: boolean;

  individualFilesLoading?: boolean;
  individualFileUploading?: boolean;
  individualFiles: IKycFileInfo[];

  // business
  businessRequestState?: IKycRequestState;
  businessRequestStateLoading?: boolean;
  businessRequestError?: string;

  businessData?: IKycBusinessData;
  businessDataLoading?: boolean;

  businessFilesLoading?: boolean;
  businessFileUploading?: boolean;
  businessFiles: IKycFileInfo[];

  // legal representatives
  legalRepresentative?: IKycLegalRepresentative;
  legalRepresentativeLoading?: boolean;
  legalRepresentativeFilesLoading?: boolean;
  legalRepresentativeFileUploading?: boolean;
  legalRepresentativeFiles: IKycFileInfo[];

  // beneficial owners
  loadingBeneficialOwners?: boolean;
  loadingBeneficialOwner?: boolean;
  beneficialOwners: IKycBeneficialOwner[];
  beneficialOwnerFilesLoading: { [id: string]: boolean };
  beneficialOwnerFileUploading: { [id: string]: boolean };
  beneficialOwnerFiles: { [id: string]: IKycFileInfo[] };

  // contract claims
  claims: TClaims | undefined;

  // api bank details
  bankAccount: TBankAccount | undefined;
  quintessenceBankAccount: KycBankQuintessenceBankAccount | undefined;
  kycSaving: boolean | undefined;
}

const kycInitialState: IKycState = {
  status: undefined,
  individualFiles: [],
  businessFiles: [],
  legalRepresentativeFiles: [],
  beneficialOwners: [],
  beneficialOwnerFiles: {},
  beneficialOwnerFilesLoading: {},
  beneficialOwnerFileUploading: {},
  claims: undefined,
  bankAccount: undefined,
  quintessenceBankAccount: undefined,
  kycSaving: undefined,
};

export const kycReducer: AppReducer<IKycState> = (
  state = kycInitialState,
  action,
): DeepReadonly<IKycState> => {
  switch (action.type) {
    // general
    case actions.kyc.setStatus.getType():
      return {
        ...state,
        status: action.payload.status,
      };

    // individual
    case actions.kyc.kycSubmitIndividualData.getType():
      return { ...state, kycSaving: action.payload.skipContinue };
    case actions.kyc.kycUpdateIndividualData.getType():
      return { ...state, kycSaving: false, ...omitUndefined(action.payload) };
    case actions.kyc.kycUpdateIndividualRequestState.getType():
    case actions.kyc.kycUpdateIndividualDocuments.getType():
      return { ...state, ...omitUndefined(action.payload) };
    case actions.kyc.kycUpdateIndividualDocument.getType():
      return {
        ...state,
        individualFileUploading: action.payload.individualFileUploading,
        individualFiles: appendIfExists(state.individualFiles, action.payload.file),
      };
    case actions.kyc.kycUpdateBusinessData.getType():
    case actions.kyc.kycUpdateBusinessRequestState.getType():
    case actions.kyc.kycUpdateBusinessDocuments.getType():
    case actions.kyc.kycUpdateLegalRepresentative.getType():
    case actions.kyc.kycUpdateLegalRepresentativeDocuments.getType():
    case actions.kyc.kycUpdateBeneficialOwners.getType():
      return { ...state, ...omitUndefined(action.payload) };
    case actions.kyc.kycUpdateLegalRepresentativeDocument.getType():
      return {
        ...state,
        legalRepresentativeFileUploading: action.payload.legalRepresentativeUploading,
        legalRepresentativeFiles: appendIfExists(
          state.legalRepresentativeFiles,
          action.payload.file,
        ),
      };
    case actions.kyc.kycUpdateBusinessDocument.getType():
      return {
        ...state,
        businessFileUploading: action.payload.businessFileUploading,
        businessFiles: appendIfExists(state.businessFiles, action.payload.file),
      };
    case actions.kyc.kycUpdateBeneficialOwner.getType():
      return {
        ...state,
        loadingBeneficialOwner: action.payload.loadingBeneficialOwner,
        beneficialOwners: updateArrayItem(
          state.beneficialOwners,
          action.payload.id,
          action.payload.beneficialOwner,
        ),
      };
    case actions.kyc.kycUpdateBeneficialOwnerDocuments.getType():
      return {
        ...state,
        beneficialOwnerFilesLoading: {
          ...state.beneficialOwnerFilesLoading,
          [action.payload.boid]: action.payload.beneficialOwnerFilesLoading,
        },
        beneficialOwnerFiles: {
          ...state.beneficialOwnerFiles,
          [action.payload.boid]: action.payload.beneficialOwnerFiles,
        },
      };
    case actions.kyc.kycUpdateBeneficialOwnerDocument.getType():
      const { boid } = action.payload;
      return {
        ...state,
        beneficialOwnerFileUploading: {
          ...state.beneficialOwnerFileUploading,
          [boid]: action.payload.beneficialOwnerFileUploading,
        },
        beneficialOwnerFiles: {
          ...state.beneficialOwnerFiles,
          [boid]: appendIfExists(state.beneficialOwnerFiles[boid], action.payload.file),
        },
      };
    // contract claims
    case actions.kyc.kycSetClaims.getType():
      return { ...state, claims: action.payload.claims };

    // api bank account
    case actions.kyc.setBankAccountDetails.getType(): {
      return { ...state, bankAccount: action.payload.bankAccount };
    }

    case actions.kyc.setQuintessenceBankAccountDetails.getType(): {
      return { ...state, quintessenceBankAccount: action.payload.quintessenceBankAccount };
    }

    default:
      return state;
  }
};
