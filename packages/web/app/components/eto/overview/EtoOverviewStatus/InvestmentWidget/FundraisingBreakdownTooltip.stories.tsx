import { storiesOf } from "@storybook/react";
import * as React from "react";

import { convertToUlps } from "../../../../../utils/NumberUtils";
import { FundraisingBreakdownTooltip } from "./FundraisingBreakdownTooltip";

storiesOf("ETO/Molecules|FundraisingBreakdownTooltip", module).add("default", () => (
  <FundraisingBreakdownTooltip
    isOpen={true}
    etherTokenBalance={convertToUlps("10000")}
    euroTokenBalance={convertToUlps("1000000")}
  />
));
