import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";

import { Q18 } from "../../../../config/constants";
import { withMockedDate, withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { BankTransferRedeemSuccessComponent } from "./BankTransferRedeemSuccess";

const dummyNow = new Date("10/3/2019");
const date = moment.utc(dummyNow).subtract(1, "day");

const props = {
  txHash: "0xdb3c43a0cfc4e221ecb52655eab3c3b88ba521a",
  additionalData: {
    amount: "20.50",
    bankFee: Q18.mul("0.005").toString(),
    bankAccount: {
      bankName: "mBank",
      accountNumberLast4: "1234",
    },
  },
  txTimestamp: date.valueOf(),
  goToWallet: action("goToWallet"),
};

storiesOf("BankTransferRedeem/Success", module)
  .addDecorator(withModalBody())
  .addDecorator(withMockedDate(dummyNow))
  .add("default", () => <BankTransferRedeemSuccessComponent {...props} />);
