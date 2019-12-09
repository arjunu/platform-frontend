import { delay, fork, put, select } from "@neufund/sagas";
import { BigNumber } from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import * as Web3 from "web3";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { TPendingTxs, TxPendingWithMetadata } from "../../../lib/api/users/interfaces";
import { ITxData } from "../../../lib/web3/types";
import { OutOfGasError, RevertedTransactionError } from "../../../lib/web3/Web3Adapter";
import { invariant } from "../../../utils/invariant";
import { actions } from "../../actions";
import { neuCall, neuTakeLatest, neuTakeUntil } from "../../sagasUtils";
import { getTransactionOrThrow } from "../event-channel/sagas";
import { ETransactionErrorType, ETxSenderState } from "../sender/reducer";
import { txMonitorSaga } from "../sender/sagas";
import { InvestmentAdditionalDataSchema } from "../transactions/investment/types";
import { ETxSenderType, TSpecificTransactionState } from "../types";
import { TransactionCancelledError } from "./../event-channel/errors";
import { SchemaMismatchError } from "./errors";
import { selectPlatformPendingTransaction } from "./selectors";

const TX_MONITOR_DELAY = process.env.NF_CYPRESS_RUN === "1" ? 5000 : 30000;

export function* deletePendingTransaction({
  apiUserService,
  logger,
}: TGlobalDependencies): Generator<any, any, any> {
  const pendingTransaction: TxPendingWithMetadata | undefined = yield select(
    selectPlatformPendingTransaction,
  );

  if (!pendingTransaction) {
    throw new Error("There should be pending transaction in the pool");
  }

  const txHash = pendingTransaction.transaction.hash;

  logger.info(`Removing pending transaction from list with hash ${txHash}`);

  yield apiUserService.deletePendingTx(txHash);
  yield put(actions.txMonitor.setPendingTxs({ pendingTransaction: undefined }));
}

export function* markTransactionAsPending(
  { apiUserService }: TGlobalDependencies,
  {
    txHash,
    type,
    txData,
    txAdditionalData,
  }: {
    txHash: string;
    type: ETxSenderType;
    txData: ITxData;
    txAdditionalData?: TSpecificTransactionState["additionalData"];
  },
): any {
  const currentPending: TxPendingWithMetadata | undefined = yield select(
    selectPlatformPendingTransaction,
  );

  if (currentPending) {
    invariant(
      currentPending.transactionStatus !== ETxSenderState.MINING,
      "There is already another custom pending transaction",
    );

    yield apiUserService.deletePendingTx(currentPending.transaction.hash);
  }

  const transactionTimestamp = Date.now();

  const pendingTransaction: TxPendingWithMetadata = {
    transaction: {
      from: addHexPrefix(txData.from),
      gas: addHexPrefix(new BigNumber(txData.gas).toString(16)),
      gasPrice: addHexPrefix(new BigNumber(txData.gasPrice).toString(16)),
      hash: addHexPrefix(txHash),
      input: addHexPrefix(txData.data || "0x0"),
      nonce: addHexPrefix("0"),
      to: addHexPrefix(txData.to),
      value: addHexPrefix(new BigNumber(txData.value).toString(16)),
      blockHash: undefined,
      blockNumber: undefined,
      chainId: undefined,
      status: undefined,
      transactionIndex: undefined,
      failedRpcError: undefined,
    },
    transactionType: type,
    transactionAdditionalData: txAdditionalData,
    transactionStatus: ETxSenderState.MINING,
    transactionError: undefined,
    transactionTimestamp,
  };

  yield apiUserService.addPendingTx(pendingTransaction);

  yield put(actions.txMonitor.setPendingTxs({ pendingTransaction }));

  return transactionTimestamp;
}

