import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { AcceptISHALayout } from "./AcceptIsha";

storiesOf("AcceptIsha", module).add("default", () => <AcceptISHALayout sign={action("sign")} />);
