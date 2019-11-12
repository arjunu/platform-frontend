import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withMockedDate } from "../../../utils/storybookHelpers.unsafe";
import { EtoStartDateWidgetComponent } from "./ChooseEtoStartDateWidget";

const TEST_OFFSET_PERIOD = 604800; //7 days

const data = {
  setEtoDate: action("setEtoDate"),
  uploadDate: action("uploadDate"),
  cleanup: action("cleanup"),
  minOffsetPeriod: TEST_OFFSET_PERIOD,
  newDateSaving: false,
  transactionMining: false,
  issuerEtoLoading: false,
  areAgreementsSignedByNominee: true,
  canChangeEtoStartDate: true,
};

const dummyNow = new Date("2021-12-31T05:03:56.000Z");

storiesOf("ETO-Flow/ChooseEtoStartDateWidget", module)
  .addDecorator(withMockedDate(dummyNow))
  .add("starting date haven't been set yet", () => <EtoStartDateWidgetComponent {...data} />)
  .add("starting date may be changed", () => (
    <EtoStartDateWidgetComponent {...data} etoDate={new Date("2028-12-20")} />
  ))
  .add("starting date cannot be changed anymore", () => (
    <EtoStartDateWidgetComponent
      {...data}
      etoDate={new Date("2018-12-24")}
      canChangeEtoStartDate={false}
    />
  ));
