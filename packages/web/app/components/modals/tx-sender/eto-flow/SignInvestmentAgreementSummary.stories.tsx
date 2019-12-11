import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { SignInvestmentAgreementComponent } from "./SignInvestmentAgreementSummary";

storiesOf("ETO/Documents/signInvestmentAgreement modal", module)
  .addDecorator(withModalBody())
  .add("default", () => <SignInvestmentAgreementComponent onAccept={action("accept")} />);
