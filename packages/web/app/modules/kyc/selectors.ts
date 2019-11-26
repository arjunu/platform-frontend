import { createSelector } from "reselect";

import {
  EKycRequestStatus,
  KycBankQuintessenceBankAccount,
} from "../../lib/api/kyc/KycApi.interfaces";
import { IAppState } from "../../store";
import { DeepReadonly } from "../../types";
import { IKycState } from "./reducer";
import { TBankAccount } from "./types";

export const selectKyc = (state: IAppState) => state.kyc;

export const selectKycStatus = createSelector(
  selectKyc,
  kyc => kyc.status,
);

export const selectIsKycProhibitedRegion = createSelector(
  selectKycStatus,
  status => !!status && status.inProhibitedRegion,
);

export const selectKycRequestType = createSelector(
  selectKycStatus,
  status => status && status.type,
);

export const selectIndividualFiles = (state: IAppState) => state.kyc.individualFiles;
export const selectIndividualFilesLoading = (state: IAppState) => state.kyc.individualFilesLoading;

export const selectBusinessFiles = (state: IAppState) => state.kyc.businessFiles;
export const selectLegalRepFiles = (state: IAppState) => state.kyc.legalRepresentativeFiles;

export const selectKycUploadedFiles = (state: IAppState) =>
  selectIndividualFiles(state) || selectBusinessFiles(state) || selectLegalRepFiles(state);

export const selectKycRequestStatus = (state: IAppState): EKycRequestStatus | undefined => {
  const kycStatus = selectKycStatus(state);

  if (kycStatus) {
    return kycStatus.status === EKycRequestStatus.ACCEPTED && !selectIsClaimsVerified(state)
      ? EKycRequestStatus.PENDING
      : kycStatus.status;
  }

  return undefined;
};

export const selectKycInstantIdStatus = createSelector(
  selectKycStatus,
  status => status && status.instantIdStatus,
);

/**
 * In case it's a prohibited region by ip and kyc process was not yet started (DRAFT) returns true.
 */
export const selectIsKycFlowBlockedByRegion = createSelector(
  selectIsKycProhibitedRegion,
  selectKycRequestStatus,
  (isProhibited, status) => isProhibited && status === EKycRequestStatus.DRAFT,
);

export const selectKycIdNowRedirectUrl = (state: IAppState): string | undefined => {
  // if (state.individualRequestState && state.individualRequestState.redirectUrl) {
  //   return state.individualRequestState.redirectUrl;
  // }

  return undefined;
};

export const selectCombinedBeneficialOwnerOwnership = (state: DeepReadonly<IKycState>): number => {
  if (state.beneficialOwners.length === 0) return 0;
  return state.beneficialOwners.reduce(
    (all, owner) => all + (owner.ownership ? owner.ownership : 0),
    0,
  );
};

export const selectKycIsLoading = (state: IAppState): boolean => state.kyc.statusLoading;

export const selectKycIsInitialLoading = createSelector(
  selectKycStatus,
  selectKycIsLoading,
  (status, isLoading) => status === undefined && isLoading,
);

export const selectWidgetError = (state: DeepReadonly<IKycState>): string | undefined =>
  state.statusError;

export const selectIndividualClientName = (state: IAppState) => {
  const data = state.kyc.individualData;

  return data ? [data.firstName, data.lastName].filter(Boolean).join(" ") : undefined;
};

export const selectBusinessClientName = (state: IAppState) =>
  state.kyc.businessData && state.kyc.businessData.name;

export const selectClientName = (state: IAppState) =>
  selectBusinessClientName(state) || selectIndividualClientName(state);

export const selectIndividualClientCountry = ({ kyc }: IAppState) =>
  kyc.individualData && kyc.individualData.country;

export const selectBusinessClientCountry = ({ kyc }: IAppState) =>
  kyc.businessData && kyc.businessData.country;

export const selectClientCountry = (state: IAppState) =>
  selectIndividualClientCountry(state) || selectBusinessClientCountry(state);

export const selectClientJurisdiction = createSelector(
  selectKyc,
  (state: DeepReadonly<IKycState>) =>
    // @SEE https://github.com/Neufund/platform-frontend/issues/2789#issuecomment-489081031
    (state.businessData && state.businessData.jurisdiction) ||
    (state.individualData && state.individualData.country),
);

export const selectIndividualAddress = createSelector(
  selectKyc,
  (state: DeepReadonly<IKycState>) => {
    if (state.individualData) {
      return {
        street: state.individualData.street,
        city: state.individualData.city,
        zipCode: state.individualData.zipCode,
        country: state.individualData.country,
        usState: state.individualData.usState,
      };
    }

    return undefined;
  },
);

export const selectClaims = (state: IAppState) => state.kyc.claims;

export const selectIsClaimsVerified = createSelector(
  selectClaims,
  claims => {
    if (claims) {
      return claims.isVerified;
    }

    return false;
  },
);

export const selectIsAccountFrozen = createSelector(
  selectClaims,
  claims => {
    if (claims) {
      return claims.isAccountFrozen;
    }

    return false;
  },
);

export const selectIsUserVerifiedOnBlockchain = (state: IAppState) =>
  selectIsClaimsVerified(state) && !selectIsAccountFrozen(state);

export const selectBankAccount = (state: IAppState): DeepReadonly<TBankAccount> | undefined =>
  state.kyc.bankAccount;

export const selectIsBankAccountLoading = (state: IAppState): boolean =>
  state.kyc.bankAccount === undefined;

export const selectQuintessenceBankAccount = (
  state: IAppState,
): DeepReadonly<KycBankQuintessenceBankAccount> | undefined => state.kyc.quintessenceBankAccount;
