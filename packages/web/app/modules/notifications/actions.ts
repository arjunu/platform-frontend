import { createActionFactory } from "@neufund/shared";

import { ENotificationText } from "../../components/translatedMessages/messages";
import { AppActionTypes } from "../../store";
import { ENotificationType } from "./types";

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
