import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ButtonInline } from "./ButtonInline";

storiesOf("NDS|Atoms/ButtonInline", module).add("default", () => (
  <>
    <ButtonInline>normal</ButtonInline>
    <br />
    <br />
    <ButtonInline autoFocus>focused</ButtonInline>
    <br />
    <br />
    <ButtonInline disabled>disabled</ButtonInline>
  </>
));
