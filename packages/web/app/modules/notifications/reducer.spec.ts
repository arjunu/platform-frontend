import { expect } from "chai";

import { actions } from "../actions";
import { INewNotification } from "./actions";
import { notificationsInitState, notificationsReducer } from "./reducer";
import { ENotificationText, ENotificationType } from "./types";

describe("notifications > reducer", () => {
  it("should act on NOTIFICATIONS_ADD", () => {
    const notification: INewNotification = {
      id: 123,
      text: ENotificationText.COMPLETE_UPDATE_ACCOUNT,
      type: ENotificationType.WARNING,
    };
    const action = actions.notifications.notificationAdd(notification);

    const newState = notificationsReducer(notificationsInitState, action);

    expect(newState.notifications).to.be.lengthOf(1);
    expect(newState.notifications[0]).to.include(notification);
  });

  it("should act on NOTIFICATIONS_REMOVE", () => {
    const notification = {
      id: 123,
      text: ENotificationText.COMPLETE_REQUEST_NOTIFICATION,
      type: ENotificationType.WARNING,
    };
    const actionAdd = actions.notifications.notificationAdd(notification);
    const actionRemove = actions.notifications.notificationRemove(notification.id);

    const state = notificationsReducer(notificationsInitState, actionAdd);
    const newState = notificationsReducer(state, actionRemove);

    expect(newState.notifications).to.be.deep.eq([]);
  });
});
