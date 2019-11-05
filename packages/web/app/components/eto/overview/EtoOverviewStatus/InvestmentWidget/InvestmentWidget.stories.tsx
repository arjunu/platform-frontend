import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../../../../test/fixtures";
import { withMockedDate } from "../../../../../utils/storybookHelpers.unsafe";
import { InvestmentWidgetLayout } from "./InvestmentWidget";

const defaultProps = {
  eto: testEto,
  startInvestmentFlow: action("startInvestmentFlow"),
  nextStateDate: new Date("10/3/2019"),
};

storiesOf("ETO/InvestmentWidget", module)
  .addDecorator(withMockedDate(new Date("10/1/2019")))

  .add("authorized, investor, allowed to invest, not embedded", () => (
    <InvestmentWidgetLayout
      {...defaultProps}
      isEmbedded={false}
      isAuthorized={true}
      isInvestor={true}
      isAllowedToInvest={true}
    />
  ))
  .add("embedded", () => (
    <InvestmentWidgetLayout
      {...defaultProps}
      isEmbedded={true}
      isAuthorized={true}
      isInvestor={true}
      isAllowedToInvest={true}
      nextStateDate={new Date("10/3/2019")}
    />
  ))
  .add("not authorized, not embedded", () => (
    <InvestmentWidgetLayout
      {...defaultProps}
      isEmbedded={false}
      isAuthorized={false}
      isInvestor={false}
      isAllowedToInvest={false}
    />
  ))
  .add("authorized, investor, not allowed to invest, not embedded", () => (
    <InvestmentWidgetLayout
      {...defaultProps}
      isEmbedded={false}
      isAuthorized={true}
      isInvestor={true}
      isAllowedToInvest={false}
    />
  ));
