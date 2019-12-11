import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withStore } from "../../../utils/react-connected-components/storeDecorator.unsafe";
import { WalletLedgerNotSupported } from "./WalletLedgerNotSupportedComponent";

storiesOf("Ledger/WalletLedgerNotSupported", module)
  .addDecorator(withStore())
  .add("default", () => <WalletLedgerNotSupported />);
