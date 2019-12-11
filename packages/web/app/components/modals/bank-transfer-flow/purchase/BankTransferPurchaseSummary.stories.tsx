import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { BankTransferPurchaseLayout } from "./BankTransferPurchaseSummary";

const detailsData = {
  quintessenceBankAccount: {
    name: "Fifth Force GmbH",
    bankAccountNumber: "DE1250094039446384529400565",
    swiftCode: "TLXXXXXXXXX",
    isSepa: false,
    bankName: "ING",
  },
  referenceCode: "NF AGHGCmR3u2SuxdyNPIksxTyAhKM REF 123456789011",
  minAmount: "123456781234567812345678",
  continueToSuccess: action("continueToSuccess"),
};

storiesOf("BankTransferPurchaseLayout", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferPurchaseLayout {...detailsData} />);
