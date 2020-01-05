import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../config/externalRoutes";
import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { appRoutes } from "../../appRoutes";
import { EMenuEntryType, TMenuEntry } from "./MenuEntry";

import logoutIcon from "../../../assets/img/inline_icons/logout.svg";

export const menuSeparatorData = (key: string): TMenuEntry => ({
  type: EMenuEntryType.SEPARATOR,
  key,
});

export const accountMenuData = (actionRequired: boolean, logout: Function): TMenuEntry[] => [
  {
    type: EMenuEntryType.LINK,
    key: "settings",
    to: appRoutes.profile,
    menuName: <FormattedMessage id="menu.settings" />,
    actionRequired: actionRequired,
    "data-test-id": "authorized-layout-profile-button",
  },
  {
    type: EMenuEntryType.EXTERNAL_LINK,
    key: "help",
    to: externalRoutes.neufundSupportHome,
    menuName: <FormattedMessage id="menu.help" />,
  },
  {
    type: EMenuEntryType.ACTION,
    key: "logout",
    svgString: logoutIcon,
    menuName: <FormattedMessage id="menu.logout" />,
    onClick: () => logout(),
    "data-test-id": "menu-logout-button",
  },
];

export const investorMenuData = (): TMenuEntry[] => {
  const data = [
    {
      type: EMenuEntryType.LINK,
      key: "investor-dashboard",
      to: appRoutes.dashboard,
      menuName: <FormattedMessage id="menu.dashboard" />,
    },
    {
      type: EMenuEntryType.LINK,
      key: "portfolio",
      to: appRoutes.portfolio,
      menuName: <FormattedMessage id="menu.portfolio" />,
      "data-test-id": "menu-go-to-portfolio",
    },
    {
      type: EMenuEntryType.LINK,
      key: "wallet",
      to: appRoutes.wallet,
      menuName: <FormattedMessage id="menu.wallet" />,
      "data-test-id": "authorized-layout-wallet-button",
    },
  ];
  if (process.env.NF_PORTFOLIO_PAGE_VISIBLE !== "1") {
    return data.filter(entry => entry.key !== "portfolio") as TMenuEntry[];
  } else {
    return data as TMenuEntry[];
  }
};

export const issuerMenuData = (userHasKycAndVerifiedEmail: boolean): TMenuEntry[] => [
  {
    type: EMenuEntryType.LINK,
    key: "issuer-dashboard",
    to: appRoutes.dashboard,
    menuName: <FormattedMessage id="menu.dashboard" />,
  },
  {
    type: EMenuEntryType.LINK,
    key: "eto-page",
    to: appRoutes.etoIssuerView,
    disabled: !userHasKycAndVerifiedEmail,
    menuName: <FormattedMessage id="menu.eto-page" />,
  },
  {
    type: EMenuEntryType.LINK,
    key: "documents",
    to: appRoutes.documents,
    disabled: !userHasKycAndVerifiedEmail,
    menuName: <FormattedMessage id="menu.documents-page" />,
  },
  {
    type: EMenuEntryType.LINK,
    key: "wallet",
    to: appRoutes.wallet,
    menuName: <FormattedMessage id="menu.wallet" />,
    "data-test-id": "authorized-layout-wallet-button",
  },
];

export const nomineeMenuData = (
  nomineeEto: TEtoWithCompanyAndContractReadonly | undefined,
): TMenuEntry[] => [
  {
    type: EMenuEntryType.LINK,
    key: "nominee-dashboard",
    to: appRoutes.dashboard,
    menuName: <FormattedMessage id="menu.dashboard" />,
  },
  {
    type: EMenuEntryType.LINK,
    key: "wallet",
    to: appRoutes.wallet,
    menuName: <FormattedMessage id="menu.wallet" />,
    "data-test-id": "authorized-layout-wallet-button",
  },
  {
    type: EMenuEntryType.LINK,
    key: "campaign",
    to: appRoutes.etoIssuerView,
    disabled: !nomineeEto,
    menuName: <FormattedMessage id="menu.campaign-page" />,
  },
  {
    type: EMenuEntryType.LINK,
    key: "documents",
    to: appRoutes.documents,
    disabled: !nomineeEto,
    menuName: <FormattedMessage id="menu.documents-page" />,
  },
];
