import BigNumber from "bignumber.js";
import { fork, put, select, take } from "redux-saga/effects";

import { IWindowWithData } from "../../../../../test/helperTypes";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/types";
import { DEFAULT_UPPER_GAS_LIMIT } from "../../../../lib/web3/Web3Manager/Web3Manager";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuTakeLatest } from "../../../sagasUtils";
import { selectEtherTokenBalanceAsBigNumber } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { isAddressValid } from "../../../web3/utils";
import { txSendSaga } from "../../sender/sagas";
import { ETxSenderType } from "../../types";
import { TxUserFlowDetails, TxUserFlowInputData } from "../../user-flow/withdraw/reducer";
import { selectUserFlowTxDetails, selectUserFlowTxInput } from "../../user-flow/withdraw/selectors";
import { calculateGasLimitWithOverhead, EMPTY_DATA } from "../../utils";
import { WrongValuesError } from "../errors";
import { TWithdrawAdditionalData } from "./types";

export interface IWithdrawTxGenerator {
  to: string;
  valueUlps: string;
}

export function* generateEthWithdrawTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  { to, valueUlps }: IWithdrawTxGenerator,
): any {
  // Sanity checks
  if (!to || !isAddressValid(to)) throw new WrongValuesError();
  if (
    !valueUlps ||
    (new BigNumber(valueUlps).isNegative() && !new BigNumber(valueUlps).isInteger())
  )
    throw new WrongValuesError();
  const valueUlpsAsBigN = new BigNumber(valueUlps);

  const etherTokenBalance: BigNumber = yield select(selectEtherTokenBalanceAsBigNumber);
  const from: string = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);

  if (etherTokenBalance.isZero()) {
    // transaction can be fully covered ether balance
    const txDetails: Partial<ITxData> = {
      to,
      from,
      data: EMPTY_DATA,
      value: valueUlps,
      gasPrice: gasPriceWithOverhead,
    };

    // TODO: Think about combining both test flows
    if (process.env.NF_CYPRESS_RUN === "1") {
      const {
        disableNotAcceptingEtherCheck,
        forceLowGas,
        forceStandardGas,
      } = window as IWindowWithData;
      if (disableNotAcceptingEtherCheck) {
        // For the specific test cases return txDetails directly without estimating gas
        return txDetails;
      } else if (forceLowGas) {
        // Return really low gas
        return { ...txDetails, gas: 1000 };
      } else if (forceStandardGas) {
        // Return really low gas
        return { ...txDetails, gas: 21000 };
      }
    }

    const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txDetails);

    // There is Smart Contract Attack Vector that extreme high gas amounts
    const gas =
      estimatedGasWithOverhead > DEFAULT_UPPER_GAS_LIMIT
        ? DEFAULT_UPPER_GAS_LIMIT
        : estimatedGasWithOverhead;

    return {
      ...txDetails,
      gas,
    };
  } else {
    // transaction can be fully covered by etherTokens
    const txInput = contractsService.etherToken.withdrawAndSendTx(to, valueUlpsAsBigN).getData();

    const difference = valueUlpsAsBigN.sub(etherTokenBalance);

    const txDetails: Partial<ITxData> = {
      to: contractsService.etherToken.address,
      from,
      data: txInput,
      value: difference.comparedTo("0") > 0 ? difference.toString() : "0",
      gasPrice: gasPriceWithOverhead,
    };

    if (process.env.NF_CYPRESS_RUN === "1") {
      const {
        disableNotAcceptingEtherCheck,
        forceLowGas,
        forceStandardGas,
      } = window as IWindowWithData;
      if (disableNotAcceptingEtherCheck) {
        // For the specific test cases return txDetails directly without estimating gas
        return {
          ...txDetails,
          gas: calculateGasLimitWithOverhead(DEFAULT_UPPER_GAS_LIMIT.toString()),
        };
      } else if (forceLowGas) {
        // Return really low gas
        return { ...txDetails, gas: calculateGasLimitWithOverhead("1000") };
      } else if (forceStandardGas) {
        // Return really low gas
        return { ...txDetails, gas: 21000 };
      }
    }

    const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txDetails);
    return { ...txDetails, gas: estimatedGasWithOverhead };
  }
}

function* ethWithdrawFlow(_: TGlobalDependencies): Iterator<any> {
  yield take(actions.txSender.txSenderAcceptDraft);

  const txUserFlowData: TxUserFlowDetails = yield select(selectUserFlowTxDetails);
  const txUserFlowInput: TxUserFlowInputData = yield select(selectUserFlowTxInput);

  // Internally we represent eth withdraw in two different modes (normal ether withdrawal and ether token withdrawal)
  // in case of ether token withdrawal `to` points to contract address and `value` is empty

  const additionalData: TWithdrawAdditionalData = {
    to: txUserFlowInput.to,
    amount: txUserFlowData.inputValue,
    amountEur: txUserFlowData.inputValueEuro,
    total: txUserFlowData.totalValue,
    totalEur: txUserFlowData.totalValueEur,
  };

  yield put(actions.txSender.txSenderContinueToSummary<ETxSenderType.WITHDRAW>(additionalData));
}

function* withdrawSaga({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield txSendSaga({
      type: ETxSenderType.WITHDRAW,
      transactionFlowGenerator: ethWithdrawFlow,
    });
    logger.info("Withdrawing successful");
  } catch (e) {
    logger.info("Withdrawing cancelled", e);
  }
}

export const txWithdrawSagas = function*(): Iterator<any> {
  yield fork(neuTakeLatest, "TRANSACTIONS_START_WITHDRAW_ETH", withdrawSaga);
};
