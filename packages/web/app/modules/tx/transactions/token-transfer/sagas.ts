import BigNumber from "bignumber.js";
import { all, fork, put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { IERC223Token } from "../../../../lib/contracts/IERC223Token";
import { ITxData } from "../../../../lib/web3/types";
import { toEthereumAddress } from "../../../../utils/opaque-types/utils";
import { actions, TActionFromCreator } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { isAddressValid } from "../../../web3/utils";
import { txSendSaga } from "../../sender/sagas";
import { ETxSenderType } from "../../types";
import { selectUserFlowTxDetails } from "../../user-flow/transfer/selectors";
import { WrongValuesError } from "../errors";
import { EthereumAddress } from "./../../../../utils/opaque-types/types";
import { TxUserFlowTransferDetails } from "./../../user-flow/transfer/types";

export interface ITransferTokenTxGenerator {
  tokenAddress: EthereumAddress;
  to: EthereumAddress;
  valueUlps: string;
}

export function* isERC223TransferSupported(
  { contractsService, web3Manager }: TGlobalDependencies,
  to: EthereumAddress,
  value: string,
): Generator<any, any, any> {
  try {
    const isSmartcontract = yield web3Manager.isSmartContract(to);
    if (!isSmartcontract) return false;

    const data = contractsService.etherToken.rawWeb3Contract.transfer[
      "address,uint256,bytes"
    ].getData(to, value, "");
    yield web3Manager.estimateGas({ to, data });
    return true;
  } catch (e) {
    return false;
  }
}

export function* generateTokenWithdrawTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  { tokenAddress, to, valueUlps }: ITransferTokenTxGenerator,
): Generator<any, any, any> {
  const from: ReturnType<typeof selectEthereumAddressWithChecksum> = yield select(
    selectEthereumAddressWithChecksum,
  );

  // Sanity checks
  if (!to || !isAddressValid(to) || !valueUlps) throw new WrongValuesError();
  const valueBigNumber = new BigNumber(valueUlps);
  if (valueBigNumber.isNegative() && !valueBigNumber.isInteger()) throw new WrongValuesError();

  const contractInstance: IERC223Token = yield contractsService.getERC223(tokenAddress);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);

  const isERC223Supported = yield neuCall(
    isERC223TransferSupported,
    toEthereumAddress(to),
    valueBigNumber.toString(),
  );
  const txInput = isERC223Supported
    ? contractInstance.rawWeb3Contract.transfer["address,uint256,bytes"].getData(
        to,
        valueBigNumber.toString(),
        "",
      )
    : contractInstance.transferTx(to, valueBigNumber).getData();

  const txDetails: Partial<ITxData> = {
    to: tokenAddress,
    from,
    data: txInput,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txDetails);
  return {
    ...txDetails,
    gas: estimatedGasWithOverhead,
  };
}

function* tokenTransferFlowGenerator(_: TGlobalDependencies): Generator<any, any, any> {
  yield take(actions.txSender.txSenderAcceptDraft);
  // ADD SOME LOGIC HERE IN THE MIDDLE
  const txUserFlowData: TxUserFlowTransferDetails = yield select(selectUserFlowTxDetails);

  const additionalData: any = {
    to: txUserFlowData.inputTo,
    amount: txUserFlowData.inputValue,
    amountEur: txUserFlowData.inputValueEuro,
    total: null,
    totalEur: null,
  };

  yield put(
    actions.txSender.txSenderContinueToSummary<ETxSenderType.TRANSFER_TOKENS>(additionalData),
  );
}

function* startTokenTransfer(
  { logger, contractsService }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.txTransactions.startTokenTransfer>,
): Generator<any, any, any> {
  try {
    const { tokenAddress, tokenImage } = action.payload;

    const userAddress: ReturnType<typeof selectEthereumAddressWithChecksum> = yield select(
      selectEthereumAddressWithChecksum,
    );
    const tokenContractInstance: IERC223Token = yield contractsService.getERC223(
      toEthereumAddress(tokenAddress),
    );

    const tokenInfo: {
      tokenSymbol: string;
      tokenDecimals: BigNumber;
      userBalance: BigNumber;
    } = yield all({
      tokenSymbol: yield tokenContractInstance.symbol,
      tokenDecimals: yield tokenContractInstance.decimals,
      userBalance: yield tokenContractInstance.balanceOf(userAddress),
    });

    yield put(
      actions.txUserFlowTransfer.setInitialValues({
        tokenAddress: toEthereumAddress(tokenAddress),
        userBalance: tokenInfo.userBalance.toString(),
        tokenSymbol: tokenInfo.tokenSymbol,
        tokenImage,
        tokenDecimals: tokenInfo.tokenDecimals.toNumber(),
      }),
    );
    yield txSendSaga({
      type: ETxSenderType.TRANSFER_TOKENS,
      transactionFlowGenerator: tokenTransferFlowGenerator,
    });

    logger.info("Transfer Tokens successful");
  } catch (e) {
    logger.info("Transfer Tokens cancelled", e);
  }
}

export const txTokenTransferSagas = function*(): Generator<any, any, any> {
  yield fork(neuTakeLatest, actions.txTransactions.startTokenTransfer, startTokenTransfer);
};
