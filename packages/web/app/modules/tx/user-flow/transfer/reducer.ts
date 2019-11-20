import { AppReducer } from "../../../../store";
import { actions } from "../../../actions";
import { EthereumAddress } from "./../../../../utils/opaque-types/types";
import { TxUserFlowInputData, TxUserFlowTransferDetails } from "./types";

export type TTransferInitialValues = {
  tokenAddress: EthereumAddress | "";
  userBalance: string;
  tokenSymbol: string;
  tokenImage: string;
  tokenDecimals: number;
};

export interface ITxUserFlowState {
  txUserFlowDetails: TxUserFlowTransferDetails;
  txUserTokenData: TTransferInitialValues;
  txUserFlowInputData: TxUserFlowInputData;
}

const initialState: ITxUserFlowState = {
  txUserTokenData: {
    tokenAddress: "",
    userBalance: "0",
    tokenSymbol: "",
    tokenImage: "",
    tokenDecimals: 0,
  },
  txUserFlowInputData: { to: "", value: "" },
  txUserFlowDetails: {
    inputValue: "0",
    inputValueEuro: "0",
    totalValue: "0",
    totalValueEur: "0",
    transactionCost: "0",
    transactionCostEur: "0",
  },
};

export const txUserFlowTransferReducer: AppReducer<ITxUserFlowState> = (
  state = initialState,
  action,
): ITxUserFlowState => {
  switch (action.type) {
    // Modal related Actions
    case actions.txUserFlowTransfer.setInitialValues.getType():
      return {
        ...state,
        txUserTokenData: { ...action.payload },
      };
    case actions.txUserFlowTransfer.setTxUserFlowData.getType():
      return {
        ...state,
        txUserFlowDetails: { ...state.txUserFlowDetails, ...action.payload.txUserFlowData },
      };
    case actions.txUserFlowTransfer.setTxUserFlowInputData.getType():
      return {
        ...state,
        txUserFlowInputData: {
          ...state.txUserFlowInputData,
          ...action.payload.txUserFlowInputData,
        },
      };
    case actions.txUserFlowTransfer.clearDraftTx.getType():
      return initialState;
  }

  return state;
};
