export enum ENomineeRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ENomineeUpdateRequestStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ENomineeRequestError {
  NONE = "none",
  ISSUER_ID_ERROR = "issuer_id_error",
  REQUEST_EXISTS = "request_exists",
  GENERIC_ERROR = "nominee_request_generic_error",
}

export enum ENomineeFlowError {
  NONE = "none",
  FETCH_DATA_ERROR = "nominee_fetch_data_error",
}

export enum ENomineeTaskStatus {
  NOT_DONE = "not_done",
  DONE = "done",
  ERROR = "error",
}

export enum ERedeemShareCapitalTaskSubstate {
  REDEEM_CAPITAL_INCREASE = "redeemCapitalIncrease",
  WAITING_FOR_ISSUER_TO_SIGN_ISHA = "waitingForIssuerToSignIsha",
}

export enum ENomineeLinkBankAccountStatus {
  NOT_DONE = "not_done",
  DONE = "done",
  ERROR = "error",
}

export enum ENomineeUploadIshaStatus {
  NOT_DONE = "not_done",
  DONE = "done",
  ERROR = "error",
}

export interface INomineeRequestMetadata {
  city: string;
  country: string;
  jurisdiction: string;
  legalForm: string;
  legalFormType: string;
  name: string;
  registrationNumber: string;
  street: string;
  zipCode: string;
}

export interface INomineeRequest {
  state: ENomineeRequestStatus;
  nomineeId: string;
  etoId: string;
  insertedAt: string;
  updatedAt: string;
  metadata: INomineeRequestMetadata;
}

// TODO: Refactor to store separately, nominee-flow module should not be used for issuer
export type TNomineeRequestStorage = { [id: string]: INomineeRequest }; //can be etoId or nomineeId

export enum ENomineeTask {
  NONE = "noTasks",
  ACCOUNT_SETUP = "accountSetup",
  LINK_TO_ISSUER = "linkToIssuer",
  LINK_BANK_ACCOUNT = "linkBankAccount",
}

export enum ENomineeEtoSpecificTask {
  ACCEPT_THA = "acceptTha",
  ACCEPT_RAAA = "acceptRaaa",
  REDEEM_SHARE_CAPITAL = "redeemShareCapital",
  ACCEPT_ISHA = "acceptIsha",
}
