import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../../test/fixtures";
import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { EtoInvestmentTermsWidgetLayout } from "./EtoInvestmentTermsWidget";

const eto: TEtoWithCompanyAndContractReadonly = {
  ...testEto,
  preMoneyValuationEur: 10000,
  existingShareCapital: 10,
  equityTokensPerShare: 10,
  publicDiscountFraction: 0.2,
  whitelistDiscountFraction: 0.3,
};

storiesOf("ETO/EtoInvestmentTermsWidget", module)
  .add("user fully verified", () => (
    <EtoInvestmentTermsWidgetLayout
      eto={eto}
      downloadDocument={action("downloadDocument")}
      isUserFullyVerified={true}
    />
  ))
  .add("guest or not verified", () => (
    <EtoInvestmentTermsWidgetLayout
      eto={eto}
      downloadDocument={action("downloadDocument")}
      isUserFullyVerified={false}
    />
  ));
