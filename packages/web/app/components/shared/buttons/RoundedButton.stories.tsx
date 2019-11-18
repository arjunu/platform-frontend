import { storiesOf } from "@storybook/react";
import * as React from "react";

import { CircleButton, CircleButtonIcon, CircleButtonWarning } from "./RoundedButton";

import * as download from "../../../assets/img/inline_icons/download.svg";

storiesOf("buttons/RoundedButton", module)
  .add("CircleButton", () => <CircleButton>Click me</CircleButton>)
  .add("CircleButtonWarning", () => <CircleButtonWarning>You sure to do this?</CircleButtonWarning>)
  .add("CircleButtonIcon", () => (
    <>
      <CircleButtonIcon svgIcon={download} />
      <br />
      <br />
      <CircleButtonIcon svgIcon={download} disabled={true} />
    </>
  ));
