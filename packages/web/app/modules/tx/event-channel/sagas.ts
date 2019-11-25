import { buffers, channel, Channel, delay } from "redux-saga";
import { call, put, race } from "redux-saga/effects";
import * as Web3 from "web3";

import { BLOCK_MINING_TIME_DELAY } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { TPendingTxs } from "../../../lib/api/users/interfaces";
import { OutOfGasError, RevertedTransactionError } from "../../../lib/web3/Web3Adapter";
import { neuCall } from "../../sagasUtils";
import { TransactionCancelledError } from "./errors";
import { EEventEmitterChannelEvents, TEventEmitterChannelEvents } from "./types";

enum TRANSACTION_STATUS {
  REVERTED = "0x0",
  SUCCESS = "0x1",
}

/**
 * Get information about transactions (from `web3.eth.getTransaction`) or `null` when transaction is pending
 * throws OutOfGasError or RevertedTransactionError in case of transaction not mined successfully
 */

export function* getTransactionOrThrow(
  { web3Manager, apiUserService }: TGlobalDependencies,
  txHash: string,
): Iterator<any> {
  const tx: Web3.Transaction = yield web3Manager.getTransactionByHash(txHash);
  const txReceipt: Web3.TransactionReceipt | null = yield web3Manager.internalWeb3Adapter.getTransactionReceipt(
    txHash,
  );

  // If the proxy transactional node fails to post the transaction
  const pendingTx: TPendingTxs = yield apiUserService.pendingTxs();

  if (
    pendingTx &&
    pendingTx.pendingTransaction &&
    pendingTx.pendingTransaction.transaction &&
    pendingTx.pendingTransaction.transaction.status === "failed"
  ) {
    throw new TransactionCancelledError(pendingTx.pendingTransaction.transaction.failedRpcError);
  }

  // Both requests `getTx` and `getTransactionReceipt` can end up in two separate nodes
  const isMined = tx && tx.blockNumber && txReceipt && txReceipt.blockNumber;

  if (!isMined) {
    return null;
  }

  if (txReceipt!.status === TRANSACTION_STATUS.REVERTED) {
    if (txReceipt!.gasUsed === tx.gas) {
      // All gas is burned in this case
      throw new OutOfGasError();
    }
    throw new RevertedTransactionError();
  }

  return tx;
}

/**
 * Watch for a given `txHash` and emit events to the `txChannel`
 * @note `watchForTx` won't cancel watching on it's own.
 *       It's a responsibility of the consumer to cancel the watcher (by canceling the saga)
 */
export function* watchForTx(
  { web3Manager }: TGlobalDependencies,
  txHash: string,
  txChannel: Channel<TEventEmitterChannelEvents>,
): Iterator<any> {
  let lastBlockId = -1;
  while (true) {
    try {
      const currentBlockNo: number = yield web3Manager.internalWeb3Adapter.getBlockNumber();

      if (lastBlockId !== currentBlockNo) {
        lastBlockId = currentBlockNo;

        yield put(txChannel, {
          type: EEventEmitterChannelEvents.NEW_BLOCK,
          blockId: currentBlockNo,
        });

        const tx = yield neuCall(getTransactionOrThrow, txHash);
        if (tx) {
          yield put(txChannel, { type: EEventEmitterChannelEvents.TX_MINED });
        }
      }

      yield delay(BLOCK_MINING_TIME_DELAY);
    } catch (error) {
      if (error instanceof TransactionCancelledError) {
        yield put(txChannel, { type: EEventEmitterChannelEvents.CANCELLED, error });
      } else if (error instanceof RevertedTransactionError) {
        yield put(txChannel, { type: EEventEmitterChannelEvents.REVERTED_TRANSACTION, error });
      } else if (error instanceof OutOfGasError) {
        yield put(txChannel, { type: EEventEmitterChannelEvents.OUT_OF_GAS, error });
      } else {
        yield put(txChannel, { type: EEventEmitterChannelEvents.ERROR, error });
      }
    }
  }
}

export function* createWatchTxChannel(
  txHash: string,
  actionGeneratingSaga: (channel: Channel<TEventEmitterChannelEvents>) => Iterator<any>,
): Iterator<any> {
  // Be really careful here as `channel` only allows single subscriber and
  // it's really hard to catch why not all subscribers are notified
  // TODO: replace by `multicastChannel` after migration to redux-saga 1.*
  const txChannel: Channel<TEventEmitterChannelEvents> = yield channel(buffers.sliding(50));

  yield race({
    action: call(actionGeneratingSaga, txChannel),
    blockWatcher: neuCall(watchForTx, txHash, txChannel),
  });
}
