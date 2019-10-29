import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { convertToUlps } from "../../../../utils/NumberUtils";
import { withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { BankTransferVerifyInfoLayout } from "./BankTransferVerifyAgreement";

const props = {
  goToAgreement: action("goToAgreement"),
  minEuroUlps: convertToUlps("1"),
};

storiesOf("BankTransferVerifyAgreement", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferVerifyInfoLayout {...props} />);
