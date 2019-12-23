import * as cn from "classnames";
import * as React from "react";

import { InlineIcon } from "../../shared/icons/InlineIcon";
import { EAccountSetupStepState, IStepComponentProps } from "./types";

import checkMark from "../../../assets/img/inline_icons/icon_check.svg";
import * as styles from "../NomineeDashboard.module.scss";

interface IStepTickerProps {
  stepState: EAccountSetupStepState;
  number: number;
}

interface IExternalProps {
  isLast: boolean;
}

const StepTicker: React.FunctionComponent<IStepTickerProps> = ({ stepState, number }) => {
  switch (stepState) {
    case EAccountSetupStepState.ACTIVE:
      return <div className={cn(styles.ticker, styles.active)}>{number}</div>;
    case EAccountSetupStepState.DONE:
      return (
        <div className={cn(styles.ticker, styles.done)}>
          <InlineIcon svgIcon={checkMark} />
        </div>
      );
    case EAccountSetupStepState.NOT_DONE:
    default:
      return <div className={styles.ticker}>{number}</div>;
  }
};

const AccountSetupStep: React.FunctionComponent<IStepComponentProps & IExternalProps> = ({
  isLast,
  stepState,
  title,
  component,
  number,
}) => (
  <div className={styles.accountSetupStepWrapper}>
    <StepTicker stepState={stepState} number={number} />

    <div className={styles.title}>{title}</div>
    {!isLast && <span className={styles.line} />}

    {stepState === EAccountSetupStepState.ACTIVE ? (
      <div className={styles.componentOpen}>{component}</div>
    ) : (
      <div className={cn(styles.componentClosed, { [styles.last]: isLast })} />
    )}
  </div>
);

export { AccountSetupStep };
