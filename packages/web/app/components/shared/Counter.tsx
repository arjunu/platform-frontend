import * as cn from "classnames";
import * as moment from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps, TDataTestId } from "../../types";
import { TimeBasedComponentSwitcher } from "../eto/shared/TimeBasedComponentSwitcher";

import * as styles from "./Counter.module.scss";

interface IProps {
  endDate: Date;
  onFinish?: () => void;
  ["data-test-id"]?: string;
}

type TCounterLayoutProps = {
  className?: string;
  timeLeft: number;
  blink?: boolean;
};

interface IPlateProps {
  value: number;
  label: React.ReactNode | string;
  blink?: boolean;
}

const Plate: React.FunctionComponent<IPlateProps> = ({ value, label, blink = false }) => (
  <div className={styles.wrapper}>
    <div className={cn(styles.plate, { [styles.blink]: blink })}>{value}</div>
    <div className={styles.label}>{label}</div>
  </div>
);

export const CounterLayout: React.FunctionComponent<TCounterLayoutProps & TDataTestId> = ({
  className,
  "data-test-id": dataTestId,
  timeLeft,
  blink,
}) => {
  const span = moment.duration(timeLeft, "ms");
  return (
    <div className={cn(styles.counter, className)} data-test-id={dataTestId}>
      <Plate
        blink={blink}
        value={span.days()}
        label={<FormattedMessage id="counter.label.days" />}
      />
      {":"}
      <Plate
        blink={blink}
        value={span.hours()}
        label={<FormattedMessage id="counter.label.hours" />}
      />
      {":"}
      <Plate
        blink={blink}
        value={span.minutes()}
        label={<FormattedMessage id="counter.label.minutes" />}
      />
      {":"}
      <Plate
        blink={blink}
        value={span.seconds()}
        label={<FormattedMessage id="counter.label.seconds" />}
      />
    </div>
  );
};

export const Counter: React.FunctionComponent<IProps & CommonHtmlProps> = ({
  onFinish,
  endDate,
  className,
  "data-test-id": dataTestId,
}) => (
  <TimeBasedComponentSwitcher
    endDate={endDate}
    onFinish={onFinish}
    timerRunningComponent={timeLeft => (
      <CounterLayout className={className} timeLeft={timeLeft} data-test-id={dataTestId} />
    )}
    timerFinishedComponent={timeLeft => (
      <CounterLayout
        className={className}
        timeLeft={timeLeft}
        data-test-id={dataTestId}
        blink={true}
      />
    )}
  />
);
