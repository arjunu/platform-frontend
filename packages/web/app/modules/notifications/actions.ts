import { createActionFactory } from "@neufund/shared";

import { AppActionTypes } from "../../store";
import { ENotificationText, ENotificationType } from "./types";

export interface INewNotification {
  id?: number;
  type: ENotificationType;
  text: ENotificationText;
  onClickAction?: AppActionTypes;
}

export const notificationActions = {
  notificationAdd: createActionFactory("NOTIFICATIONS_ADD", (notification: INewNotification) => ({
    notification,
  })),

  notificationRemove: createActionFactory("NOTIFICATIONS_REMOVE", (id: number) => ({ id })),
};
