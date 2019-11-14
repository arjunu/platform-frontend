import { storiesOf } from "@storybook/react";
import * as React from "react";

import { RestrictedCountryInvestorMessage } from "./RestrictedCountryInvestorMessage";

storiesOf("ETO/Molecules|RestrictedCountryInvestorMessage", module).add("default", () => (
  <RestrictedCountryInvestorMessage />
));
