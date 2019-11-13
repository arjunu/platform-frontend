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
    case "KYC_SUBMIT_INDIVIDUAL_FORM":
      return { ...state, kycSaving: action.payload.skipContinue };
    case "KYC_UPDATE_INDIVIDUAL_DATA":
      return { ...state, kycSaving: false, ...omitUndefined(action.payload) };
    case "KYC_UPDATE_INDIVIDUAL_REQUEST_STATE":
    case "KYC_UPDATE_INDIVIDUAL_FILES_INFO":
      return { ...state, ...omitUndefined(action.payload) };
    case "KYC_UPDATE_INDIVIDUAL_FILE_INFO":
      return {
        ...state,
        individualFileUploading: action.payload.individualFileUploading,
        individualFiles: appendIfExists(state.individualFiles, action.payload.file),
      };
    case "KYC_UPDATE_BUSINESS_DATA":
    case "KYC_UPDATE_BUSINESS_REQUEST_STATE":
    case "KYC_UPDATE_BUSINESS_FILES_INFO":
    case "KYC_UPDATE_LEGAL_REPRESENTATIVE":
    case "KYC_UPDATE_LEGAL_REPRESENTATIVE_FILES_INFO":
    case "KYC_UPDATE_BENEFICIAL_OWNERS":
      return { ...state, ...omitUndefined(action.payload) };
    case "KYC_UPDATE_LEGAL_REPRESENTATIVE_FILE_INFO":
      return {
        ...state,
        legalRepresentativeFileUploading: action.payload.legalRepresentativeUploading,
        legalRepresentativeFiles: appendIfExists(
          state.legalRepresentativeFiles,
          action.payload.file,
        ),
      };
    case "KYC_UPDATE_BUSINESS_FILE_INFO":
      return {
        ...state,
        businessFileUploading: action.payload.businessFileUploading,
        businessFiles: appendIfExists(state.businessFiles, action.payload.file),
      };
    case "KYC_UPDATE_BENEFICIAL_OWNER":
      return {
        ...state,
        loadingBeneficialOwner: action.payload.loadingBeneficialOwner,
        beneficialOwners: updateArrayItem(
          state.beneficialOwners,
          action.payload.id,
          action.payload.beneficialOwner,
        ),
      };
    case "KYC_UPDATE_BENEFICIAL_OWNER_FILES_INFO":
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
    case "KYC_UPDATE_BENEFICIAL_OWNER_FILE_INFO":
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
    case "KYC_SET_CLAIMS":
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
