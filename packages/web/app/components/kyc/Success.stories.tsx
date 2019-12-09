import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { KycSuccessLayout } from "./Success";

storiesOf("molecules|KYC/Success", module).add("default", () => (
  <KycSuccessLayout
    goToAddAdditional={action("GO_TO_ADDITIONAL")}
    goToDashboard={action("GO_TO_DASHBOARD")}
  />
));
