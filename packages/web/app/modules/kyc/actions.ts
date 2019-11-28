import { createActionFactory } from "@neufund/shared";

import {
  EKycBusinessType,
  IKycBeneficialOwner,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  KycBankQuintessenceBankAccount,
  TKycStatus,
} from "../../lib/api/kyc/KycApi.interfaces";
import { TBankAccount, TClaims } from "./types";

export const kycActions = {
  /**
   * General
   */
  setStatus: createActionFactory("KYC_SET_STATUS", (status: TKycStatus) => ({ status })),
  setStatusLoading: createActionFactory("KYC_SET_STATUS_LOADING"),
  setStatusError: createActionFactory("KYC_SET_STATUS_ERROR", (error: string) => ({ error })),

  kycLoadStatusAndData: createActionFactory("KYC_LOAD_CLIENT_DATA"),

  /**
   * Widget watchers
   */
  kycStartWatching: createActionFactory("KYC_WATCHER_START"),
  kycStopWatching: createActionFactory("KYC_WATCHER_STOP"),

  /**
   * Contract Claims
   */
  kycLoadClaims: createActionFactory("KYC_LOAD_CLAIMS"),
  kycSetClaims: createActionFactory("KYC_SET_CLAIMS", (claims: TClaims) => ({ claims })),

  /**
   * Individual
   */

  // data
  kycSubmitIndividualData: createActionFactory(
    "KYC_SUBMIT_INDIVIDUAL_FORM",
    (data: IKycIndividualData, skipContinue = false) => ({ data, skipContinue }),
  ),

  kycLoadIndividualData: createActionFactory("KYC_LOAD_INDIVIDUAL_DATA"),

  kycUpdateIndividualData: createActionFactory(
    "KYC_UPDATE_INDIVIDUAL_DATA",
    (individualDataLoading?: boolean, individualData?: IKycIndividualData) => ({
      individualData,
      individualDataLoading,
    }),
  ),

  // files
  kycLoadIndividualDocumentList: createActionFactory("KYC_LOAD_INDIVIDUAL_FILE_LIST"),

  kycUploadIndividualDocument: createActionFactory("KYC_UPLOAD_INDIVIDUAL_FILE", (file: File) => ({
    file,
  })),

  kycUpdateIndividualDocuments: createActionFactory(
    "KYC_UPDATE_INDIVIDUAL_FILES_INFO",
    (individualFilesLoading: boolean, individualFiles: IKycFileInfo[] = []) => ({
      individualFilesLoading,
      individualFiles,
    }),
  ),

  kycUpdateIndividualDocument: createActionFactory(
    "KYC_UPDATE_INDIVIDUAL_FILE_INFO",
    (individualFileUploading: boolean, file?: IKycFileInfo) => ({
      individualFileUploading,
      file,
    }),
  ),

  // request
  kycLoadIndividualRequest: createActionFactory(
    "KYC_LOAD_INDIVIDUAL_REQUEST_STATE",
    (inBackground: boolean = false) => ({
      inBackground,
    }),
  ),

  kycSubmitIndividualRequest: createActionFactory("KYC_SUBMIT_INDIVIDUAL_REQUEST"),

  kycStartIndividualIdNow: createActionFactory("KYC_START_INSTANT_ID"),

  /*
    Business
   */
  kycSetBusinessType: createActionFactory("KYC_SET_BUSINESS_TYPE", (type: EKycBusinessType) => ({
    type,
  })),

  // business data
  kycSubmitBusinessData: createActionFactory(
    "KYC_SUBMIT_BUSINESS_DATA",
    (data: IKycBusinessData) => ({ data }),
  ),

  kycLoadBusinessData: createActionFactory("KYC_LOAD_BUSINESS_DATA"),

  kycUpdateBusinessData: createActionFactory(
    "KYC_UPDATE_BUSINESS_DATA",
    (businessDataLoading?: boolean, businessData?: IKycBusinessData) => ({
      businessData,
      businessDataLoading,
    }),
  ),

  // business documents
  kycLoadBusinessDocumentList: createActionFactory("KYC_LOAD_BUSINESS_FILE_LIST"),

  kycUploadBusinessDocument: createActionFactory("KYC_UPLOAD_BUSINESS_FILE", (file: File) => ({
    file,
  })),

  kycUpdateBusinessDocuments: createActionFactory(
    "KYC_UPDATE_BUSINESS_FILES_INFO",
    (businessFilesLoading: boolean, businessFiles: IKycFileInfo[] = []) => ({
      businessFilesLoading,
      businessFiles,
    }),
  ),

  kycUpdateBusinessDocument: createActionFactory(
    "KYC_UPDATE_BUSINESS_FILE_INFO",
    (businessFileUploading: boolean, file?: IKycFileInfo) => ({ businessFileUploading, file }),
  ),

  // legal representative data
  kycSubmitLegalRepresentative: createActionFactory(
    "KYC_SUBMIT_LEGAL_REPRESENTATIVE",
    (data: IKycLegalRepresentative) => ({ data }),
  ),

  kycLoadLegalRepresentative: createActionFactory("KYC_LOAD_LEGAL_REPRESENTATIVE"),

  kycUpdateLegalRepresentative: createActionFactory(
    "KYC_UPDATE_LEGAL_REPRESENTATIVE",
    (legalRepresentativeLoading?: boolean, legalRepresentative?: IKycLegalRepresentative) => ({
      legalRepresentative,
      legalRepresentativeLoading,
    }),
  ),

  // legal representative documents
  kycLoadLegalRepresentativeDocumentList: createActionFactory(
    "KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST",
  ),

  kycUploadLegalRepresentativeDocument: createActionFactory(
    "KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE",
    (file: File) => ({ file }),
  ),

  kycUpdateLegalRepresentativeDocuments: createActionFactory(
    "KYC_UPDATE_LEGAL_REPRESENTATIVE_FILES_INFO",
    (legalRepresentativeFilesLoading: boolean, legalRepresentativeFiles: IKycFileInfo[] = []) => ({
      legalRepresentativeFilesLoading,
      legalRepresentativeFiles,
    }),
  ),

  kycUpdateLegalRepresentativeDocument: createActionFactory(
    "KYC_UPDATE_LEGAL_REPRESENTATIVE_FILE_INFO",
    (legalRepresentativeUploading: boolean, file?: IKycFileInfo) => ({
      legalRepresentativeUploading,
      file,
    }),
  ),

  // beneficial owners
  kycLoadBeneficialOwners: createActionFactory("KYC_LOAD_BENEFICIAL_OWNERS"),
  kycUpdateBeneficialOwners: createActionFactory(
    "KYC_UPDATE_BENEFICIAL_OWNERS",
    (loadingBeneficialOwners: boolean, beneficialOwners: IKycBeneficialOwner[] = []) => ({
      loadingBeneficialOwners,
      beneficialOwners,
    }),
  ),
  kycAddBeneficialOwner: createActionFactory("KYC_ADD_BENEFICIAL_OWNER"),
  kycDeleteBeneficialOwner: createActionFactory("KYC_DELETE_BENEFICIAL_OWNER", (id: string) => ({
    id,
  })),
  kycSubmitBeneficialOwner: createActionFactory(
    "KYC_SUBMIT_BENEFICIAL_OWNER",
    (owner: IKycBeneficialOwner) => ({ owner }),
  ),
  kycUpdateBeneficialOwner: createActionFactory(
    "KYC_UPDATE_BENEFICIAL_OWNER",
    (loadingBeneficialOwner: boolean, id?: string, beneficialOwner?: IKycBeneficialOwner) => ({
      loadingBeneficialOwner,
      id,
      beneficialOwner,
    }),
  ),

  // beneficial owners documents
  kycLoadBeneficialOwnerDocumentList: createActionFactory(
    "KYC_LOAD_BENEFICIAL_OWNER_FILE_LIST",
    (boid: string) => ({ boid }),
  ),

  kycUploadBeneficialOwnerDocument: createActionFactory(
    "KYC_UPLOAD_BENEFICIAL_OWNER_FILE",
    (boid: string, file: File) => ({ boid, file }),
  ),

  kycUpdateBeneficialOwnerDocuments: createActionFactory(
    "KYC_UPDATE_BENEFICIAL_OWNER_FILES_INFO",
    (
      boid: string,
      beneficialOwnerFilesLoading: boolean,
      beneficialOwnerFiles: IKycFileInfo[] = [],
    ) => ({
      boid,
      beneficialOwnerFilesLoading,
      beneficialOwnerFiles,
    }),
  ),

  kycUpdateBeneficialOwnerDocument: createActionFactory(
    "KYC_UPDATE_BENEFICIAL_OWNER_FILE_INFO",
    (boid: string, beneficialOwnerFileUploading: boolean, file?: IKycFileInfo) => ({
      boid,
      beneficialOwnerFileUploading,
      file,
    }),
  ),
  // request
  kycLoadBusinessRequest: createActionFactory(
    "KYC_LOAD_BUSINESS_REQUEST_STATE",
    (inBackground: boolean = false) => ({ inBackground }),
  ),

  kycSubmitBusinessRequest: createActionFactory("KYC_SUBMIT_BUSINESS_REQUEST"),

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

  // id-now
  setIdNowRedirectUrl: createActionFactory(
    "KYC_SET_ID_NOW_REDIRECT_URL",
    (redirectUrl: string) => ({ redirectUrl }),
  ),
};
