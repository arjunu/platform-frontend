import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";

import { withMockedDate, withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { SetEtoDateSummaryComponent } from "./SetDateSummary";

const dummyNow = new Date("2019-03-10T05:03:56+02:00");
const date = moment.utc(dummyNow).add(5, "month");
const changeableTill = date.clone().subtract(3, "days");

const data = {
  etoTermsAddress: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  equityTokenAddress: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  offeringAgreementIPFSLink: "https://ipfs.io/123123",
  etoCommitmentAddress: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  termsAgreementIPFSLink: "https://ipfs.io/789789",
  additionalData: {
    newStartDate: date.valueOf(),
  },
  onAccept: action("onAccept"),
  changeableTill,
};

storiesOf("ETO-Flow/SetStartDateSummary", module)
  .addDecorator(withModalBody())
  .addDecorator(withMockedDate(dummyNow))
  .add("default", () => <SetEtoDateSummaryComponent {...data} />);
