import BigNumber from "bignumber.js";

import { EKycRequestStatusTranslation } from "../../components/translatedMessages/messages";
import { createMessage, TMessage } from "../../components/translatedMessages/utils";
import { EKycRequestStatus } from "../../lib/api/kyc/KycApi.interfaces";
import { TClaims } from "./types";

export function deserializeClaims(claims: string): TClaims {
  const claimsN = new BigNumber(claims, 16);

  const isVerified = claimsN.mod("2").eq("1");
  const isSophisticatedInvestor = claimsN
    .dividedToIntegerBy("2")
    .mod(2)
    .eq("1");

  const hasBankAccount = claimsN
    .dividedToIntegerBy("4")
    .mod(2)
    .eq("1");

  const isAccountFrozen = claimsN
    .dividedToIntegerBy("8")
    .mod(2)
    .eq("1");

  return {
    isVerified,
    isSophisticatedInvestor,
    hasBankAccount,
    isAccountFrozen,
  };
}

export const kycStatusToTranslationMessage = (status: EKycRequestStatus): TMessage => {
  switch (status) {
    case EKycRequestStatus.REJECTED:
      return createMessage(EKycRequestStatusTranslation.REJECTED);
    case EKycRequestStatus.ACCEPTED:
      return createMessage(EKycRequestStatusTranslation.ACCEPTED);
    case EKycRequestStatus.DRAFT:
      return createMessage(EKycRequestStatusTranslation.DRAFT);
    case EKycRequestStatus.IGNORED:
      return createMessage(EKycRequestStatusTranslation.IGNORED);
    case EKycRequestStatus.OUTSOURCED:
      return createMessage(EKycRequestStatusTranslation.OUTSOURCED);
    case EKycRequestStatus.PENDING:
      return createMessage(EKycRequestStatusTranslation.PENDING);
  }
};
