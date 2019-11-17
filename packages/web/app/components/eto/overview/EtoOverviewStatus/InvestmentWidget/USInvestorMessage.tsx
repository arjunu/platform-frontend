import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { appRoutes } from "../../../../appRoutes";
import { ButtonLink } from "../../../../shared/buttons/ButtonLink";
import { Message } from "../Message";

const USInvestorMessage: React.FunctionComponent = () => (
  <Message
    data-test-id="investment-widget.us-investor-message"
    summary={
      <FormattedMessage
        id="shared-component.eto-overview.is-investor-message"
        values={{
          breakingLine: <br />,
        }}
      />
    }
  >
    <ButtonLink
      className="mt-3"
      to={appRoutes.dashboard}
      data-test-id="investment-widget.us-investor-message.go-to-dashboard"
    >
      <FormattedMessage id="shared-component.eto-overview.go-to-dashboard" />
    </ButtonLink>
  </Message>
);

export { USInvestorMessage };
