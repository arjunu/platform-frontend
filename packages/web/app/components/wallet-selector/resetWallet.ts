import { actions } from "../../modules/actions";
import { onEnterAction } from "../../utils/OnEnterAction";
import { onLeaveAction } from "../../utils/OnLeaveAction";

/**
 * Cancels all previous started wallet selector actions while mounting the component
 * Fixes the case when it's possible to sign through metamask after going from `Metamask` to `Light Wallet` tab
 */
const resetWalletOnEnter = () =>
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.walletSelector.reset());
    },
  });

/**
 * Cancels all previous started wallet selector actions while unmounting the component
 * Fixes the case when it's possible to sign through metamask after going from `Metamask` to Landing page
 */
const resetWalletOnLeave = () =>
  onLeaveAction({
    actionCreator: dispatch => {
      dispatch(actions.walletSelector.reset());
    },
  });

export { resetWalletOnEnter, resetWalletOnLeave };
