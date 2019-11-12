import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { PublishETOWidgetComponent } from "./PublishETOWidget";

storiesOf("PublishETOWidget", module).add("default", () => (
  <PublishETOWidgetComponent publish={action("publish")} />
));
