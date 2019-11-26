import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { convertFromUlps } from "../../../../../utils/NumberUtils";
import { actions, TActionFromCreator } from "../../../../actions";
import { neuDebounce } from "../../../../sagasUtils";
import { ETxSenderType } from "../../../types";
import { toFormValue } from "../utils";
import { selectUserFlowTokenDecimals, selectUserFlowUserBalance } from "./../selectors";

function* detectMaxWithdraw(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.txUserFlowWithdraw.runUserFlowOperations>,
): Iterator<any> {
  const { to, value } = action.payload;

  let modifiedValue = value;

  const userBalance: string = yield select(selectUserFlowUserBalance);
  const tokenDecimals: number = yield select(selectUserFlowTokenDecimals);

  const fixedToken = toFormValue(userBalance, tokenDecimals);

  if (fixedToken === value) {
    modifiedValue = convertFromUlps(userBalance, tokenDecimals).toString();
  }
  yield put(
    actions.txValidator.validateDraft({
      to,
      value: modifiedValue,
      type: ETxSenderType.TRANSFER_TOKENS,
    }),
  );
  yield put(
    actions.txUserFlowTransfer.setTxUserFlowInputData({
      to,
      value,
    }),
  );
}

export const txTokenTransferFlowSagasWatcher = function*(): Iterator<any> {
  yield fork(
    neuDebounce,
    300,
    actions.txUserFlowTokenTransfer.runUserFlowOperations,
    detectMaxWithdraw,
  );
};
