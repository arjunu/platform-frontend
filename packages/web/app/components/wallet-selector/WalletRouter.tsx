import { createLocation } from "history";
import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { SwitchConnected } from "../../utils/react-connected-components/connectedRouting";
import { WalletBrowser } from "./browser/WalletBrowser";
import { WalletLedger } from "./ledger/WalletLedger";
import { WalletLight } from "./light/WalletLight";
import { getRedirectionUrl } from "./walletRouterHelpers";

interface IProps {
  rootPath: string;
  // we don't care here about exact type
  locationState: unknown;
}

export const WalletRouter: React.FunctionComponent<IProps> = ({ rootPath, locationState }) => (
  <SwitchConnected>
    <Route path={`${rootPath}/light`} component={WalletLight} exact />
    <Route path={`${rootPath}/browser`} component={WalletBrowser} exact />
    <Route path={`${rootPath}/ledger`} component={WalletLedger} exact />
    {/* Preserve location state after redirect, otherwise session timeout message won't work */}
    <Redirect to={createLocation(getRedirectionUrl(rootPath), locationState)} />
  </SwitchConnected>
);
