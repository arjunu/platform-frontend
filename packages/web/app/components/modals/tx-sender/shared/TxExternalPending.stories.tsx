import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { TxExternalPending } from "./TxExternalPending";

const txData = {
  blockId: 4623487932,
  txHash: "af908098b968d7564564362c51836",
};

storiesOf("TxExternalPending", module)
  .addDecorator(withModalBody())
  .add("default", () => <TxExternalPending {...txData} />);
