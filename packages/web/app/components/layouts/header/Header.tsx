import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { appRoutes } from "../../appRoutes";
import { ButtonLink, EButtonLayout } from "../../shared/buttons/index";
import { walletLoginRoutes, walletRegisterRoutes } from "../../wallet-selector/walletRoutes";
import { Menu } from "../menus/menu/Menu";
import { MobileMenu } from "../menus/mobileMenu/MobileMenu";
import { MyAccountMenu } from "../menus/MyAccountMenu";
import { PendingTransactionStatus } from "./PendingTransactionStatus";

import logoNew from "../../../assets/img/logo_neufund_on_white.svg";
import logoNewTitle from "../../../assets/img/logo_neufund_on_white_title.svg";
import * as styles from "./Header.module.scss";

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

const LoginButton: React.FunctionComponent = () => (
  <ButtonLink
    className={styles.button}
    layout={EButtonLayout.GHOST}
    data-test-id="Header-login"
    to={walletLoginRoutes.light}
  >
    <FormattedMessage id="header.login-button" />
  </ButtonLink>
);

const GetStartedButton: React.FunctionComponent = () => (
  <ButtonLink
    className={styles.button}
    layout={EButtonLayout.PRIMARY}
    data-test-id="Header-register"
    to={walletRegisterRoutes.light}
  >
    <FormattedMessage id="header.get-started-button" />
  </ButtonLink>
);

const HeaderUnauthorized: React.FunctionComponent = () => (
  <div className={styles.headerUnauth}>
    <LogoUnauth />
    <LoginButton />
    <GetStartedButton />
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
