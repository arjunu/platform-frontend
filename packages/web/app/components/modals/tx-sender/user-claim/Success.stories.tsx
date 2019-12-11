import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";

import { withMockedDate, withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { UserClaimSuccessComponent } from "./Success";

const dummyNow = new Date("10/3/2019");
const date = moment.utc(dummyNow).subtract(1, "day");

const props = {
  additionalData: {
    etoId: "0xfaDa8f267C054f469b52Ccbeb08250ACAAeE65dc",
    costUlps: "1200000000000000000",
    neuRewardUlps: "5500000000000000000",
    tokenName: "Fifth Force",
    tokenQuantity: 100,
  },
  txTimestamp: date.valueOf(),
  goToPortfolio: action("goToPortfolio"),
};

storiesOf("User Claim success", module)
  .addDecorator(withModalBody())
  .addDecorator(withMockedDate(dummyNow))
  .add("default", () => <UserClaimSuccessComponent {...props} />);
