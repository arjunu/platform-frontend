import { storiesOf } from "@storybook/react";
import * as React from "react";

import { CounterLayout } from "./Counter";

storiesOf("Counter", module)
  .add("default", () => <CounterLayout timeLeft={4567341345687} />)
  .add("blink", () => <CounterLayout blink={true} timeLeft={0} />);