export function* ensurePendingTransactionSchemaIsValid(
  pendingTransaction: TxPendingWithMetadata,
): Generator<any, any, any> {
  // THIS IS A TEMPORARY PATCH A GENERAL SOLUTION THAT INCLUDES VERSIONING SHOULD COVER ALL TX TYPES
  switch (pendingTransaction.transactionType) {
    case ETxSenderType.WITHDRAW:
      if (
        pendingTransaction.transactionAdditionalData === undefined ||
        (pendingTransaction.transactionAdditionalData &&
          (pendingTransaction.transactionAdditionalData.to === undefined ||
            pendingTransaction.transactionAdditionalData.amount === undefined ||
            pendingTransaction.transactionAdditionalData.amountEur === undefined ||
            pendingTransaction.transactionAdditionalData.totalEur === undefined ||
            pendingTransaction.transactionAdditionalData.total === undefined))
      ) {
        throw new SchemaMismatchError(ETxSenderType.WITHDRAW);
      }
      break;

    case ETxSenderType.INVEST: {
      const isValid = yield InvestmentAdditionalDataSchema.toYup().isValid(
        pendingTransaction.transactionAdditionalData,
      );

      if (!isValid) {
        throw new SchemaMismatchError(ETxSenderType.INVEST);
      }
      break;
    }

    default:
      return;
  }
}

export function* updatePendingTxs({
  apiUserService,
  logger,
}: TGlobalDependencies): Generator<any, any, any> {
  let apiPendingTx: TPendingTxs = yield apiUserService.pendingTxs();

  // check whether transaction was mined
  if (apiPendingTx.pendingTransaction) {
    const pendingTransaction = apiPendingTx.pendingTransaction;
    const txHash = pendingTransaction.transaction.hash;

    if (pendingTransaction.transactionStatus === undefined) {
      logger.warn(
        new Error(`Transaction status is not defined for pending transaction with hash ${txHash}.`),
      );
    }

    try {
      const transaction: Web3.Transaction | null = yield neuCall(getTransactionOrThrow, txHash);

      if (transaction) {
        apiPendingTx = {
          ...apiPendingTx,
          pendingTransaction: {
            ...pendingTransaction,
            transactionStatus: ETxSenderState.DONE,
          },
        };
      }
    } catch (error) {
      let transactionError = ETransactionErrorType.UNKNOWN_ERROR;

      if (error instanceof TransactionCancelledError) {
        transactionError = ETransactionErrorType.TX_WAS_REJECTED;
      } else if (error instanceof RevertedTransactionError) {
        transactionError = ETransactionErrorType.REVERTED_TX;
      } else if (error instanceof OutOfGasError) {
        transactionError = ETransactionErrorType.NOT_ENOUGH_ETHER_FOR_GAS;
      } else {
        logger.error("Unknown Pending Tx Error from 'updatePendingTxs'", error);
      }

      apiPendingTx = {
        ...apiPendingTx,
        pendingTransaction: {
          ...pendingTransaction,
          transactionStatus: ETxSenderState.ERROR_SIGN,
          transactionError,
        },
      };
    }
  }

  try {
    // If there is a pending transaction, check if schema is valid
    if (apiPendingTx.pendingTransaction) {
      yield ensurePendingTransactionSchemaIsValid(apiPendingTx.pendingTransaction);
    }

    yield put(actions.txMonitor.setPendingTxs(apiPendingTx));
  } catch (e) {
    if (e instanceof SchemaMismatchError) {
      logger.warn("Found pending transaction Schema Mismatch", e);

      if (apiPendingTx.pendingTransaction) {
        yield apiUserService.deletePendingTx(apiPendingTx.pendingTransaction.transaction.hash);
      }
    } else {
      throw e;
    }
  }
}

function* txMonitor({ logger }: TGlobalDependencies): Generator<any, any, any> {
  while (true) {
    logger.info("Querying for pending txs...");
    try {
      yield neuCall(updatePendingTxs);
    } catch (e) {
      logger.error("Error getting pending txs", e);
    }

    yield delay(TX_MONITOR_DELAY);
  }
}

function* removePendingTransaction({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    // call delete transaction saga
    yield neuCall(deletePendingTransaction);

    logger.info("Pending transaction has been deleted");
  } catch (e) {
    logger.error(new Error("Unable to delete pending transaction"));
  } finally {
    yield put(actions.txSender.txSenderHideModal());
  }
}

export function* txMonitorSagas(): any {
  yield fork(neuTakeUntil, actions.auth.setUser, actions.auth.logout, txMonitor);
  yield fork(neuTakeLatest, actions.txMonitor.monitorPendingPlatformTx, txMonitorSaga);
  yield fork(neuTakeLatest, actions.txMonitor.deletePendingTransaction, removePendingTransaction);
}
