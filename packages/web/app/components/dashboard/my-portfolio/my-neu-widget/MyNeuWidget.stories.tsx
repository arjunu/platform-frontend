import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Q18 } from "../../../../config/constants";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { MyNeuWidgetLayout, MyNeuWidgetLayoutWrapper } from "./MyNeuWidget";
import { MyNeuWidgetError } from "./MyNeuWidgetError";

storiesOf("MyNeuWidget", module)
  .add("with funds", () => (
    <MyNeuWidgetLayoutWrapper>
      <MyNeuWidgetLayout balanceNeu={Q18.mul("123").toString()} balanceEur="5947506" />
    </MyNeuWidgetLayoutWrapper>
  ))
  .add("loading", () => (
    <MyNeuWidgetLayoutWrapper>
      <LoadingIndicator />
    </MyNeuWidgetLayoutWrapper>
  ))
  .add("error", () => (
    <MyNeuWidgetLayoutWrapper>
      <MyNeuWidgetError error="there was an error" />
    </MyNeuWidgetLayoutWrapper>
  ));
