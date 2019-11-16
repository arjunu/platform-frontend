import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TDataTestId } from "../../types";

import * as styles from "./Alerts.module.scss";

export const InfoAlert: React.FunctionComponent<TDataTestId & CommonHtmlProps> = ({
  children,
  className,
  "data-test-id": dataTestId,
}) => (
  <div
    data-test-id={dataTestId}
    className={cn(className, styles.alert, styles.alertInfo)}
    role="alert"
  >
    {children}
  </div>
);

export const ErrorAlert: React.FunctionComponent<TDataTestId & CommonHtmlProps> = ({
  children,
  className,
  "data-test-id": dataTestId,
}) => (
  <div
    data-test-id={dataTestId}
    className={cn(className, styles.alert, styles.alertError)}
    role="alert"
  >
    {children}
  </div>
);
