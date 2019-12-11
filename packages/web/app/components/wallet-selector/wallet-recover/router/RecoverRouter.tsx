import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { SwitchConnected } from "../../../../utils/react-connected-components/connectedRouting";
import { LoginHelp } from "../help/LoginHelp";
import { RecoverWallet } from "../recovery/RecoverWallet";
import { RecoverySuccess } from "../success/RecoverySuccess";
import { recoverRoutes } from "./recoverRoutes";

export const RecoverRouter: React.FunctionComponent = () => (
  <SwitchConnected>
    <Route path={recoverRoutes.help} component={LoginHelp} />
    <Route path={recoverRoutes.seed} component={RecoverWallet} />
    <Route path={recoverRoutes.success} component={RecoverySuccess} />
    <Redirect to={recoverRoutes.help} />
  </SwitchConnected>
);
