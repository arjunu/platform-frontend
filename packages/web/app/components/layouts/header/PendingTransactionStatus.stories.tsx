import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ETxSenderState } from "../../../modules/tx/sender/reducer";
import { NoPendingTransaction, PendingTransactionStatusLayout } from "./PendingTransactionStatus";

storiesOf("PendingTransactionStatus", module)
  .add("No pending transactions", () => <NoPendingTransaction className="className" />)
  .add("In progress", () => (
    <PendingTransactionStatusLayout
      className="className"
      pendingTransaction={{
        transactionStatus: ETxSenderState.MINING,
      }}
      monitorPendingTransaction={action("monitorPendingTransaction")}
    />
  ))
  .add("Success", () => (
    <PendingTransactionStatusLayout
      className="className"
      pendingTransaction={{
        transactionStatus: ETxSenderState.DONE,
      }}
      monitorPendingTransaction={action("monitorPendingTransaction")}
    />
  ))
  .add("error", () => (
    <PendingTransactionStatusLayout
      className="className"
      pendingTransaction={{
        transactionStatus: ETxSenderState.ERROR_SIGN,
      }}
      monitorPendingTransaction={action("monitorPendingTransaction")}
    />
  ));
