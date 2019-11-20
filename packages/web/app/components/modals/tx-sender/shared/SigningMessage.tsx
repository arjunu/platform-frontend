import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EthereumIcon } from "../../../shared/ethereum";
import { Message } from "../../message/Message";

const SigningMessage = () => (
  <Message
    data-test-id="modals.shared.signing-message.modal"
    image={<EthereumIcon />}
    title={<FormattedMessage id="modal.shared.signing-message.title" />}
    hint={<FormattedMessage id="modal.shared.signing-message.hint" />}
  />
);

export { SigningMessage };
