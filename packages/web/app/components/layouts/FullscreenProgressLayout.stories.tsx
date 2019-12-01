import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { FullscreenProgressLayout } from "./FullscreenProgressLayout";

storiesOf("Templates|Layouts/FullscreenProgressLayout", module)
  .add("default", () => <FullscreenProgressLayout>Dummy content</FullscreenProgressLayout>)
  .add("default with progress", () => (
    <FullscreenProgressLayout progress={50}>Dummy content</FullscreenProgressLayout>
  ))
  .add("with action", () => (
    <FullscreenProgressLayout title={"Test"} action={action("CLICK")}>
      Dummy content
    </FullscreenProgressLayout>
  ))
  .add("with action and progress", () => (
    <FullscreenProgressLayout progress={50} title={"Test"} action={action("CLICK")}>
      Dummy content
    </FullscreenProgressLayout>
  ));
