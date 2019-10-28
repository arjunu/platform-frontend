import { fork, put, select } from "redux-saga/effects";

import { ipfsLinkFromHash } from "../../../../components/documents/utils";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ETOCommitment } from "../../../../lib/contracts/ETOCommitment";
import { ITxData } from "../../../../lib/web3/types";
import { IAppState } from "../../../../store";
import { EthereumAddressWithChecksum } from "../../../../utils/opaque-types/types";
import { actions, TActionFromCreator } from "../../../actions";
import { etoFlowActions } from "../../../eto-flow/actions";
import {
  selectIsNewPreEtoStartDateValid,
  selectIssuerEto,
  selectNewPreEtoStartDate,
  selectPreEtoStartDate,
} from "../../../eto-flow/selectors";
import { TEtoWithCompanyAndContract } from "../../../eto/types";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { txSendSaga } from "../../sender/sagas";
import { ETxSenderType } from "../../types";

function* generateSetStartDateTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const userAddress = selectEthereumAddressWithChecksum(state);
  const gasPriceWithOverhead = selectStandardGasPriceWithOverHead(state);
  const eto = selectIssuerEto(state);

  if (!eto || !selectIsNewPreEtoStartDateValid(state)) return;

  const startDate = selectPreEtoStartDate(state)!;
  const contract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
  const terms = yield contract.etoTerms;
  const token = yield contract.equityToken;
  const time = Math.round(startDate.getTime() / 1000);
  // timestamp needs to be set in seconds

  const txData = contract.setStartDateTx(terms, token, time).getData();

  const txInitialDetails = {
    to: contract.address,
    from: userAddress,
    data: txData,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };

  return txDetails;
}

type TExtraParams = { eto: TEtoWithCompanyAndContract; agreementHash: string };

function* generateSignInvestmentAgreementTx(
  { contractsService, web3Manager }: TGlobalDependencies,
  extraParam: TExtraParams,
): any {
  const { eto, agreementHash } = extraParam;
  const state: IAppState = yield select();

  if (eto && agreementHash) {
    const userAddress: EthereumAddressWithChecksum = yield selectEthereumAddressWithChecksum(state);
    const gasPriceWithOverhead: string = yield selectStandardGasPriceWithOverHead(state);

    const contract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
    const txData: string = yield contract
      .companySignsInvestmentAgreementTx(ipfsLinkFromHash(agreementHash))
      .getData();

    const txInitialDetails = {
      to: contract.address,
      from: userAddress,
      data: txData,
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
  } else {
    throw new Error("cannot generate transaction, etoId or agreementUrl missing");
  }
}

function* etoSetDateGenerator(_: TGlobalDependencies): any {
  const generatedTxDetails = yield neuCall(generateSetStartDateTransaction);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));

  const newStartDate: Date = yield select(selectNewPreEtoStartDate);

  yield put(
    actions.txSender.txSenderContinueToSummary<ETxSenderType.ETO_SET_DATE>({
      newStartDate: newStartDate.getTime(),
    }),
  );
}

function* etoSignInvestmentAgreementGenerator(
  _: TGlobalDependencies,
  extraParam: TExtraParams,
): any {
  const generatedTxDetails = yield neuCall(generateSignInvestmentAgreementTx, extraParam);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary<ETxSenderType.SIGN_INVESTMENT_AGREEMENT>(undefined),
  );
}

function* etoSetDateSaga({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield put(actions.etoFlow.setEtoDateStart());

    yield txSendSaga({
      type: ETxSenderType.ETO_SET_DATE,
      transactionFlowGenerator: etoSetDateGenerator,
    });
    logger.info("Setting ETO date successful");
  } catch (e) {
    logger.info("Setting ETO date cancelled", e);
    yield put(actions.etoFlow.setEtoDateStop());
  }
}

function* etoSignInvestmentAgreementSaga(
  { logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.etoFlow.signInvestmentAgreement>,
): Iterator<any> {
  try {
    yield txSendSaga({
      type: ETxSenderType.SIGN_INVESTMENT_AGREEMENT,
      transactionFlowGenerator: etoSignInvestmentAgreementGenerator,
      extraParam: action.payload,
    });
    logger.info("Signing investment agreement was successful");
  } catch (e) {
    logger.info("Signing investment agreement was cancelled", e);
  } finally {
    yield put(actions.eto.loadSignedInvestmentAgreement(action.payload.eto.etoId, action.payload.eto.previewCode));
  }
}

export const txEtoSetDateSagas = function*(): Iterator<any> {
  yield fork(neuTakeLatest, "TRANSACTIONS_START_ETO_SET_DATE", etoSetDateSaga);
  yield fork(neuTakeLatest, etoFlowActions.signInvestmentAgreement, etoSignInvestmentAgreementSaga);
};
