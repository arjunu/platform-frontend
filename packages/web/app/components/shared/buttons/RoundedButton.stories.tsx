import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EButtonLayout } from "./Button";
import {
  CircleButton,
  CircleButtonIcon,
  CircleButtonWarning,
  RoundedButton,
  UploadButton,
} from "./RoundedButton";

import * as download from "../../../assets/img/inline_icons/download.svg";

storiesOf("buttons/RoundedButton", module)
  .add("RoundedButton", () => (
    <>
      <RoundedButton layout={EButtonLayout.OUTLINE}>Click me</RoundedButton>
      <br />
      <br />
      <RoundedButton layout={EButtonLayout.PRIMARY}>Click me</RoundedButton>
      <br />
      <br />
      <RoundedButton layout={EButtonLayout.PRIMARY}>Click me</RoundedButton>
      <br />
      <br />
      <RoundedButton layout={EButtonLayout.PRIMARY}>Click me</RoundedButton>
      <br />
      <br />
      <RoundedButton layout={EButtonLayout.PRIMARY} disabled={true}>
        Can't click me
      </RoundedButton>
    </>
  ))
  .add("CircleButton", () => <CircleButton>Click me</CircleButton>)
  .add("CircleButtonWarning", () => <CircleButtonWarning>You sure to do this?</CircleButtonWarning>)
  .add("CircleButtonIcon", () => (
    <>
      <CircleButtonIcon svgIcon={download} />
      <br />
      <br />
      <CircleButtonIcon svgIcon={download} disabled={true} />
    </>
  ))
  .add("UploadButton", () => (
    <>
      <UploadButton>Upload!</UploadButton>
      <br />
      <br />
      <UploadButton isDisabled={true}>I'm disabled!</UploadButton>
    </>
  ));
