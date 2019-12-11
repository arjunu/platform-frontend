import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { BankTransferVerifySuccessLayout } from "./BankTransferVerifySuccess";

const summaryData = {
  goToWallet: action("goToWallet"),
};

storiesOf("BankTransferVerifySuccess", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferVerifySuccessLayout {...summaryData} />);
