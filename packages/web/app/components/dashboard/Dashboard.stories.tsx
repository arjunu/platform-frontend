import { storiesOf } from "@storybook/react";
import * as React from "react";

import { mockedStore } from "../../../test/fixtures/mockedStore";
import { withStore } from "../../utils/react-connected-components/storeDecorator.unsafe";
import { Dashboard } from "./Dashboard";

storiesOf("Dashboard", module)
  .addDecorator(withStore(mockedStore))
  .add("Dashboard", () => <Dashboard />);
