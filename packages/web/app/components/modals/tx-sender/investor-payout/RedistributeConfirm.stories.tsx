import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { InvestorRedistributePayoutConfirmLayout } from "./RedistributeConfirm";

storiesOf("InvestorPayout/RedistributeConfirm", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <InvestorRedistributePayoutConfirmLayout confirm={action("confirm")} deny={action("deny")} />
  ));
