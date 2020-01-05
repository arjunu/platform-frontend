import { storiesOf } from "@storybook/react";
import * as React from "react";

import { WidgetGrid } from "../../layouts/WidgetGrid";
import { ELoadingIndicator, LoadingIndicator, LoadingIndicatorContainer } from "./LoadingIndicator";

storiesOf("LoadingIndicator", module)
  .add("pulse (default)", () => <LoadingIndicator />)
  .add("pulse light", () => <LoadingIndicator type={ELoadingIndicator.PULSE} light={true} />)
  .add("pulse white", () => <LoadingIndicator type={ELoadingIndicator.PULSE_WHITE} />)
  .add("pulse white light", () => (
    <LoadingIndicator type={ELoadingIndicator.PULSE_WHITE} light={true} />
  ))
  .add("blocks", () => <LoadingIndicator type={ELoadingIndicator.BLOCKS} />)
  .add("hexagon", () => <LoadingIndicator type={ELoadingIndicator.HEXAGON} />)
  .add("spinner", () => <LoadingIndicator type={ELoadingIndicator.SPINNER} />)
  .add("spinner small", () => <LoadingIndicator type={ELoadingIndicator.SPINNER_SMALL} />)
  .add("as container", () => (
    <WidgetGrid>
      <LoadingIndicatorContainer type={ELoadingIndicator.PULSE} />
    </WidgetGrid>
  ));
