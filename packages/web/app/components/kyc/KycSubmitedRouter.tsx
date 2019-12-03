import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { EUserType } from "../../lib/api/users/interfaces";
import { selectUserType } from "../../modules/auth/selectors";
import { appConnect } from "../../store";
import { SwitchConnected } from "../../utils/connectedRouting";
import { KYCPersonalUpload } from "./personal/Upload";
import { kycRoutes } from "./routes";
import { KycSuccess } from "./Success";

interface IStateProps {
  userType?: EUserType;
}

export const KycSubmitedRouterComponent: React.FunctionComponent<IStateProps> = ({ userType }) => {
  if (userType !== EUserType.INVESTOR) {
    return null;
  }
  return (
    <SwitchConnected>
      <Route path={kycRoutes.success} component={KycSuccess} exact />
      <Route path={kycRoutes.individualUpload} component={KYCPersonalUpload} />

      <Redirect to={kycRoutes.success} />
    </SwitchConnected>
  );
};
export const KycSubmitedRouter = appConnect<IStateProps, {}>({
  stateToProps: s => ({
    userType: selectUserType(s),
  }),
})(KycSubmitedRouterComponent);
