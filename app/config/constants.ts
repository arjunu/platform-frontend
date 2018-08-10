import BigNumber from "bignumber.js";

export const LIGHT_WALLET_PASSWORD_CACHE_TIME = 1000 * 60 * 10;

/**
 * We assume common digits for all currencies on our platform.
 */
export const MONEY_DECIMALS = 18;

/**
 * Constants for permissions
 */
export const SUBMIT_KYC_PERMISSION = "submit-kyc";
export const CHANGE_EMAIL_PERMISSION = "change-email";
export const SUBMIT_ETO_PERMISSION = "submit-eto-listing";
export const UPLOAD_IMMUTABLE_DOCUMENT = "upload-immutable-document";

/**
 *  Constants for JWT tokens
 */
export const MAX_EXPIRATION_DIFF_MINUTES = 10;

/**
 * Useful for money related calculations
 */
export const Q18 = new BigNumber(10).pow(18);
