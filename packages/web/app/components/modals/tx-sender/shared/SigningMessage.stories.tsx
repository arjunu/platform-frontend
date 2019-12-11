import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { SigningMessage } from "./SigningMessage";

storiesOf("SigningMessage", module)
  .addDecorator(withModalBody())
  .add("default", () => <SigningMessage />);
