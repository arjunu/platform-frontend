import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Entry } from "./Entry";

storiesOf("Core|Atoms/Entry", module).add("default", () => <Entry label="Lorem" value="Ipsum" />);
