import { AppActionTypes } from "../../store";
import { TTranslatedString } from "../../types";

export enum ENotificationType {
  INFO = "info",
  WARNING = "warning",
}

export interface INotification {
  id: number;
  type: ENotificationType;
  text: TTranslatedString;
  onClickAction: AppActionTypes;
}
