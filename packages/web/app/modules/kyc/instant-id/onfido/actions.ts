import { createActionFactory } from "@neufund/shared";

export const kycInstantIdOnfidoActions = {
  /*
   * External actions
   */
  startOnfidoRequest: createActionFactory("KYC_ONFIDO_START_REQUEST"),
  stopOnfidoRequest: createActionFactory("KYC_ONFIDO_STOP_REQUEST"),

  /*
   * Internal actions
   */
  startOnfidoRequestError: createActionFactory(
    "KYC_ONFIDO_START_REQUEST_ERROR",
    (error: Error) => ({ error }),
  ),
};
