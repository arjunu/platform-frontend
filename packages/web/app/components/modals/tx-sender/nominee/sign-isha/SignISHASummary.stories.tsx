import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../../utils/storybookHelpers.unsafe";
import { SignNomineeISHASummaryLayout } from "./SignISHASummary";

storiesOf("NomineeSignISHA/Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => <SignNomineeISHASummaryLayout onAccept={action("onAccept")} />);
