import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TokenIcon } from "./TokenIcon";

import * as tokenIcon from "../../../assets/img/token_icon.svg";

storiesOf("TokenIcon", module).add("default", () => <TokenIcon srcSet={{ "1x": tokenIcon }} />);
