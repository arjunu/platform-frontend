import { txUserFlowRedeemActions } from "./redeem/actions";
import { txUserFlowWithdrawActions } from "./withdraw/actions";

export const txUserFlowActions = {
  txUserFlowWithdraw: txUserFlowWithdrawActions,
  txUserFlowRedeem: txUserFlowRedeemActions,
};
