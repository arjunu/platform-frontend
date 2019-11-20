import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EthereumIcon } from "../../../shared/ethereum";
import { Message } from "../../message/Message";
import { TxHashAndBlock } from "./TxHashAndBlock";

export interface IProps {
  txHash: string;
  blockId?: number;
}

export const TxExternalPending: React.FunctionComponent<IProps> = ({ txHash, blockId }) => (
  <Message
    data-test-id="modals.shared.tx-external-pending.modal"
    image={<EthereumIcon className="mb-3" />}
    title={<FormattedMessage id="tx-sender.tx-pending-watching.title" />}
    text={<FormattedMessage id="tx-sender.tx-pending-watching.description" />}
  >
    <TxHashAndBlock txHash={txHash} blockId={blockId} />
  </Message>
);
