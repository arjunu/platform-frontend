import BigNumber from "bignumber.js";
import { filter, findIndex, isNil, omitBy } from "lodash";

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

export function appendIfExists<T>(array: ReadonlyArray<T>, item: T | undefined): ReadonlyArray<T> {
  if (!array) array = [];
  if (item) return [...array, item];
  return array;
}

export function updateArrayItem<T extends { id?: string }>(
  array: ReadonlyArray<T>,
  id?: string,
  item?: T,
): ReadonlyArray<T> {
  if (!id) return array; // no changes
  if (id && !item) return filter(array, i => i.id !== id); // delete item
  if (id && item) {
    const index = findIndex(array, i => i.id === id);
    if (index === -1) return [...array, item]; // append

    return [...array.slice(0, index), item, ...array.slice(index + 1)];
  }
  return array;
}

export function omitUndefined<T>(obj: T): { [P in keyof T]?: T[P] } {
  return omitBy(obj, isNil) as any;
}
