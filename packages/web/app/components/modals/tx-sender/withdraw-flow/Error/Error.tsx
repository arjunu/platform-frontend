import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { ETransactionErrorType } from "../../../../../modules/tx/sender/reducer";
import { THocProps } from "../../../../../types";
import { ETxStatus } from "../../types";
import {
  ITransferTransactionExternalProps,
  ITransferTransactionInternalProps,
  transferTransaction,
} from "../TransferTransactionLayout/TransferTransaction";
import { TransferTransactionWrapperLayout } from "../TransferTransactionLayout/TransferTransactionLayout";

export const TransferError = compose<
  ITransferTransactionExternalProps & THocProps<typeof transferTransaction>,
  ITransferTransactionExternalProps
>(
  withProps<
    ITransferTransactionInternalProps,
    ITransferTransactionExternalProps & ITransferTransactionInternalProps
  >(props => ({
    status: ETxStatus.ERROR,
    isMined:
      props.error === ETransactionErrorType.REVERTED_TX ||
      props.error === ETransactionErrorType.OUT_OF_GAS,
    amountCaption: <FormattedMessage id="modal.transfer.sent.amount" />,
    "data-test-id": "modals.shared.tx-error.modal",
  })),
  transferTransaction(),
)(TransferTransactionWrapperLayout);
