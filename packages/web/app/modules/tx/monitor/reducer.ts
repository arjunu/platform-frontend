import { TPendingTxs } from "../../../lib/api/users/interfaces";
import { AppReducer } from "../../../store";
import { DeepReadonly } from "../../../types";

export interface ITxMonitorState {
  txs: TPendingTxs;
}

const initialState: ITxMonitorState = {
  txs: { pendingTransaction: undefined, oooTransactions: [] },
};

export const txMonitorReducer: AppReducer<ITxMonitorState> = (
  state = initialState,
  action,
): DeepReadonly<ITxMonitorState> => {
  switch (action.type) {
    case "TX_MONITOR_LOAD_TXS":
      return {
        txs: { ...state.txs, ...action.payload.txs },
      };
  }

  return state;
};
