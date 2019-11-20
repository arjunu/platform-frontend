import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { THocProps } from "../../../../../types";
import { ETxStatus } from "../../types";
import {
  ITransferTransactionExternalProps,
  ITransferTransactionInternalProps,
  transferTransaction,
} from "../TransferTransactionLayout/TransferTransaction";
import { TransferTransactionWrapperLayout } from "../TransferTransactionLayout/TransferTransactionLayout";

export const TransferSuccess = compose<
  ITransferTransactionExternalProps & THocProps<typeof transferTransaction>,
  ITransferTransactionExternalProps
>(
  withProps<void, ITransferTransactionInternalProps & ITransferTransactionExternalProps>(() => ({
    status: ETxStatus.SUCCESS,
    isMined: true,
    amountCaption: <FormattedMessage id="modal.transfer.sent.amount" />,
    "data-test-id": "modals.shared.tx-success.modal",
  })),
  transferTransaction(),
)(TransferTransactionWrapperLayout);
