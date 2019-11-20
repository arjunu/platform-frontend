import { compose, withProps } from "recompose";

import { investorMenuData } from "../MenuData";
import { IMenuDataByUserType, IMobileMenuExternalProps } from "./MobileMenu";
import { MobileMenuInternal } from "./MobileMenuInternal";

export const InvestorMobileMenu = compose<
  IMenuDataByUserType & IMobileMenuExternalProps,
  IMobileMenuExternalProps
>(
  withProps<IMenuDataByUserType, {}>({ menuDataByUserType: investorMenuData() }),
)(MobileMenuInternal);
