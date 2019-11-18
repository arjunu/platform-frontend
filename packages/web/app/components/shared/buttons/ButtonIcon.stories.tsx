import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ButtonIcon } from "./ButtonIcon";

import * as iconDownload from "../../../assets/img/inline_icons/download.svg";

storiesOf("buttons/ButtonIcon", module)
  .add("default", () => <ButtonIcon svgIcon={iconDownload} onClick={action("onClick")} />)
  .add("disabled", () => (
    <ButtonIcon disabled={true} svgIcon={iconDownload} onClick={action("onClick")} />
  ));
