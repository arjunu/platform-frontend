import { txUserFlowInvestmentReducer } from "./investment/reducer";
import { txUserFlowWRedeemReducer } from "./redeem/reducer";
import { txUserFlowTransferReducer } from "./transfer/reducer";

export const txUserFlowReducers = {
  txUserFlowTransfer: txUserFlowTransferReducer,
  txUserFlowRedeem: txUserFlowWRedeemReducer,
  txUserFlowInvestment: txUserFlowInvestmentReducer,
};
