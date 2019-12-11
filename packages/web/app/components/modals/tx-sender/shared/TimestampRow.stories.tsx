import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";

import { withMockedDate } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { TimestampRow } from "./TimestampRow";

const dummyNow = new Date(2018, 11, 17);
const date = moment.utc(dummyNow).subtract(1, "day");

storiesOf("TimestampRow", module)
  .addDecorator(withMockedDate(dummyNow))
  .add("default", () => <TimestampRow timestamp={date.valueOf()} />);
