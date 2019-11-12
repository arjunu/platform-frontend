import * as React from "react";

import { EColumnSpan } from "../../layouts/Container";
import { Panel } from "../../shared/Panel";
import { MyNeuWidget } from "./my-neu-widget/MyNeuWidget";
import { PayoutWidget } from "./my-portfolio-widget/PayoutWidget";

import * as styles from "./MyPortfolioWidget.module.scss";

export const MyPortfolioWidget: React.FunctionComponent = () => (
  <Panel className={styles.myPortfolioWidget} columnSpan={EColumnSpan.TWO_COL}>
    <PayoutWidget />
    <MyNeuWidget />
  </Panel>
);
