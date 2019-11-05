import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ENotificationText, ENotificationType } from "../../../modules/notifications/types";
import { Notification } from "./Notification";

storiesOf("Core|Atoms/Notification", module)
  .add("clickable warning", () => (
    <Notification
      text={ENotificationText.COMPLETE_UPDATE_ACCOUNT}
      type={ENotificationType.WARNING}
      onClick={action("click")}
    />
  ))
  .add("warning", () => (
    <Notification
      text={ENotificationText.COMPLETE_UPDATE_ACCOUNT}
      type={ENotificationType.WARNING}
    />
  ))
  .add("info", () => (
    <Notification
      text={ENotificationText.COMPLETE_REQUEST_NOTIFICATION}
      type={ENotificationType.INFO}
    />
  ));
