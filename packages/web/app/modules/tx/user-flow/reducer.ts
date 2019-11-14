import { txUserFlowWRedeemReducer } from "./redeem/reducer";
import { txUserFlowWithdrawReducer } from "./withdraw/reducer";

export const txUserFlowReducers = {
  txUserFlowWithdraw: txUserFlowWithdrawReducer,
  txUserFlowRedeem: txUserFlowWRedeemReducer,
};
