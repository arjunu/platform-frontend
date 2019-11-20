import * as cn from "classnames";
import { isEmpty } from "lodash";
import * as React from "react";
import { branch, compose, renderNothing } from "recompose";

import { selectNotificationsWithDerived } from "../../../modules/notifications/selectors";
import { INotification } from "../../../modules/notifications/types";
import { appConnect, AppDispatch } from "../../../store";
import { Notification } from "./Notification";

import * as styles from "./NotificationWidget.module.scss";

interface IExternalProps {
  className?: string;
}

interface IStateProps {
  notifications: readonly INotification[];
}

interface IDispatchProps {
  dispatch: AppDispatch;
}

type IProps = IStateProps & IDispatchProps;

const NotificationWidgetComponent: React.FunctionComponent<IProps & IExternalProps> = ({
  notifications,
  dispatch,
  className,
}) => (
  <div className={cn(styles.widget, className)}>
    {notifications.map((notification, index) => (
      <Notification
        key={notification.text + index.toString(10)}
        type={notification.type}
        text={notification.text}
        onClick={() => dispatch(notification.onClickAction)}
      />
    ))}
  </div>
);

export const NotificationWidget = compose<IProps, IExternalProps>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      notifications: selectNotificationsWithDerived(state),
    }),
  }),
  branch<IStateProps>(props => isEmpty(props.notifications), renderNothing),
)(NotificationWidgetComponent);
