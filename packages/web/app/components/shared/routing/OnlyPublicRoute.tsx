import * as React from "react";
import { Redirect, RouteProps } from "react-router-dom";
import { branch, compose, renderComponent, renderNothing } from "recompose";

import { selectIsAuthorized } from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { appRoutes } from "../../appRoutes";

interface IStateProps {
  isAuthorized: boolean;
}

interface IComponentProps {
  isAuthorized: boolean;
  component: React.ElementType;
}

const OnlyPublicRouteComponent: React.FunctionComponent<IComponentProps> = ({
  component: Component,
  ...rest
}) => <Component {...rest} />;

export const OnlyPublicRoute = compose<IComponentProps, RouteProps>(
  appConnect<IStateProps, {}, RouteProps>({
    stateToProps: s => ({
      isAuthorized: selectIsAuthorized(s.auth),
    }),
  }),
  branch<IStateProps>(
    state => state.isAuthorized,
    renderComponent(() => <Redirect to={appRoutes.dashboard} />),
  ),
  branch<IStateProps & RouteProps>(state => state.component === undefined, renderNothing),
)(OnlyPublicRouteComponent);
