import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ButtonArrowLeft, ButtonArrowRight, ButtonClose } from "./CommonButtons";

storiesOf("NDS|Atoms/CommonButtons", module)
  .add("button close", () => <ButtonClose onClick={action("onClick")} />)
  .add("button arrow right", () => <ButtonArrowRight>Arrow Right</ButtonArrowRight>)
  .add("button arrow left", () => <ButtonArrowLeft>Arrow Left</ButtonArrowLeft>);
