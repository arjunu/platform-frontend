import { txUserFlowRedeemActions } from "./redeem/actions";
import { txUserFlowTransferActions } from "./transfer/actions";
import { txUserFlowTokenTransferActions } from "./transfer/token-transfer/actions";
import { txUserFlowWithdrawActions } from "./transfer/withdraw/actions";

export const txUserFlowActions = {
  txUserFlowTokenTransfer: txUserFlowTokenTransferActions,
  txUserFlowWithdraw: txUserFlowWithdrawActions,
  txUserFlowTransfer: txUserFlowTransferActions,
  txUserFlowRedeem: txUserFlowRedeemActions,
};
