import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { appRoutes } from "../../../../appRoutes";
import { ButtonLink } from "../../../../shared/buttons/ButtonLink";
import { Money } from "../../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../../shared/formatters/utils";
import { Message } from "../Message";

type TExternalProps = {
  isEmbedded: boolean;
  pledgedAmount: number;
  investorsCount: number | undefined;
};

const RegisterNowWidget: React.FunctionComponent<TExternalProps> = ({
  isEmbedded,
  investorsCount,
  pledgedAmount,
}) => {
  const wasPledged = investorsCount && investorsCount !== 0;

  return (
    <Message
      data-test-id="eto-overview-status-whitelisting-suspended"
      title={
        wasPledged ? (
          <FormattedMessage
            id="shared-component.eto-overview.register-cta.title-pledged"
            values={{
              totalAmount: (
                <Money
                  value={pledgedAmount ? pledgedAmount.toString() : undefined}
                  inputFormat={ENumberInputFormat.FLOAT}
                  valueType={ECurrency.EUR}
                  outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                />
              ),
              totalInvestors: investorsCount,
            }}
          />
        ) : (
          undefined
        )
      }
      summary={
        wasPledged ? (
          <FormattedMessage id="shared-component.eto-overview.register-cta.summary-pledged" />
        ) : (
          <FormattedMessage id="shared-component.eto-overview.register-cta.summary" />
        )
      }
    >
      <ButtonLink
        className="mt-3"
        to={appRoutes.register}
        data-test-id="logged-out-campaigning-register"
        target={isEmbedded ? "_blank" : ""}
      >
        <FormattedMessage id="shared-component.eto-overview.register" />
      </ButtonLink>
    </Message>
  );
};

export { RegisterNowWidget };
