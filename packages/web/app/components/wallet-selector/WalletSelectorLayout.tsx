import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { StaticContext } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { externalRoutes } from "../../config/externalRoutes";
import { EUserType } from "../../lib/api/users/interfaces";
import { ELogoutReason } from "../../modules/auth/types";
import { ENotificationText, ENotificationType } from "../../modules/notifications/reducer";
import { TLoginRouterState } from "../../modules/routing/types";
import { appRoutes } from "../appRoutes";
import { Button, ButtonLink, EButtonLayout } from "../shared/buttons";
import { ExternalLink } from "../shared/links";
import { Notification } from "../shared/notification-widget/Notification";
import { WalletRouter } from "./WalletRouter";
import { WalletSelectorContainer } from "./WalletSelectorContainer";

import * as styles from "./WalletSelectorLayout.module.scss";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

interface IExternalProps {
  rootPath: string;
  isLoginRoute: boolean;
  oppositeRoute: string;
  userType: string;
  openICBMModal: () => void;
  isSecretProtected: boolean;
  logoutReason: ELogoutReason | undefined;
  hideLogoutReason: () => Partial<{ logoutReason: ELogoutReason | undefined }> | undefined;
}

interface ISelectTitleProps {
  isLoginRoute: boolean;
  walletSelectionDisabled: boolean;
}

const SelectTitle: React.FunctionComponent<ISelectTitleProps> = ({
  isLoginRoute,
  walletSelectionDisabled,
}) => {
  if (walletSelectionDisabled) {
    return <FormattedMessage id="wallet-selector.tabs.register.title.no-wallet-selection" />;
  } else if (isLoginRoute) {
    return <FormattedMessage id="wallet-selector.tabs.login.title" />;
  } else {
    return <FormattedMessage id="wallet-selector.tabs.register.title" />;
  }
};

export const WalletSelectorLayout: React.FunctionComponent<IExternalProps & TRouteLoginProps> = ({
  rootPath,
  isLoginRoute,
  oppositeRoute,
  userType,
  openICBMModal,
  isSecretProtected,
  logoutReason,
  hideLogoutReason,
  location,
}) => {
  const walletSelectionDisabled =
    userType === EUserType.NOMINEE ||
    (userType === EUserType.ISSUER && process.env.NF_ISSUERS_CAN_LOGIN_WITH_ANY_WALLET !== "1");

  return (
    <WalletSelectorContainer data-test-id="wallet-selector">
      {logoutReason === ELogoutReason.SESSION_TIMEOUT && (
        <Notification
          data-test-id="wallet-selector-session-timeout-notification"
          text={ENotificationText.AUTH_SESSION_TIMEOUT}
          type={ENotificationType.WARNING}
          onClick={hideLogoutReason}
        />
      )}

      <Row>
        <Col tag="section" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
          <h1 className={cn(styles.walletChooserTitle, "my-4", "text-center")}>
            <SelectTitle
              walletSelectionDisabled={walletSelectionDisabled}
              isLoginRoute={isLoginRoute}
            />
          </h1>

          {!walletSelectionDisabled && (
            <div className={styles.walletChooserButtons}>
              <div className="m-2">
                <ButtonLink data-test-id="wallet-selector-light" to={`${rootPath}/light`}>
                  {isLoginRoute ? (
                    <FormattedMessage id="wallet-selector.tabs.neuwallet-login" />
                  ) : (
                    <FormattedMessage id="wallet-selector.tabs.neuwallet-register" />
                  )}
                </ButtonLink>
              </div>

              <div className="m-2">
                <ButtonLink data-test-id="wallet-selector-browser" to={`${rootPath}/browser`}>
                  {isLoginRoute ? (
                    <FormattedMessage id="wallet-selector.tabs.browser-wallet-login" />
                  ) : (
                    <FormattedMessage id="wallet-selector.tabs.browser-wallet-register" />
                  )}
                </ButtonLink>
              </div>

              <div className="m-2">
                <ButtonLink data-test-id="wallet-selector-ledger" to={`${rootPath}/ledger`}>
                  {isLoginRoute ? (
                    <FormattedMessage id="wallet-selector.tabs.ledger-login" />
                  ) : (
                    <FormattedMessage id="wallet-selector.tabs.ledger-register" />
                  )}
                </ButtonLink>
              </div>
            </div>
          )}

          {userType === EUserType.INVESTOR && (
            <p className="text-center mt-4">
              <FormattedMessage
                id="wallet-selector.tabs.icbm-help-text"
                values={{
                  here: (
                    <Button onClick={openICBMModal} layout={EButtonLayout.INLINE}>
                      <strong>
                        <FormattedMessage id="wallet-selector.tabs.icbm-help-text.here" />
                      </strong>
                    </Button>
                  ),
                }}
              />
            </p>
          )}
        </Col>
      </Row>

      <section className="mt-4">
        <WalletRouter rootPath={rootPath} locationState={location.state} />
      </section>

      <Row className="mt-5">
        <Col sm={12} md={6} className="text-center text-md-left">
          {isLoginRoute ? (
            <>
              <FormattedMessage id="wallet-selector.login.help-link" />{" "}
              <Link to={appRoutes.restore}>
                <strong>
                  <FormattedMessage id="wallet-selector.help-link.login.label" />
                </strong>
              </Link>
            </>
          ) : (
            <>
              <FormattedMessage id="wallet-selector.register.help-link" />{" "}
              <ExternalLink href={externalRoutes.neufundSupportHome}>
                <strong>
                  <FormattedMessage id="wallet-selector.help-link.register.label" />
                </strong>
              </ExternalLink>
            </>
          )}
        </Col>
        {!isSecretProtected && (
          <Col sm={12} md={6} className="text-center text-md-right mt-3 mt-md-0">
            {isLoginRoute ? (
              <FormattedMessage id="wallet-selector.neuwallet.register-link-text" />
            ) : (
              <FormattedMessage id="wallet-selector.neuwallet.login-link-text" />
            )}{" "}
            <Link to={oppositeRoute} data-test-id="wallet-selector-opposite-route-link">
              <strong>
                {isLoginRoute ? (
                  <FormattedMessage id="wallet-selector.register" />
                ) : (
                  <FormattedMessage id="wallet-selector.login" />
                )}
              </strong>
            </Link>
          </Col>
        )}
      </Row>
    </WalletSelectorContainer>
  );
};
