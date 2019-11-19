import { fork } from "redux-saga/effects";

import { txTransferUserFlowSagasWatcher } from "./transfer/sagas";
import { txTokenTransferFlowSagasWatcher } from "./transfer/token-transfer/sagas";
import { txWithdrawUserFlowSagasWatcher } from "./transfer/withdraw/sagas";

export const txUserFlowSagasWatcher = function*(): Iterator<any> {
  yield fork(txWithdrawUserFlowSagasWatcher);
  yield fork(txTransferUserFlowSagasWatcher);
  yield fork(txTokenTransferFlowSagasWatcher);
};
