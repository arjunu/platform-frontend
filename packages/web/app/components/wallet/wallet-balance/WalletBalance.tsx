import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { IPanelProps, Panel } from "../../shared/Panel";

import * as styles from "./WalletBalance.module.scss";

export interface IWalletValues {
  ethAmount: string;
  ethEuroAmount: string;
  neuroAmount: string;
  neuroEuroAmount: string;
  totalEuroAmount: string;
}

export const WalletBalanceContainer: React.FunctionComponent<IPanelProps &
  CommonHtmlProps & {
    data?: IWalletValues;
  }> = ({ headerText, className, children, columnSpan }) => (
  <Panel
    headerText={headerText}
    className={cn(className, "d-flex flex-column")}
    columnSpan={columnSpan}
  >
    <div className={styles.wrapper}>{children}</div>
  </Panel>
);
