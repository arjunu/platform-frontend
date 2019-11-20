import * as cn from "classnames";
import { Moment } from "moment";
import * as React from "react";

import { TTranslatedString } from "../../types";
import { FancyTimeLeft } from "./TimeLeft.unsafe";
import { calculateTimeLeft, localTime, timeZone, utcTime, weekdayLocal, weekdayUTC } from "./utils";

import * as styles from "./TimeLeftWithUTC.module.scss";

interface IProps {
  countdownDate: Date | Moment;
  label?: TTranslatedString;
}

const TimeLeftWithUTC: React.FunctionComponent<IProps> = ({ countdownDate, label }) => {
  const timeLeft = calculateTimeLeft(countdownDate, true) > 0;

  return (
    <div className={styles.timeLeft}>
      {label && <span className={styles.label}>{label}</span>}
      <FancyTimeLeft finalTime={countdownDate} asUtc={true} refresh={true} />
      <table className={cn(styles.date, { [styles.dateBold]: !timeLeft })}>
        <tbody>
          <tr>
            <td>UTC:</td>
            <td data-test-id="time-left.start-date-utc">{`${weekdayUTC(countdownDate)}, ${utcTime(
              countdownDate,
            )}`}</td>
          </tr>
          <tr>
            <td>{`${timeZone()}: `}</td>
            <td>{`${weekdayLocal(countdownDate)}, ${localTime(countdownDate)}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { TimeLeftWithUTC };
