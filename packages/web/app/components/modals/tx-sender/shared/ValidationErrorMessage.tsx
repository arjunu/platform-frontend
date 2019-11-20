import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EValidationState } from "../../../../modules/tx/validator/reducer";
import { Message } from "../../message/Message";

interface IProps {
  type?: EValidationState;
}

const getValidationMessageByType = (type?: EValidationState) => {
  switch (type) {
    case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS:
      return <FormattedMessage id="modal.txsender.error-message.not-enough-ether-for-gas" />;
    //Add more validation errors

    default:
      return undefined;
  }
};

const ValidationErrorMessage: React.FunctionComponent<IProps> = ({ type }) => (
  <Message
    data-test-id="modals.shared.validation-message"
    hint={getValidationMessageByType(type)}
  />
);

export { ValidationErrorMessage };
