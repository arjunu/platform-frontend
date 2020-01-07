import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ActionRequired, EActionRequiredPosition } from "./ActionRequired";
import { InlineIcon } from "./icons/InlineIcon";

import iconFingerprint from "../../assets/img/inline_icons/icon-menu-fingerprint.svg";

storiesOf("ActionRequired", module)
  .add("default (active and top)", () => (
    <ActionRequired active={true}>
      <InlineIcon svgIcon={iconFingerprint} width="30px" height="30px" />
    </ActionRequired>
  ))
  .add("active and bottom", () => (
    <ActionRequired active={true} position={EActionRequiredPosition.BOTTOM}>
      <InlineIcon svgIcon={iconFingerprint} width="30px" height="30px" />
    </ActionRequired>
  ))
  .add("not active", () => (
    <ActionRequired active={false} position={EActionRequiredPosition.TOP}>
      <InlineIcon svgIcon={iconFingerprint} width="30px" height="30px" />
    </ActionRequired>
  ));
