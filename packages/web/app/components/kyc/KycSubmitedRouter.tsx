import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { EUserType } from "../../lib/api/users/interfaces";
import { SwitchConnected } from "../../utils/react-connected-components/connectedRouting";
import { KYCAdditionalUpload } from "./personal/AdditionalUpload";
import { kycRoutes } from "./routes";
import { KycSuccess } from "./Success";

interface IStateProps {
  userType?: EUserType;
}

export const KycSubmitedRouter: React.FunctionComponent<IStateProps> = () => (
  <SwitchConnected>
    <Route path={kycRoutes.success} component={KycSuccess} exact />
    <Route path={kycRoutes.individualUpload} component={KYCAdditionalUpload} />

    <Redirect to={kycRoutes.success} />
  </SwitchConnected>
);
