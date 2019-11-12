import * as H from "history";
import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../../types";
import { makeTid } from "../../../utils/tidUtils";
import { EColumnSpan } from "../../layouts/Container";
import { ButtonArrowRight, ButtonLink } from "../buttons";
import { LoadingIndicator } from "../loading-indicator/LoadingIndicator";
import { Panel } from "../Panel";

import * as styles from "./DashboardWidget.module.scss";

type TDashboardCommonProps = {
  title: TTranslatedString;
  text?: TTranslatedString;
  columnSpan?: EColumnSpan;
};

type TDashboardLoadingWidgetExternalProps = {
  columnSpan?: EColumnSpan;
  title: TTranslatedString;
};

type TDashboardWidgetExternalProps = {
  children?: React.ReactNode;
} & TDashboardCommonProps;

type TDashboardLinkWidgetExternalProps = {
  to: H.LocationDescriptor;
  buttonText: TTranslatedString;
} & TDashboardCommonProps;

export const DashboardLoadingWidget: React.FunctionComponent<
  TDashboardLoadingWidgetExternalProps
> = ({ title, columnSpan }) => (
  <Panel headerText={title} columnSpan={columnSpan}>
    <LoadingIndicator />
  </Panel>
);

export const DashboardWidget: React.FunctionComponent<
  TDashboardWidgetExternalProps & TDataTestId
> = ({ title, text, columnSpan, children, "data-test-id": dataTestId }) => (
  <Panel headerText={title} columnSpan={columnSpan} data-test-id={dataTestId}>
    <div className={styles.content}>
      {text && <p className={styles.text}>{text}</p>}
      {children}
    </div>
  </Panel>
);

export const DashboardCenteredWidget: React.FunctionComponent<
  TDashboardWidgetExternalProps & TDataTestId
> = ({ children, ...rest }) => (
  <DashboardWidget {...rest}>
    {children && <div className="d-flex justify-content-center">{children}</div>}
  </DashboardWidget>
);

export const DashboardLinkWidget: React.FunctionComponent<
  TDashboardLinkWidgetExternalProps & TDataTestId
> = ({ to, buttonText, "data-test-id": dataTestId, ...rest }) => (
  <DashboardWidget data-test-id={dataTestId} {...rest}>
    <ButtonLink
      to={to}
      component={ButtonArrowRight}
      data-test-id={makeTid(dataTestId, "call-to-action")}
    >
      {buttonText}
    </ButtonLink>
  </DashboardWidget>
);
