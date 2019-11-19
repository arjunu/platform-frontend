import { createActionFactory } from "@neufund/shared";

import { TxUserFlowInputData } from "../types";

export const txUserFlowTokenTransferActions = {
  runUserFlowOperations: createActionFactory(
    "TX_USER_FLOW_DETECT_TOKEN_TRANSFER_MAX",
    (txUserFlowData: TxUserFlowInputData) => ({
      ...txUserFlowData,
    }),
  ),
};
