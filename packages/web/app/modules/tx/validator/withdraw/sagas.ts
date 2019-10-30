import BigNumber from "bignumber.js";
import { cloneDeep } from "lodash";
import { all, put, select } from "redux-saga/effects";

import { IWindowWithData } from "../../../../../test/helperTypes";
import { Q18 } from "../../../../config/constants";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { IdentityRegistry } from "../../../../lib/contracts/IdentityRegistry";
import { ITxData } from "../../../../lib/web3/types";
import { NotEnoughEtherForGasError, UserHasNoFundsError } from "../../../../lib/web3/Web3Adapter";
import {
  addBigNumbers,
  compareBigNumbers,
  multiplyBigNumbers,
  subtractBigNumbers,
} from "../../../../utils/BigNumberUtils";
import { convertToUlps } from "../../../../utils/NumberUtils";
import { actions } from "../../../actions";
import { deserializeClaims } from "../../../kyc/utils";
import { neuCall } from "../../../sagasUtils";
import { selectEtherPriceEur } from "../../../shared/tokenPrice/selectors";
import { selectEtherBalance, selectEtherBalanceAsBigNumber } from "../../../wallet/selectors";
import { generateRandomEthereumAddress, isAddressValid } from "../../../web3/utils";
import { generateEthWithdrawTransaction } from "../../transactions/withdraw/sagas";
import { ETxSenderType, IWithdrawDraftType } from "../../types";
import { MINIMUM_ETH_RESERVE_GAS_UNITS } from "../../utils";
import { EAdditionalValidationDataNotifications, EValidationState } from "../reducer";
import { validateGas } from "../sagas";
import { SmartContractDoesNotAcceptEtherError } from "./errors";
import { isValidFormNumber } from "./utils";

const shouldPassSmartContractAcceptEtherTest = !!(
  process.env.NF_CYPRESS_RUN === "1" && (window as IWindowWithData).disableNotAcceptingEtherCheck
);

export function* txValidateWithdraw(userInput: IWithdrawDraftType): Iterator<any> {
  // TODO: MOVE TO GENERAL VALIDATOR SAGA ONCE ALL TRANSACTION TYPES ARE SET
  // This is done here only for backwards compatibility with the other transaction types
  yield put(actions.txValidator.setValidationState(EValidationState.VALIDATING));

  yield put(actions.txSender.txSenderClearTransactionData());
  const euroPrice = yield select(selectEtherPriceEur);

  const modifiedUserInput = cloneDeep(userInput);
  const isValidAddress = isAddressValid(userInput.to);
  const isValueValid = isValidFormNumber(userInput.value);

  // Sanity checks
  if (!isValidAddress) {
    modifiedUserInput.to = generateRandomEthereumAddress();
  }

  if (!isValueValid) {
    modifiedUserInput.value = "0";
  }

  try {
    if (!shouldPassSmartContractAcceptEtherTest) {
      yield neuCall(isAddressValidAcceptsEther, modifiedUserInput.to, modifiedUserInput.value);
    }

    const generatedTxDetails = yield neuCall(generateEthWithdrawTransaction, {
      to: modifiedUserInput.to,
      valueUlps: new BigNumber(modifiedUserInput.value).mul(Q18).toString(),
    });

    yield validateGas(generatedTxDetails);

    const addressNotifications: EAdditionalValidationDataNotifications[] =
      isAddressValid && !shouldPassSmartContractAcceptEtherTest
        ? yield neuCall(txProcessAddressValidations, modifiedUserInput.to)
        : [];

    const walletNotifications: EAdditionalValidationDataNotifications[] = yield validateWalletAlmostEmpty(
      generatedTxDetails,
    );

    yield put(
      actions.txValidator.setValidationNotifications([
        ...walletNotifications,
        ...addressNotifications,
      ]),
    );

    const valueUlps = convertToUlps(modifiedUserInput.value);
    const valueFromUserEuro = multiplyBigNumbers([euroPrice, valueUlps]);
    const transactionCost = multiplyBigNumbers([
      generatedTxDetails.gasPrice,
      generatedTxDetails.gas,
    ]);
    const totalValue = addBigNumbers([valueUlps, transactionCost]);

    yield put(
      actions.txUserFlowWithdraw.setTxUserFlowData({
        inputValue: valueUlps,
        inputValueEuro: valueFromUserEuro,
        inputTo: isAddressValid ? userInput.to : "0x",
        totalValue: totalValue,
        totalValueEur: multiplyBigNumbers([totalValue, euroPrice]),
        transactionCost,
        transactionCostEur: multiplyBigNumbers([transactionCost, euroPrice]),
      }),
    );
    if (isAddressValid && isValueValid) {
      yield put(actions.txSender.setTransactionData(generatedTxDetails));
      yield put(actions.txValidator.setValidationState(EValidationState.VALIDATION_OK));
    } else {
      yield put(actions.txValidator.setValidationState(EValidationState.PARTIALLY_OK));
    }
  } catch (error) {
    if (error instanceof NotEnoughEtherForGasError) {
      yield put(actions.txValidator.setValidationState(EValidationState.NOT_ENOUGH_ETHER_FOR_GAS));
    } else if (error instanceof UserHasNoFundsError) {
      // UserHasNoFundsError has its own condition check incase the error should be different in the future
      yield put(actions.txValidator.setValidationState(EValidationState.NOT_ENOUGH_ETHER_FOR_GAS));
    } else if (error instanceof SmartContractDoesNotAcceptEtherError) {
      if (shouldPassSmartContractAcceptEtherTest) {
        // ONLY FOR TESTING PURPOSE
        yield put(actions.txValidator.setValidationState(EValidationState.VALIDATION_OK));
        return;
      } else {
        yield put(actions.txValidator.setValidationState(EValidationState.IS_NOT_ACCEPTING_ETHER));
      }
    } else {
      throw error;
    }
    yield put(actions.txValidator.setValidationNotifications([]));
    // This will force the user to return from the summary screen if the final validation fails
    yield put(actions.txSender.txSenderChange(ETxSenderType.WITHDRAW));
  }
}

