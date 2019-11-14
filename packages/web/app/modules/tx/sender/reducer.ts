import { ITxData } from "../../../lib/web3/types";
import { AppReducer } from "../../../store";
import { Overwrite } from "../../../types";
import { actions } from "../../actions";
import { ITxTypeWithData, TSpecificTransactionState } from "../types";

export enum ETransactionErrorType {
  // Flow Specific Errors
  NOT_ENOUGH_NEUMARKS_TO_UNLOCK = "not_enough_neumarks_to_unlock",
  // General Errors
  NOT_ENOUGH_ETHER_FOR_GAS = "not_enough_ether_for_gas",
  FAILED_TO_GENERATE_TX = "failed_to_generate_tx",
  GAS_TOO_LOW = "gas_too_low",
  TOO_MANY_TX_IN_QUEUE = "too_many_tx_in_queue",
  INVALID_RLP_TX = "invalid_rlp_tx",
  INVALID_CHAIN_ID = "invalid_chain_id",
  TX_WAS_REJECTED = "tx_was_rejected",
  NOT_ENOUGH_FUNDS = "not_enough_funds",
  ERROR_WHILE_WATCHING_TX = "error_while_watching_tx",
  OUT_OF_GAS = "out_of_gas",
  REVERTED_TX = "reverted_tx",
  NONCE_TOO_LOW = "nonce_too_low",
  LEDGER_CONTRACTS_DISABLED = "ledger_contracts_disabled",
  UNKNOWN_ERROR = "unknown_error",
}

export enum ETxSenderState {
  UNINITIALIZED = "UNINITIALIZED",
  WATCHING_PENDING_TXS = "WATCHING_PENDING_TXS",
  INIT = "INIT",
  SUMMARY = "SUMMARY",
  ACCESSING_WALLET = "ACCESSING_WALLET",
  SIGNING = "SIGNING",
  MINING = "MINING",
  DONE = "DONE",
  ERROR_SIGN = "ERROR_SIGN",
}

type ITxSenderDefaultState = ITxTypeWithData<undefined, undefined>;

interface ITxSenderCommonState {
  state: ETxSenderState;
  txDetails: ITxData | undefined;
  txTimestamp?: number;
  blockId?: number;
  txHash?: string;
  error?: ETransactionErrorType;
}

type TTransactionState = TSpecificTransactionState | ITxSenderDefaultState;

export type ITxSenderState = Overwrite<
  TTransactionState,
  { type: TTransactionState["type"]; additionalData: TTransactionState["additionalData"] }
> &
  ITxSenderCommonState;

const initialState: ITxSenderState = {
  type: undefined,
  additionalData: undefined,
  state: ETxSenderState.UNINITIALIZED,
  txDetails: undefined,
};

export const txSenderReducer: AppReducer<ITxSenderState> = (
  state = initialState,
  action,
): ITxSenderState => {
  switch (action.type) {
    // Modal related Actions
    case "TX_SENDER_SHOW_MODAL":
      return {
        ...initialState,
        state: ETxSenderState.INIT,
        ...action.payload.initialState,
      };
    case "TX_SENDER_HIDE_MODAL":
      return initialState;

    //Pending Transaction Actions
    case "TX_SENDER_WATCH_PENDING_TXS":
      return {
        ...initialState,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        txHash: action.payload.txHash,
      };

    case "TX_SENDER_ACCEPT":
      return {
        ...state,
        state: ETxSenderState.ACCESSING_WALLET,
      };
    case "TX_SENDER_SET_TRANSACTION_DATA":
      return {
        ...state,
        txDetails: action.payload.txData,
      };
    case "TX_SENDER_WALLET_PLUGGED":
      return {
        ...state,
        state: ETxSenderState.SIGNING,
      };
    case "TX_SENDER_SIGNED":
      return {
        ...state,
        state: ETxSenderState.MINING,
        txHash: action.payload.txHash,
        type: action.payload.type,
        txTimestamp: action.payload.txTimestamp,
      };

    case "TX_SENDER_REPORT_BLOCK":
      return {
        ...state,
        blockId: action.payload,
      };

    case "TX_SENDER_TX_MINED":
      return {
        ...state,
        state: ETxSenderState.DONE,
      };

    case "TX_SENDER_ERROR":
      return {
        ...state,
        state: ETxSenderState.ERROR_SIGN,
        error: action.payload.error,
      };
    case "TX_SENDER_CONTINUE_TO_SUMMARY_WITH_DATA":
      return {
        ...state,
        state: ETxSenderState.SUMMARY,
        additionalData: action.payload.additionalData,
      };
    //Change Actions
    case "TX_SENDER_CHANGE":
      return {
        ...state,
        state: ETxSenderState.INIT,
        type: action.payload.type,
      };

    case actions.txSender.setAdditionalData.getType():
      return {
        ...state,
        additionalData: {
          ...state.additionalData!,
          ...action.payload.additionalData,
        },
      };
    case actions.txSender.setTimestamp.getType():
      return {
        ...state,
        txTimestamp: action.payload.txTimestamp,
      };
    case actions.txSender.txSenderClearTransactionData.getType():
      return {
        ...state,
        txDetails: undefined,
      };
  }

  return state;
};
