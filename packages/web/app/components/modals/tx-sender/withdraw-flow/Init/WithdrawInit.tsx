import { compose, withHandlers } from "recompose";

import { actions } from "../../../../../modules/actions";
import {
  selectUserFlowTokenDecimals,
  selectUserFlowTokenImage,
  selectUserFlowTokenSymbol,
  selectUserFlowTxDetails,
  selectUserFlowTxInput,
} from "../../../../../modules/tx/user-flow/transfer/selectors";
import { TxUserFlowInputData } from "../../../../../modules/tx/user-flow/transfer/types";
import {
  selectTxValidationNotifications,
  selectTxValidationState,
} from "../../../../../modules/tx/validator/selectors";
import { selectLiquidEtherBalance } from "../../../../../modules/wallet/selectors";
import { appConnect } from "../../../../../store";
import {
  ITransferLayoutDispatchProps,
  ITransferLayoutStateProps,
  TransferLayout,
  TTransferLayoutProps,
} from "./TransferLayout/TransferLayout";
import { onTransferValidateHandler } from "./utils";

const WithdrawInit = compose<TTransferLayoutProps, {}>(
  appConnect<ITransferLayoutStateProps, ITransferLayoutDispatchProps>({
    stateToProps: state => ({
      tokenAmount: selectLiquidEtherBalance(state),
      tokenSymbol: selectUserFlowTokenSymbol(state),
      tokenImage: selectUserFlowTokenImage(state),
      validationState: selectTxValidationState(state),
      notifications: selectTxValidationNotifications(state),
      userFlowDetails: selectUserFlowTxDetails(state),
      txUserFlowInputData: selectUserFlowTxInput(state),
      tokenDecimals: selectUserFlowTokenDecimals(state),
    }),
    dispatchToProps: d => ({
      onAccept: () => {
        d(actions.txUserFlowTransfer.userFlowAcceptForm());
      },
      onValidate: (txDraft: TxUserFlowInputData) => {
        d(actions.txUserFlowWithdraw.runUserFlowOperations(txDraft));
      },
    }),
  }),
  withHandlers<ITransferLayoutStateProps & ITransferLayoutDispatchProps, {}>({
    onValidateHandler: onTransferValidateHandler,
  }),
)(TransferLayout);

export { WithdrawInit };
