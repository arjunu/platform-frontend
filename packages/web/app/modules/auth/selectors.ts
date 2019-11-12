import { createSelector } from "reselect";

import { EKycRequestStatus } from "../../lib/api/kyc/KycApi.interfaces";
import { EUserType, IUser } from "../../lib/api/users/interfaces";
import { IAppState } from "../../store";
import { ECountries } from "../../utils/enums/countriesEnum";
import { EthereumAddressWithChecksum } from "../../utils/opaque-types/types";
import {
  selectClientCountry,
  selectIsUserVerifiedOnBlockchain,
  selectKycRequestStatus,
} from "../kyc/selectors";
import { selectIsLightWallet } from "../web3/selectors";
import { EAuthStatus, IAuthState } from "./reducer";

export const selectIsAuthorized = (state: IAuthState): boolean =>
  !!(state.jwt && state.user && state.status === EAuthStatus.AUTHORIZED);

export const selectJwt = (state: IAppState): string | undefined => state.auth.jwt;

export const selectUserType = (state: IAppState): EUserType | undefined =>
  state.auth.user && state.auth.user.type;

export const selectUserEmail = (state: IAuthState): string | undefined =>
  state.user && (state.user.unverifiedEmail || state.user.verifiedEmail);

export const selectVerifiedUserEmail = (state: IAuthState): string | undefined =>
  state.user && state.user.verifiedEmail;

export const selectUnverifiedUserEmail = (state: IAuthState): string | undefined =>
  state.user && state.user.unverifiedEmail;

export const selectUser = (state: IAuthState): IUser | undefined => state.user;

export const selectUserId = (state: IAppState): EthereumAddressWithChecksum | undefined =>
  state.auth.user && state.auth.user.userId;

export const selectBackupCodesVerified = (state: IAppState): boolean =>
  !!(state.auth.user && state.auth.user.backupCodesVerified) || !selectIsLightWallet(state.web3);

export const selectIsUserEmailVerified = (state: IAuthState): boolean =>
  !!state.user && !!state.user.verifiedEmail;

export const selectIsThereUnverifiedEmail = (state: IAuthState): boolean =>
  !!state.user && !!state.user.unverifiedEmail;

export const selectDoesEmailExist = (state: IAuthState): boolean =>
  selectIsThereUnverifiedEmail(state) || selectIsUserEmailVerified(state);

/**
 * Check if user has verified email and KYC
 */
export const selectIsUserVerified = (state: IAppState): boolean =>
  selectIsUserEmailVerified(state.auth) &&
  selectKycRequestStatus(state) === EKycRequestStatus.ACCEPTED;

/**
 * Check if user is verified by API and Contract
 */
export const selectIsUserFullyVerified = (state: IAppState): boolean =>
  selectIsUserVerified(state) && selectIsUserVerifiedOnBlockchain(state);

export const selectIsInvestor = (state: IAppState): boolean =>
  selectUserType(state) === EUserType.INVESTOR;

export const selectIsUSInvestor = (state: IAppState): boolean => {
  const isInvestor = selectIsInvestor(state);
  const country = selectClientCountry(state);

  return isInvestor && country === ECountries.UNITED_STATES;
};

export const selectIsIssuer = (state: IAppState): boolean =>
  selectUserType(state) === EUserType.ISSUER;

export const selectIsVerifiedInvestor = createSelector(
  selectIsInvestor,
  selectIsUserVerified,
  (isInvestor, isUserVerified) => isInvestor && isUserVerified,
);

// TOS Related Selectors

export const selectIsAgreementAccepted = (state: IAppState): boolean =>
  Boolean(state.auth.user && state.auth.user.latestAcceptedTosIpfs);

export const selectCurrentAgreementHash = (state: IAppState): string | undefined =>
  state.auth.currentAgreementHash;
