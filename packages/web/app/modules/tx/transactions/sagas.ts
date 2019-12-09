import { fork } from "@neufund/sagas";

import { txUserClaimSagas } from "./claim/sagas";
import { txEtoSetDateSagas } from "./eto-flow/sagas";
import { txInvestmentSagas } from "./investment/sagas";
import { txSignAgreementSagas } from "./nominee/sign-agreement/sagas";
import { txPayoutSagas } from "./payout/sagas";
import { txRedeemSagas } from "./redeem/sagas";
import { txRefundSagas } from "./refund/sagas";
import { txTokenTransferSagas } from "./token-transfer/sagas";
import { txUnlockWalletSagas } from "./unlock/sagas";
import { txUpgradeSagas } from "./upgrade/sagas";
import { txWithdrawSagas } from "./withdraw/sagas";

export const txTransactionsSagasWatcher = function*(): Generator<any, any, any> {
  yield fork(txWithdrawSagas);
  yield fork(txUpgradeSagas);
  yield fork(txInvestmentSagas);
  yield fork(txUserClaimSagas);
  yield fork(txEtoSetDateSagas);
  yield fork(txUnlockWalletSagas);
  yield fork(txPayoutSagas);
  yield fork(txRedeemSagas);
  yield fork(txRefundSagas);
  yield fork(txSignAgreementSagas);
  yield fork(txTokenTransferSagas);
  // Add new sub sagas here...
};
