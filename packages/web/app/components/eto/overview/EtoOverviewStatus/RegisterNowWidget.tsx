import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { appRoutes } from "../../../appRoutes";
import { ButtonLink } from "../../../shared/buttons/ButtonLink";

type TExternalProps = { isEmbedded: boolean; pledgedAmount: number; investorsCount: number };

const RegisterNowWidget: React.FunctionComponent<TExternalProps> = ({ isEmbedded }) => (
  <>
    <p className="mb-0">
      <FormattedMessage id="shared-component.eto-overview.register-cta" />
    </p>
    <ButtonLink
      innerClassName="mt-3"
      to={appRoutes.register}
      data-test-id="logged-out-campaigning-register"
      target={isEmbedded ? "_blank" : ""}
    >
      <FormattedMessage id="shared-component.eto-overview.register" />
    </ButtonLink>
  </>
);

export { RegisterNowWidget };
