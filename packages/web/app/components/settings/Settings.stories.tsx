import { storiesOf } from "@storybook/react";
import * as React from "react";

import { mockedStore } from "../../../test/fixtures/mockedStore";
import { withStore } from "../../utils/react-connected-components/storeDecorator.unsafe";
import { Settings } from "./Settings";

storiesOf("SettingsWidgets", module)
  .addDecorator(withStore(mockedStore))
  .add("Settings", () => <Settings />);

storiesOf("SettingsWidgetsVerified", module)
  .addDecorator(
    withStore({
      ...mockedStore,
      auth: { ...mockedStore.auth, user: { ...mockedStore.auth!.user, backupCodesVerified: true } },
    }),
  )
  .add("Settings", () => <Settings />);
