import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ErrorAlert, InfoAlert } from "./Alerts";

const lorem =
  "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut unde soluta vero ab magnam sit, libero id veniam? Porro, cupiditate dignissimos. Neque ratione fugit doloremque, explicabo molestias impedit minima dicta.";

storiesOf("NDS|Atoms/Alerts", module)
  .add("InfoAlert", () => <InfoAlert>{lorem}</InfoAlert>)
  .add("ErrorAlert", () => <ErrorAlert>{lorem}</ErrorAlert>);
