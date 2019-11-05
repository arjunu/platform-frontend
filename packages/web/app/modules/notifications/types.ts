import { AppActionTypes } from "../../store";

export enum ENotificationType {
  INFO = "info",
  WARNING = "warning",
}

export enum ENotificationText {
  COMPLETE_REQUEST_NOTIFICATION = "completeRequestNotification",
  COMPLETE_UPDATE_ACCOUNT = "completeUpdateAccount",
  AUTH_SESSION_TIMEOUT = "authSessionTimeout",
  NOT_ACCREDITED_INVESTOR = "notAccreditedInvestor",
}

export interface INotification {
  id: number;
  type: ENotificationType;
  text: ENotificationText;
  onClickAction: AppActionTypes;
}
