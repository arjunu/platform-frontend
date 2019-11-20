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

export const TransferPending = compose<
  ITransferTransactionExternalProps & THocProps<typeof transferTransaction>,
  ITransferTransactionExternalProps
>(
  withProps<void, ITransferTransactionExternalProps & ITransferTransactionInternalProps>(() => ({
    status: ETxStatus.PENDING,
    isMined: true,
    amountCaption: <FormattedMessage id="modal.transfer.sending.amount" />,
    "data-test-id": "modals.shared.tx-pending.modal",
  })),
  transferTransaction(),
)(TransferTransactionWrapperLayout);
