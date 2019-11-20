import BigNumber from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { fork, put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import {
  selectEtherLockedNeumarksDue,
  selectLockedEtherBalance,
  selectLockedEtherUnlockDate,
} from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { txSendSaga } from "../../sender/sagas";
import { ETxSenderType } from "../../types";
import { UserCannotUnlockFunds } from "./errors";
import { selectCanUnlockWallet } from "./selectors";

function* generateUnlockEuroTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const canUnlockWallet = yield select(selectCanUnlockWallet);
  if (!canUnlockWallet) {
    throw new UserCannotUnlockFunds();
  }

  const userAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const etherNeumarksDue = yield select(selectEtherLockedNeumarksDue);

  const txData = contractsService.neumark.rawWeb3Contract.approveAndCall[
    "address,uint256,bytes"
  ].getData(contractsService.etherLock.address, new BigNumber(etherNeumarksDue), "");

  const txInitialDetails = {
    to: contractsService.neumark.address,
    from: userAddress,
    data: txData,
    value: addHexPrefix("0"),
    gasPrice: gasPriceWithOverhead,
  };
  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);
  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };
  return txDetails;
}

function* unlockEtherFundsTransactionGenerator(_: TGlobalDependencies): any {
  const generatedTxDetails: ITxData = yield neuCall(generateUnlockEuroTransaction);
  const etherNeumarksDue = yield select(selectEtherLockedNeumarksDue);
  const lockedEtherBalance: string = yield select(selectLockedEtherBalance);
  const lockedEtherUnlockDate: string = yield select(selectLockedEtherUnlockDate);

  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary<ETxSenderType.UNLOCK_FUNDS>({
      etherNeumarksDue,
      lockedEtherUnlockDate,
      lockedEtherBalance,
    }),
  );
}

function* unlockEtherFunds({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield take("WALLET_SAVE_WALLET_DATA");
    // This saga is generated by entering link we need to wait for the wallet to load
    yield txSendSaga({
      type: ETxSenderType.UNLOCK_FUNDS,
      transactionFlowGenerator: unlockEtherFundsTransactionGenerator,
    });
    logger.info("Unlock Ether Funds successful");
  } catch (e) {
    logger.info("Unlock Ether Funds cancelled", e);
  }
}

export const txUnlockWalletSagas = function*(): Iterator<any> {
  yield fork(neuTakeLatest, actions.txTransactions.startUnlockEtherFunds, unlockEtherFunds);
};
