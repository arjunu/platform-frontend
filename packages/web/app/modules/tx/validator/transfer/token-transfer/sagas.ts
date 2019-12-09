import BigNumber from "bignumber.js";
import { put } from "redux-saga/effects";
import { select, call, SagaGenerator } from "typed-redux-saga";

import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { IERC223Token } from "../../../../../lib/contracts/IERC223Token";
import { compareBigNumbers, multiplyBigNumbers } from "../../../../../utils/BigNumberUtils";
import { convertToUlps } from "../../../../../utils/NumberUtils";
import { actions } from "../../../../actions";
import { neuCall } from "../../../../sagasUtils";
import { selectEtherPriceEur } from "../../../../shared/tokenPrice/selectors";
import { selectEthereumAddressWithChecksum } from "../../../../web3/selectors";
import { generateTokenWithdrawTransaction } from "../../../transactions/token-transfer/sagas";
import { ITokenTransferDraftType } from "../../../types";
import { EAdditionalValidationDataNotifications, EValidationState } from "../../reducer";
import {
  mapErrorToTransferTxError,
  prepareTransferValidation,
  runInitialValidations,
} from "../sagas";
import { ITxData } from "./../../../../../lib/web3/types";
import { EthereumAddress } from "./../../../../../utils/opaque-types/types";
import { WrongValuesError } from "./../../../transactions/errors";
import { selectUserFlowTokenAddress } from "./../../../user-flow/transfer/selectors";
import { UserHasNotEnoughTokensError } from "./errors";

function* validateUserHasEnoughTokens(
  { contractsService }: TGlobalDependencies,
  tokenAddress: EthereumAddress,
  value: string,
): Generator<any, any, any> {
  const from = yield* select(selectEthereumAddressWithChecksum);
  const contractInstance = yield* call(contractsService.getERC223, tokenAddress);
  const userTokenBalance = yield* call(contractInstance.balanceOf, from);

  if (userTokenBalance.isZero() || compareBigNumbers(value, userTokenBalance) > 0) {
    throw new UserHasNotEnoughTokensError();
  }
}

function* transferTokenValueToUlps(
  { contractsService }: TGlobalDependencies,
  tokenAddress: EthereumAddress,
  value: string,
): SagaGenerator<string> {
  const contractInstance = yield* call(contractsService.getERC223, tokenAddress);
  const tokenDecimals = yield* call(() => contractInstance.decimals);
  return convertToUlps(value, tokenDecimals.toNumber());
}

export function* txValidateTokenTransfer(
  userInput: ITokenTransferDraftType,
): Generator<any, any, any> {
  try {
    const tokenAddress = yield* select(selectUserFlowTokenAddress);
    if (tokenAddress === "") throw new WrongValuesError();
    const {
      modifiedUserInput,
      isValidAddress,
      isValueValid,
    }: any = yield prepareTransferValidation(userInput);

    const valueUlps = yield* neuCall(
      transferTokenValueToUlps,
      tokenAddress,
      modifiedUserInput.value,
    );

    yield neuCall(validateUserHasEnoughTokens, tokenAddress, valueUlps);

    const generatedTxDetails = yield* neuCall(generateTokenWithdrawTransaction, {
      tokenAddress,
      to: modifiedUserInput.to,
      valueUlps,
    });

    yield runInitialValidations(
      generatedTxDetails,
      [
        EAdditionalValidationDataNotifications.IS_NEW_ADDRESS_WITH_BALANCE,
        EAdditionalValidationDataNotifications.IS_SMART_CONTRACT,
        EAdditionalValidationDataNotifications.IS_VERIFIED_PLATFORM_USER,
        EAdditionalValidationDataNotifications.WILL_EMPTY_WALLET,
      ],
      isValidAddress && modifiedUserInput.to,
    );

    const transactionCost = multiplyBigNumbers([
      generatedTxDetails.gasPrice,
      generatedTxDetails.gas,
    ]);

    const euroPrice = yield* select(selectEtherPriceEur);

    yield put(
      actions.txUserFlowTransfer.setTxUserFlowData({
        inputValue: valueUlps,
        inputTo: isValidAddress ? userInput.to : "0x",
        transactionCost,
        transactionCostEur: multiplyBigNumbers([transactionCost, euroPrice]),
        inputValueEuro: "0",
        totalValueEur: "0",
        totalValue: transactionCost,
      }),
    );
    if (isValidAddress && isValueValid) {
      yield put(actions.txSender.setTransactionData(generatedTxDetails));
      yield put(actions.txValidator.setValidationState(EValidationState.VALIDATION_OK));
    } else {
      yield put(actions.txValidator.setValidationState(EValidationState.PARTIALLY_OK));
    }
  } catch (error) {
    yield mapErrorToTransferTxError(error);
  }
}
