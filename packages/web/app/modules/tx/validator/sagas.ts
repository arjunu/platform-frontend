import BigNumber from "bignumber.js";
import { fork, put, select } from "redux-saga/effects";

import { ETxValidationMessages } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { ITxData } from "../../../lib/web3/types";
import { NotEnoughEtherForGasError } from "../../../lib/web3/Web3Adapter";
import { IAppState } from "../../../store";
import {
  addBigNumbers,
  compareBigNumbers,
  multiplyBigNumbers,
  subtractBigNumbers,
} from "../../../utils/BigNumberUtils";
import { actions, TAction } from "../../actions";
import { neuCall, neuTakeLatestUntil } from "../../sagasUtils";
import { selectEtherBalance } from "../../wallet/selectors";
import { selectWalletType } from "../../web3/selectors";
import { generateInvestmentTransaction } from "../transactions/investment/sagas";
import { selectMaximumInvestment } from "../transactions/investment/selectors";
import { ETxSenderType } from "../types";
import { STIPEND_ELIGIBLE_WALLETS } from "./../../../lib/web3/constants";
import { isGaslessTxEnabled } from "./../../../utils/isGaslessTxEnabled";
import { EValidationState } from "./reducer";
import { selectInvestmentFLow } from "./selectors";
import { txValidateWithdraw } from "./withdraw/sagas";

export function* txValidateInvestment(): Iterator<any> {
  try {
    const investFlow = yield select(selectInvestmentFLow);
    const investAmountUlps = yield select(selectMaximumInvestment);

    const generatedTxDetails = yield neuCall(generateInvestmentTransaction, {
      investmentType: investFlow.investmentType,
      etoId: investFlow.etoId,
      investAmountUlps: new BigNumber(investAmountUlps),
    });

    yield neuCall(validateGas, generatedTxDetails);

    yield put(actions.txValidator.setValidationState(EValidationState.VALIDATION_OK));
    return generatedTxDetails;
  } catch (error) {
    if (error instanceof NotEnoughEtherForGasError) {
      yield put(actions.txValidator.setValidationState(EValidationState.NOT_ENOUGH_ETHER_FOR_GAS));
    } else {
      throw error;
    }
  }
}

export function* txValidateSaga(
  { logger, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== actions.txValidator.validateDraft.getType()) return;

  try {
    let validationGenerator: any;
    switch (action.payload.type) {
      case ETxSenderType.WITHDRAW:
        validationGenerator = txValidateWithdraw(action.payload);
        break;
      case ETxSenderType.INVEST:
        validationGenerator = txValidateInvestment();
        break;
    }

    const txDetails = yield validationGenerator;
    return txDetails;
  } catch (e) {
    logger.error("Something was wrong during TX validation", e);
    yield notificationCenter.error(
      createMessage(ETxValidationMessages.TX_VALIDATION_UNKNOWN_ERROR),
    );
    // In case of unknown error break the flow and hide modal
    yield put(actions.txSender.txSenderHideModal());
  }
}

export function* validateGas({ apiUserService }: TGlobalDependencies, txDetails: ITxData): any {
  const maxEtherUlps = yield select(selectEtherBalance);

  const costUlps = multiplyBigNumbers([txDetails.gasPrice, txDetails.gas]);
  const valueUlps = subtractBigNumbers([maxEtherUlps, costUlps]);

  if (compareBigNumbers(txDetails.value, valueUlps) > 0) {
    const walletType = yield select((state: IAppState) => selectWalletType(state.web3));
    if (isGaslessTxEnabled && STIPEND_ELIGIBLE_WALLETS.includes(walletType)) {
      // @SEE https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2015.md
      // @SEE https://github.com/MetaMask/metamask-extension/issues/5101
      const { gasStipend } = yield apiUserService.getGasStipend(txDetails);
      const etherUlpsWithStipend = addBigNumbers([gasStipend, maxEtherUlps]);
      const valueUlpsWithStipend = subtractBigNumbers([etherUlpsWithStipend, costUlps]);
      if (compareBigNumbers(txDetails.value, valueUlpsWithStipend) > 0) {
        throw new NotEnoughEtherForGasError("Not enough Ether to pay the Gas for this transaction");
      }
    } else {
      throw new NotEnoughEtherForGasError("Not enough Ether to pay the Gas for this transaction");
    }
  }
}

export const txValidatorSagasWatcher = function*(): Iterator<any> {
  yield fork(
    neuTakeLatestUntil,
    "TX_SENDER_VALIDATE_DRAFT",
    "TX_SENDER_HIDE_MODAL",
    txValidateSaga,
  );
};
