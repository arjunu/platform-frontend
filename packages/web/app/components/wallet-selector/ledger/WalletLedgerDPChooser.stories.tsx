import { dummyIntl } from "@neufund/shared";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { DEFAULT_DERIVATION_PATH_PREFIX } from "../../../modules/wallet-selector/ledger-wizard/reducer";
import { DPChooserComponent } from "./WalletLedgerDPChooser";

const initialState = {
  derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
  onDerivationPathPrefixChange: () => {},
  intl: dummyIntl,
  errorMessage: null,
};

const errorState = {
  derivationPathPrefix: "incorrect derivation path",
  onDerivationPathPrefixChange: () => {},
  intl: dummyIntl,
  errorMessage: "visible error",
};

storiesOf("Ledger/WalletLedgerDPChooser", module)
  .add("initial", () => <DPChooserComponent {...initialState} />)
  .add("visible error", () => <DPChooserComponent {...errorState} />);
