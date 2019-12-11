import { SwitchProps } from "react-router";
import { NavLink, NavLinkProps, Switch } from "react-router-dom";

import { appConnect } from "../../store";

export const SwitchConnected = appConnect<{}, {}, SwitchProps>({
  stateToProps: s => ({ location: s.router.location }),
})(Switch);

export const NavLinkConnected = appConnect<{}, {}, NavLinkProps>({
  stateToProps: s => ({ location: s.router.location }),
  options: { omitDispatch: true },
})(NavLink);
