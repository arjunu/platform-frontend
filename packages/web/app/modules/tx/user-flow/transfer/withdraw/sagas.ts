import BigNumber from "bignumber.js";
import { fork, put, select } from "redux-saga/effects";

import { Q18 } from "../../../../../config/constants";
import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { multiplyBigNumbers, subtractBigNumbers } from "../../../../../utils/BigNumberUtils";
import { actions, TActionFromCreator } from "../../../../actions";
import { neuCall, neuDebounce } from "../../../../sagasUtils";
import { selectLiquidEtherBalance } from "../../../../wallet/selectors";
import { generateRandomEthereumAddress, isAddressValid } from "../../../../web3/utils";
import { generateEthWithdrawTransaction } from "../../../transactions/withdraw/sagas";
import { ETxSenderType } from "../../../types";
import { SmartContractDoesNotAcceptEtherError } from "../../../validator/transfer/withdraw/errors";
import { isAddressValidAcceptsEther } from "../../../validator/transfer/withdraw/sagas";
import { toFormValue } from "../utils";
import { ITxData } from "./../../../../../lib/web3/types";

export function* getMaxWithdrawAmount(to: string | undefined): Iterator<any> {
  const maxEtherUlps: string = yield select(selectLiquidEtherBalance);

  const txDetails: ITxData = yield neuCall(generateEthWithdrawTransaction, {
    to: to || generateRandomEthereumAddress(),
    valueUlps: maxEtherUlps,
  });

  const costUlps = multiplyBigNumbers([txDetails.gasPrice, txDetails.gas]);
  const valueUlps = subtractBigNumbers([maxEtherUlps, costUlps]);

  const maximumAvailableEther = new BigNumber(valueUlps).div(Q18).toString();
  return maximumAvailableEther;
}

export function* detectMaxWithdraw(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.txUserFlowWithdraw.runUserFlowOperations>,
): Iterator<any> {
  // Add case where address is undefined
  // Add case where value is undefined
  const { to, value } = action.payload;

  let modifiedValue = value;

  const maxAvailEther = yield select(selectLiquidEtherBalance);
  const fixedEther = toFormValue(maxAvailEther);

  const modifiedTo = isAddressValid(to) ? to : generateRandomEthereumAddress();

  if (fixedEther === value) {
    try {
      yield neuCall(isAddressValidAcceptsEther, modifiedTo, modifiedValue);
      modifiedValue = yield getMaxWithdrawAmount(modifiedTo);
    } catch (error) {
      if (error instanceof SmartContractDoesNotAcceptEtherError) {
        modifiedValue = yield getMaxWithdrawAmount(generateRandomEthereumAddress());
      }
    }
  }
  yield put(
    actions.txValidator.validateDraft({ to, value: modifiedValue, type: ETxSenderType.WITHDRAW }),
  );
  yield put(
    actions.txUserFlowTransfer.setTxUserFlowInputData({
      to,
      value,
    }),
  );
}

export const txWithdrawUserFlowSagasWatcher = function*(): Iterator<any> {
  yield fork(neuDebounce, 300, actions.txUserFlowWithdraw.runUserFlowOperations, detectMaxWithdraw);
};
