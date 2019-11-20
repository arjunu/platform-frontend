import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../config/externalRoutes";
import { ENotificationText, ENotificationType } from "../../../modules/notifications/types";
import { TDataTestId } from "../../../types";
import { getHostname } from "../../../utils/StringUtils";
import { Button, ButtonClose, ButtonTextPosition, ButtonWidth, EButtonLayout } from "../buttons";
import { ExternalLink } from "../links/ExternalLink";

import * as infoIcon from "../../../assets/img/notifications/info.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./Notification.module.scss";

export interface INotificationProps {
  type: ENotificationType;
  text: ENotificationText;
  onClick?: () => void;
}

export interface INotificationContentProps {
  type: ENotificationType;
  text: ENotificationText;
}

const icons = {
  [ENotificationType.INFO]: infoIcon,
  [ENotificationType.WARNING]: warningIcon,
};

// TODO: This should not be here. Shared components should not be coupled with business logic
const notificationTexts = {
  [ENotificationText.COMPLETE_REQUEST_NOTIFICATION]: (
    <FormattedMessage id="notifications.complete-request" />
  ),
  [ENotificationText.COMPLETE_UPDATE_ACCOUNT]: (
    <FormattedMessage id="notifications.update-account" />
  ),
  [ENotificationText.AUTH_SESSION_TIMEOUT]: (
    <FormattedMessage id="notifications.auth-session-timeout" />
  ),
  [ENotificationText.NOT_ACCREDITED_INVESTOR]: (
    <FormattedMessage
      id="notifications.not-accredited-investor"
      values={{
        accreditationHref: (
          <ExternalLink href={externalRoutes.accreditationHelp}>
            {getHostname(externalRoutes.accreditationHelp)}
          </ExternalLink>
        ),
        accreditationHrefSecond: (
          <ExternalLink href={externalRoutes.accreditationHelpSecond}>
            {getHostname(externalRoutes.accreditationHelpSecond)}
          </ExternalLink>
        ),
      }}
    />
  ),
};

const NotificationContent: React.FunctionComponent<INotificationContentProps> = ({
  text,
  type,
}) => (
  <div className={cn(styles.notification, type)}>
    <i className={`${styles.iconNotificationType}`}>
      <img src={icons[type]} alt="" />
    </i>
    <span data-test-id="notification-text" className={styles.text}>
      {notificationTexts[text]}
    </span>
  </div>
);

const Notification: React.FunctionComponent<INotificationProps & TDataTestId> = ({
  type,
  text,
  onClick,
  "data-test-id": dataTestId,
}) => (
  <section data-test-id={dataTestId} className={cn(styles.notificationWrapper)}>
    {onClick ? (
      <Button
        data-test-id="notification-button"
        layout={EButtonLayout.SIMPLE}
        width={ButtonWidth.BLOCK}
        textPosition={ButtonTextPosition.LEFT}
        onClick={onClick}
      >
        <NotificationContent text={text} type={type} />
      </Button>
    ) : (
      <NotificationContent text={text} type={type} />
    )}

    {onClick && (
      <ButtonClose className={styles.close} data-test-id="notification-close" onClick={onClick} />
    )}
  </section>
);

export { Notification, NotificationContent };
