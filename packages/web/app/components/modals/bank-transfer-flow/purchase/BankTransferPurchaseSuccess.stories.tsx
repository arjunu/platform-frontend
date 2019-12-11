import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { BankTransferPurchaseSuccessLayout } from "./BankTransferPurchaseSuccess";

const summaryData = {
  goToWallet: action("goToWallet"),
};

storiesOf("BankTransferPurchaseSuccess", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferPurchaseSuccessLayout {...summaryData} />);
