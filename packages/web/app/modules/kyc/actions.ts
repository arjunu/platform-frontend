import { createActionFactory } from "@neufund/shared";

import {
  EKycBusinessType,
  IKycBeneficialOwner,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycRequestState,
  KycBankQuintessenceBankAccount,
} from "../../lib/api/kyc/KycApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";
import { TBankAccount, TClaims } from "./types";

export const kycActions = {
  /**
   * General
   */
  kycLoadClientData: () => createSimpleAction("KYC_LOAD_CLIENT_DATA"),
  kycFinishedLoadingData: () => createSimpleAction("KYC_FINISHED_LOADING_DATA"),

  /**
   * Widget watchers
   */
  kycStartWatching: () => createSimpleAction("KYC_WATCHER_START"),
  kycStopWatching: () => createSimpleAction("KYC_WATCHER_STOP"),

  /**
   * Contract Claims
   */
  kycLoadClaims: () => createSimpleAction("KYC_LOAD_CLAIMS"),
  kycSetClaims: (claims: TClaims) => createAction("KYC_SET_CLAIMS", { claims }),

  /**
   * Individual
   */

  // data
  kycSubmitIndividualData: (data: IKycIndividualData, skipContinue = false) =>
    createAction("KYC_SUBMIT_INDIVIDUAL_FORM", { data, skipContinue }),

  kycLoadIndividualData: () => createSimpleAction("KYC_LOAD_INDIVIDUAL_DATA"),

  kycUpdateIndividualData: (individualDataLoading?: boolean, individualData?: IKycIndividualData) =>
    createAction("KYC_UPDATE_INDIVIDUAL_DATA", {
      individualData,
      individualDataLoading,
    }),

  // files
  kycLoadIndividualDocumentList: () => createSimpleAction("KYC_LOAD_INDIVIDUAL_FILE_LIST"),

  kycUploadIndividualDocument: (file: File) => createAction("KYC_UPLOAD_INDIVIDUAL_FILE", { file }),

  kycUpdateIndividualDocuments: (
    individualFilesLoading: boolean,
    individualFiles: IKycFileInfo[] = [],
  ) =>
    createAction("KYC_UPDATE_INDIVIDUAL_FILES_INFO", { individualFilesLoading, individualFiles }),

  kycUpdateIndividualDocument: (individualFileUploading: boolean, file?: IKycFileInfo) =>
    createAction("KYC_UPDATE_INDIVIDUAL_FILE_INFO", { individualFileUploading, file }),

  // request
  kycLoadIndividualRequest: (inBackground: boolean = false) =>
    createAction("KYC_LOAD_INDIVIDUAL_REQUEST_STATE", { inBackground }),

  kycUpdateIndividualRequestState: (
    individualRequestStateLoading?: boolean,
    individualRequestState?: IKycRequestState,
    individualRequestError?: string,
  ) =>
    createAction("KYC_UPDATE_INDIVIDUAL_REQUEST_STATE", {
      individualRequestState,
      individualRequestStateLoading,
      individualRequestError,
    }),

  kycSubmitIndividualRequest: () => createSimpleAction("KYC_SUBMIT_INDIVIDUAL_REQUEST"),

  kycStartInstantId: () => createSimpleAction("KYC_START_INSTANT_ID"),
  kycCancelInstantId: () => createSimpleAction("KYC_CANCEL_INSTANT_ID"),

  /*
    Business
   */
  kycSetBusinessType: (type: EKycBusinessType) => createAction("KYC_SET_BUSINESS_TYPE", { type }),

  // business data
  kycSubmitBusinessData: (data: IKycBusinessData) =>
    createAction("KYC_SUBMIT_BUSINESS_DATA", { data }),

  kycLoadBusinessData: () => createSimpleAction("KYC_LOAD_BUSINESS_DATA"),

  kycUpdateBusinessData: (businessDataLoading?: boolean, businessData?: IKycBusinessData) =>
    createAction("KYC_UPDATE_BUSINESS_DATA", {
      businessData,
      businessDataLoading,
    }),

  // business documents
  kycLoadBusinessDocumentList: () => createSimpleAction("KYC_LOAD_BUSINESS_FILE_LIST"),

  kycUploadBusinessDocument: (file: File) => createAction("KYC_UPLOAD_BUSINESS_FILE", { file }),

  kycUpdateBusinessDocuments: (businessFilesLoading: boolean, businessFiles: IKycFileInfo[] = []) =>
    createAction("KYC_UPDATE_BUSINESS_FILES_INFO", { businessFilesLoading, businessFiles }),

  kycUpdateBusinessDocument: (businessFileUploading: boolean, file?: IKycFileInfo) =>
    createAction("KYC_UPDATE_BUSINESS_FILE_INFO", { businessFileUploading, file }),

  // legal representative data
  kycSubmitLegalRepresentative: (data: IKycLegalRepresentative) =>
    createAction("KYC_SUBMIT_LEGAL_REPRESENTATIVE", { data }),

  kycLoadLegalRepresentative: () => createSimpleAction("KYC_LOAD_LEGAL_REPRESENTATIVE"),

  kycUpdateLegalRepresentative: (
    legalRepresentativeLoading?: boolean,
    legalRepresentative?: IKycLegalRepresentative,
  ) =>
    createAction("KYC_UPDATE_LEGAL_REPRESENTATIVE", {
      legalRepresentative,
      legalRepresentativeLoading,
    }),

  // legal representative documents
  kycLoadLegalRepresentativeDocumentList: () =>
    createSimpleAction("KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST"),

  kycUploadLegalRepresentativeDocument: (file: File) =>
    createAction("KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE", { file }),

  kycUpdateLegalRepresentativeDocuments: (
    legalRepresentativeFilesLoading: boolean,
    legalRepresentativeFiles: IKycFileInfo[] = [],
  ) =>
    createAction("KYC_UPDATE_LEGAL_REPRESENTATIVE_FILES_INFO", {
      legalRepresentativeFilesLoading,
      legalRepresentativeFiles,
    }),

  kycUpdateLegalRepresentativeDocument: (
    legalRepresentativeUploading: boolean,
    file?: IKycFileInfo,
  ) =>
    createAction("KYC_UPDATE_LEGAL_REPRESENTATIVE_FILE_INFO", {
      legalRepresentativeUploading,
      file,
    }),

  // beneficial owners
  kycLoadBeneficialOwners: () => createSimpleAction("KYC_LOAD_BENEFICIAL_OWNERS"),
  kycUpdateBeneficialOwners: (
    loadingBeneficialOwners: boolean,
    beneficialOwners: IKycBeneficialOwner[] = [],
  ) => createAction("KYC_UPDATE_BENEFICIAL_OWNERS", { loadingBeneficialOwners, beneficialOwners }),
  kycAddBeneficialOwner: () => createSimpleAction("KYC_ADD_BENEFICIAL_OWNER"),
  kycDeleteBeneficialOwner: (id: string) => createAction("KYC_DELETE_BENEFICIAL_OWNER", { id }),
  kycSubmitBeneficialOwner: (owner: IKycBeneficialOwner) =>
    createAction("KYC_SUBMIT_BENEFICIAL_OWNER", { owner }),
  kycUpdateBeneficialOwner: (
    loadingBeneficialOwner: boolean,
    id?: string,
    beneficialOwner?: IKycBeneficialOwner,
  ) => createAction("KYC_UPDATE_BENEFICIAL_OWNER", { loadingBeneficialOwner, id, beneficialOwner }),

  // beneficial owners documents
  kycLoadBeneficialOwnerDocumentList: (boid: string) =>
    createAction("KYC_LOAD_BENEFICIAL_OWNER_FILE_LIST", { boid }),

  kycUploadBeneficialOwnerDocument: (boid: string, file: File) =>
    createAction("KYC_UPLOAD_BENEFICIAL_OWNER_FILE", { boid, file }),

  kycUpdateBeneficialOwnerDocuments: (
    boid: string,
    beneficialOwnerFilesLoading: boolean,
    beneficialOwnerFiles: IKycFileInfo[] = [],
  ) =>
    createAction("KYC_UPDATE_BENEFICIAL_OWNER_FILES_INFO", {
      boid,
      beneficialOwnerFilesLoading,
      beneficialOwnerFiles,
    }),

  kycUpdateBeneficialOwnerDocument: (
    boid: string,
    beneficialOwnerFileUploading: boolean,
    file?: IKycFileInfo,
  ) =>
    createAction("KYC_UPDATE_BENEFICIAL_OWNER_FILE_INFO", {
      boid,
      beneficialOwnerFileUploading,
      file,
    }),
  // request
  kycLoadBusinessRequest: (inBackground: boolean = false) =>
    createAction("KYC_LOAD_BUSINESS_REQUEST_STATE", { inBackground }),

  kycUpdateBusinessRequestState: (
    businessRequestStateLoading?: boolean,
    businessRequestState?: IKycRequestState,
    businessRequestError?: string,
  ) =>
    createAction("KYC_UPDATE_BUSINESS_REQUEST_STATE", {
      businessRequestState,
      businessRequestStateLoading,
      businessRequestError,
    }),

  kycSubmitBusinessRequest: () => createSimpleAction("KYC_SUBMIT_BUSINESS_REQUEST"),

  /**
   * Bank Account
   */

  // public actions
  loadBankAccountDetails: createActionFactory("KYC_LOAD_BANK_ACCOUNT_DETAILS"),

  // state mutations
  setBankAccountDetails: createActionFactory(
    "KYC_SET_BANK_ACCOUNT_DETAILS",
    (bankAccount: TBankAccount) => ({ bankAccount }),
  ),

  setQuintessenceBankAccountDetails: createActionFactory(
    "KYC_SET_QUINTESSENCE_BANK_ACCOUNT_DETAILS",
    (quintessenceBankAccount: KycBankQuintessenceBankAccount) => ({ quintessenceBankAccount }),
  ),
};
