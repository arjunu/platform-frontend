import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ButtonClose } from "./ButtonIcon";

storiesOf("NDS|Atoms/ButtonIcons", module).add("close icon", () => (
  <ButtonClose onClick={action("onClick")} />
));
