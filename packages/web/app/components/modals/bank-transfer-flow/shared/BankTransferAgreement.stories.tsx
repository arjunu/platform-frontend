import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { BankTransferVerifyAgreementLayout } from "./BankTransferAgreement";

const props = {
  goToSummary: action("goToSummary"),
  downloadNEurTokenAgreement: action("downloadNEurTokenAgreement"),
};

storiesOf("BankTransferAgreement", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferVerifyAgreementLayout {...props} />);
