import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { FullscreenLayout } from "./FullscreenLayout";

storiesOf("Templates|Layouts/FullscreenLayout", module)
  .add("default", () => <FullscreenLayout>Dummy content</FullscreenLayout>)
  .add("with action", () => (
    <FullscreenLayout title={"Test"} action={action("CLICK")}>
      Dummy content
    </FullscreenLayout>
  ));
