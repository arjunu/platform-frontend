import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ButtonReset } from "./ButtonReset";

storiesOf("NDS|Atoms/ButtonReset", module).add("default", () => (
  <>
    <ButtonReset>Normal</ButtonReset>
    <br />
    <br />
    <ButtonReset autoFocus>Focused</ButtonReset>
    <br />
    <br />
    <ButtonReset disabled>Disabled</ButtonReset>
  </>
));
