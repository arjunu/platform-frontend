import { compose, withHandlers } from "recompose";

import { actions } from "../../../../../modules/actions";
import {
  selectUserFlowTokenDecimals,
  selectUserFlowTokenImage,
  selectUserFlowTokenSymbol,
  selectUserFlowTxDetails,
  selectUserFlowTxInput,
  selectUserFlowUserBalance,
} from "../../../../../modules/tx/user-flow/transfer/selectors";
import { TxUserFlowInputData } from "../../../../../modules/tx/user-flow/transfer/types";
import {
  selectTxValidationNotifications,
  selectTxValidationState,
} from "../../../../../modules/tx/validator/selectors";
import { appConnect } from "../../../../../store";
import {
  ITransferLayoutDispatchProps,
  ITransferLayoutStateProps,
  TransferLayout,
  TTransferLayoutProps,
} from "./TransferLayout/TransferLayout";
import { onTransferValidateHandler } from "./utils";

const TransferTokensInit = compose<TTransferLayoutProps, {}>(
  appConnect<ITransferLayoutStateProps, ITransferLayoutDispatchProps>({
    stateToProps: state => ({
      tokenSymbol: selectUserFlowTokenSymbol(state),
      tokenImage: selectUserFlowTokenImage(state),
      tokenDecimals: selectUserFlowTokenDecimals(state),
      tokenAmount: selectUserFlowUserBalance(state),
      validationState: selectTxValidationState(state),
      notifications: selectTxValidationNotifications(state),
      userFlowDetails: selectUserFlowTxDetails(state),
      txUserFlowInputData: selectUserFlowTxInput(state),
    }),
    dispatchToProps: d => ({
      onAccept: () => {
        d(actions.txUserFlowTransfer.userFlowAcceptForm());
      },
      onValidate: (txDraft: TxUserFlowInputData) => {
        d(actions.txUserFlowTokenTransfer.runUserFlowOperations(txDraft));
      },
    }),
  }),
  withHandlers<
    ITransferLayoutStateProps & ITransferLayoutDispatchProps,
    { onValidateHandler: ReturnType<typeof onTransferValidateHandler> }
  >({
    onValidateHandler: onTransferValidateHandler,
  }),
)(TransferLayout);

export { TransferTokensInit };
