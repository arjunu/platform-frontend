import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxSenderState } from "../../../../modules/tx/sender/reducer";
import { AccessWalletContainer } from "../../wallet-access/AccessWalletModal";
import { SigningMessage } from "../shared/SigningMessage";
import { TxError } from "../shared/TxError";
import { TxExternalPending } from "../shared/TxExternalPending";
import { TxPending } from "../shared/TxPending";
import { InitComponent } from "./InitComponent";
import { SuccessComponent } from "./SuccessComponent";
import { SummaryComponent } from "./SummaryComponent";
import { TxSenderProps } from "./types";

const TxSenderBody: React.FunctionComponent<TxSenderProps> = ({
  state,
  blockId,
  txHash,
  type,
  error,
  txTimestamp,
}) => {
  switch (state) {
    case ETxSenderState.WATCHING_PENDING_TXS:
      return <TxExternalPending txHash={txHash!} blockId={blockId} />;

    case ETxSenderState.INIT:
      if (!type) {
        throw new Error("Transaction type needs to be set at transaction init state");
      }
      return <InitComponent type={type} />;

    case ETxSenderState.SUMMARY:
      if (!type) {
        throw new Error("Transaction type needs to be set at transaction summary state");
      }
      return <SummaryComponent type={type} />;

    case ETxSenderState.ACCESSING_WALLET:
      return (
        <AccessWalletContainer
          title={<FormattedMessage id="modals.tx-sender.confirm-title" />}
          message={<FormattedMessage id="modals.tx-sender.confirm-description" />}
        />
      );

    case ETxSenderState.SIGNING:
      return <SigningMessage />;

    case ETxSenderState.MINING:
      if (!type) {
        throw new Error("Transaction type needs to be set at transaction mining state");
      }

      return <TxPending blockId={blockId} txHash={txHash} type={type} />;

    case ETxSenderState.DONE:
      if (!type) {
        throw new Error("Transaction type needs to be set at transaction success state");
      }

      return <SuccessComponent type={type} txHash={txHash!} txTimestamp={txTimestamp!} />;

    case ETxSenderState.ERROR_SIGN:
      if (!type) {
        throw new Error("Transaction type needs to be set at transaction error state");
      }

      return <TxError blockId={blockId} txHash={txHash!} type={type} error={error} />;

    default:
      return null;
  }
};

export { TxSenderBody };