export function* isAddressValidAcceptsEther(
  { web3Manager }: TGlobalDependencies,
  to: string,
  value: string,
): Iterator<any> {
  try {
    const etherBalance: BigNumber = yield select(selectEtherBalanceAsBigNumber);
    if (etherBalance.isZero()) {
      throw new UserHasNoFundsError();
    }

    // If user inputs no value assume 1 wei as fallback value
    const calculatedValueFromUserInput = value === "0" ? "1" : convertToUlps(value);
    yield web3Manager.estimateGas({ to, value: calculatedValueFromUserInput });
  } catch (e) {
    if (e instanceof UserHasNoFundsError) {
      throw e;
    } else {
      throw new SmartContractDoesNotAcceptEtherError();
    }
  }
}

export function* txProcessAddressValidations(
  { web3Manager, contractsService }: TGlobalDependencies,
  address: string,
): Iterator<any> {
  if (!isAddressValid(address)) {
    throw new Error(`Invalid ethereum address passed: ${address}`);
  }

  const identityRegistry: IdentityRegistry = contractsService.identityRegistry;

  const { claims, transactionsCount, addressBalance, isSmartContract } = yield all({
    claims: yield identityRegistry.getClaims(address),
    transactionsCount: yield web3Manager.internalWeb3Adapter.getTransactionCount(address),
    addressBalance: yield web3Manager.internalWeb3Adapter.getBalance(address),
    isSmartContract: yield web3Manager.internalWeb3Adapter.isSmartContract(address),
  });

  const deserializedClaims = deserializeClaims(claims);
  const newAddress = transactionsCount === 0;

  let notifications: EAdditionalValidationDataNotifications[] = [];

  // Use only first warning that can be applied
  if (isSmartContract) {
    notifications.push(EAdditionalValidationDataNotifications.IS_SMART_CONTRACT);
  } else if (deserializedClaims.isVerified && !deserializedClaims.isAccountFrozen) {
    notifications.push(EAdditionalValidationDataNotifications.IS_VERIFIED_PLATFORM_USER);
  } else if (newAddress && addressBalance.toString() === "0") {
    notifications.push(EAdditionalValidationDataNotifications.IS_NEW_ADDRESS);
  } else if (newAddress) {
    notifications.push(EAdditionalValidationDataNotifications.IS_NEW_ADDRESS_WITH_BALANCE);
  }
  return notifications;
}

export function* validateWalletAlmostEmpty({ gasPrice, gas, value }: ITxData): Iterator<any> {
  const allEther = yield select(selectEtherBalance);

  let warnings: EAdditionalValidationDataNotifications[] = [];

  const requiredGasReserve = multiplyBigNumbers([gasPrice, MINIMUM_ETH_RESERVE_GAS_UNITS]);
  const maximumCost = multiplyBigNumbers([gasPrice, gas]);
  const maximumAvailableEther = subtractBigNumbers([allEther, maximumCost]);

  if (compareBigNumbers(addBigNumbers([value, requiredGasReserve]), maximumAvailableEther) >= 0) {
    warnings.push(EAdditionalValidationDataNotifications.WILL_EMPTY_WALLET);
  }

  return warnings;
}
