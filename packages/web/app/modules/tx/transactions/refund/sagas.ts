import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ETOCommitment } from "../../../../lib/contracts/ETOCommitment";
import { ITxData } from "../../../../lib/web3/types";
import { IAppState } from "../../../../store";
import { multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { EthereumAddressWithChecksum } from "../../../../utils/opaque-types/types";
import { actions, TActionFromCreator } from "../../../actions";
import { selectEtoWithCompanyAndContractById } from "../../../eto/selectors";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { selectInvestorTicket } from "../../../investor-portfolio/selectors";
import { IInvestorTicket } from "../../../investor-portfolio/types";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import { selectEtherPriceEur } from "../../../shared/tokenPrice/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { txSendSaga } from "../../sender/sagas";
import { selectTxGasCostEthUlps } from "../../sender/selectors";
import { ETxSenderType } from "../../types";

function* generateGetRefundTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  etoId: string,
): Iterator<any> {
  const userAddress: EthereumAddressWithChecksum = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead: string = yield select(selectStandardGasPriceWithOverHead);

  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);
  const txInput = etoContract.refundTx().getData();

  const txInitialDetails = {
    to: etoContract.address,
    from: userAddress,
    data: txInput,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead: string = yield web3Manager.estimateGasWithOverhead(
    txInitialDetails,
  );

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };

  return txDetails;
}

function* startRefundGenerator(_: TGlobalDependencies, etoId: string): Iterator<any> {
  const generatedTxDetails: ITxData = yield neuCall(generateGetRefundTransaction, etoId);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));

  const etoData = yield select((state: IAppState) =>
    selectEtoWithCompanyAndContractById(state, etoId),
  );
  const investorTicket: IInvestorTicket = yield select((state: IAppState) =>
    selectInvestorTicket(state, etoId),
  );
  const ethPrice: string = yield select(selectEtherPriceEur);
  const costUlps: string = yield select(selectTxGasCostEthUlps);
  const costEurUlps = multiplyBigNumbers([ethPrice, costUlps]);

  yield put(
    actions.txSender.txSenderContinueToSummary<ETxSenderType.INVESTOR_REFUND>({
      etoId,
      costUlps,
      costEurUlps,
      tokenName: etoData.equityTokenName,
      tokenSymbol: etoData.equityTokenSymbol,
      amountEth: investorTicket.amountEth.toString(),
      amountEurUlps: investorTicket.amountEurUlps.toString(),
      companyName: etoData.company.brandName,
    }),
  );
}

function* etoRefundSaga(
  { logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.txTransactions.startInvestorRefund>,
): Iterator<any> {
  const etoId = action.payload.etoId;
  try {
    yield txSendSaga({
      type: ETxSenderType.INVESTOR_REFUND,
      transactionFlowGenerator: startRefundGenerator,
      extraParam: etoId,
    });
    logger.info("User refund successful");
  } catch (e) {
    logger.info("User refund cancelled", e);
  } finally {
    yield put(actions.eto.loadEto(etoId));
  }
}

export const txRefundSagas = function*(): Iterator<any> {
  yield fork(neuTakeLatest, actions.txTransactions.startInvestorRefund, etoRefundSaga);
};
