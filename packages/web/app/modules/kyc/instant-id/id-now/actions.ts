import { createActionFactory } from "@neufund/shared";

export const kycInstantIdIdNowActions = {
  /*
   * External actions
   */
  startIdNowRequest: createActionFactory("KYC_ID_NOW_START_REQUEST"),

  /*
   * Internal actions
   */
  setIdNowRedirectUrl: createActionFactory(
    "KYC_ID_NOW_SET_REDIRECT_URL",
    (redirectUrl: string) => ({ redirectUrl }),
  ),
};
