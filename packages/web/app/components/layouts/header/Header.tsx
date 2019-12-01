import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { appRoutes } from "../../appRoutes";
import { ButtonLink, EButtonTheme } from "../../shared/buttons/index";
import { walletLoginRoutes, walletRegisterRoutes } from "../../wallet-selector/walletRoutes";
import { Menu } from "../menus/menu/Menu";
import { MobileMenu } from "../menus/mobileMenu/MobileMenu";
import { MyAccountMenu } from "../menus/MyAccountMenu";
import { PendingTransactionStatus } from "./PendingTransactionStatus";

import * as logoNew from "../../../assets/img/logo_neufund_on_white.svg";
import * as logoNewTitle from "../../../assets/img/logo_neufund_on_white_title.svg";
import * as styles from "./Header.module.scss";

interface IHeaderButton {
  className: string;
}

const LogoUnauth = () => (
  <Link to={appRoutes.root} className={styles.logoUnauth}>
    <img src={logoNew} alt="NEUFUND" className={styles.logoImage} />
    <img src={logoNewTitle} alt="NEUFUND" className={styles.logoTitle} />
  </Link>
);

const LogoAuth = () => (
  <Link to={appRoutes.root} className={styles.logoAuth}>
    <img src={logoNew} alt="NEUFUND" className={styles.logoImage} />
    <img src={logoNewTitle} alt="NEUFUND" className={styles.logoTitleAuth} />
  </Link>
);

const LoginButton: React.FunctionComponent<IHeaderButton> = ({ className }) => (
  <ButtonLink
    className={className}
    theme={EButtonTheme.DARK_NO_BORDER}
    innerClassName={cn(styles.buttonInner)}
    data-test-id="Header-login"
    isActive={false}
    to={walletLoginRoutes.light}
  >
    <FormattedMessage id="header.login-button" />
  </ButtonLink>
);

const GetStartedButton: React.FunctionComponent<IHeaderButton> = ({ className }) => (
  <ButtonLink
    className={className}
    theme={EButtonTheme.BRAND}
    innerClassName={styles.buttonInner}
    data-test-id="Header-register"
    isActive={false}
    to={walletRegisterRoutes.light}
  >
    <FormattedMessage id="header.get-started-button" />
  </ButtonLink>
);

const HeaderUnauthorized: React.FunctionComponent = () => (
  <div className={styles.headerUnauth}>
    <LogoUnauth />
    <LoginButton className={styles.button} />
    <GetStartedButton className={styles.button} />
  </div>
);

const HeaderTransitional: React.FunctionComponent = () => (
  <div className={styles.headerUnauth}>
    <LogoUnauth />
  </div>
);

const HeaderAuthorized: React.FunctionComponent = () => (
  <div className={styles.headerAuth}>
    <MobileMenu />
    <LogoAuth />
    <Menu />
    <PendingTransactionStatus className={styles.transactionStatus} />
    <MyAccountMenu />
  </div>
);

export { HeaderUnauthorized, HeaderAuthorized, HeaderTransitional, LogoAuth, LogoUnauth };
