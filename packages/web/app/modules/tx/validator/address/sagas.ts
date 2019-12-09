import { all } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { IdentityRegistry } from "../../../../lib/contracts/IdentityRegistry";
import { deserializeClaims } from "../../../kyc/utils";
import { isAddressValid } from "../../../web3/utils";
import { EAdditionalValidationDataNotifications } from "./../reducer";
import { SagaGenerator } from "typed-redux-saga";

export function* txProcessAddressValidations(
  { web3Manager, contractsService }: TGlobalDependencies,
  address: string,
  registeredChecks: EAdditionalValidationDataNotifications[],
): SagaGenerator<EAdditionalValidationDataNotifications[]> {
  if (!isAddressValid(address)) {
    throw new Error(`Invalid ethereum address passed: ${address}`);
  }

  const identityRegistry: IdentityRegistry = contractsService.identityRegistry;

  const { claims, transactionsCount, addressBalance, isSmartContract } = yield all({
    claims: yield identityRegistry.getClaims(address),
    transactionsCount: yield web3Manager.getTransactionCount(address),
    addressBalance: yield web3Manager.getBalance(address),
    isSmartContract: yield web3Manager.isSmartContract(address),
  });

  const deserializedClaims = deserializeClaims(claims);
  const newAddress = transactionsCount === 0;

  let notifications: EAdditionalValidationDataNotifications[] = [];

  // Use only first warning that can be applied
  if (
    registeredChecks.includes(EAdditionalValidationDataNotifications.IS_SMART_CONTRACT) &&
    isSmartContract
  ) {
    notifications.push(EAdditionalValidationDataNotifications.IS_SMART_CONTRACT);
  } else if (
    registeredChecks.includes(EAdditionalValidationDataNotifications.IS_VERIFIED_PLATFORM_USER) &&
    deserializedClaims.isVerified &&
    !deserializedClaims.isAccountFrozen
  ) {
    notifications.push(EAdditionalValidationDataNotifications.IS_VERIFIED_PLATFORM_USER);
  } else if (
    registeredChecks.includes(EAdditionalValidationDataNotifications.IS_NEW_ADDRESS) &&
    newAddress &&
    addressBalance.toString() === "0"
  ) {
    notifications.push(EAdditionalValidationDataNotifications.IS_NEW_ADDRESS);
  } else if (
    registeredChecks.includes(EAdditionalValidationDataNotifications.IS_NEW_ADDRESS_WITH_BALANCE) &&
    newAddress
  ) {
    notifications.push(EAdditionalValidationDataNotifications.IS_NEW_ADDRESS_WITH_BALANCE);
  }
  return notifications;
}
