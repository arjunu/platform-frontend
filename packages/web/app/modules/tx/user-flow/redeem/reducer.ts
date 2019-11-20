import { AppReducer } from "../../../../store";
import { actions } from "../../../actions";

export type TxUserFlowRedeemState = {
  initialValue: string | undefined;
};

const initialState: TxUserFlowRedeemState = {
  initialValue: undefined,
};

export const txUserFlowWRedeemReducer: AppReducer<TxUserFlowRedeemState> = (
  state = initialState,
  action,
): TxUserFlowRedeemState => {
  switch (action.type) {
    case actions.txUserFlowRedeem.setInitialValue.getType():
      return {
        initialValue: action.payload.initialValue,
      };
  }

  return state;
};
