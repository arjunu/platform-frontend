import { createActionFactory } from "@neufund/shared";

import { TTransferInitialValues } from "./reducer";
import { TxUserFlowInputData, TxUserFlowTransferDetails } from "./types";

export const txUserFlowTransferActions = {
  // STATE SETTERS
  setTxUserFlowData: createActionFactory(
    "TX_USER_FLOW_SET_DATA",
    (txUserFlowData: TxUserFlowTransferDetails) => ({
      txUserFlowData,
    }),
  ),
  clearDraftTx: createActionFactory("TX_USER_FLOW_CLEAR_DRAFT_TX"),
  startInitialValuesSetup: createActionFactory(
    "TX_USER_FLOW_TOKEN_TRANSFER_SETUP_INITIAL_VALUES_START",
    (tokenAddress: string, tokenImage: string) => ({
      tokenAddress,
      tokenImage,
    }),
  ),
  setTxUserFlowInputData: createActionFactory(
    "TX_USER_FLOW_TOKEN_TRANSFER_SET_INPUT_DATA",
    (txUserFlowInputData: TxUserFlowInputData) => ({
      txUserFlowInputData,
    }),
  ),
  setInitialValues: createActionFactory(
    "TX_USER_FLOW_TOKEN_TRANSFER_SET_INITIAL_VALUES",
    (initialValues: TTransferInitialValues) => ({ ...initialValues }),
  ),
  userFlowAcceptForm: createActionFactory("TX_USER_FLOW_ACCEPT_FORM"),
};

// TODO: Add the case where more than one flow can have a separate user flow
