import * as React from "react";
import { FormattedDate, FormattedTime } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps, withStateHandlers } from "recompose";

import { EETOStateOnChain } from "../../../../modules/eto/types";
import { TTranslatedString } from "../../../../types";
import { Counter } from "../../../shared/Counter";
import { generalStateToName } from "../../shared/ETOState";

import * as styles from "./CounterWidget.module.scss";

export type TCounterWidgetProps = {
  endDate: Date;
  stateName: TTranslatedString;
  alternativeText?: TTranslatedString;
  setCounterFinished: () => void;
  countdownFinished: boolean;
};

type TExternalProps = {
  endDate: Date;
  awaitedState: EETOStateOnChain;
  alternativeText?: TTranslatedString;
  etoId?: string;
};

type TWithProps = {
  stateName: TTranslatedString;
};

const CounterBase: React.FunctionComponent<TCounterWidgetProps> = ({
  endDate,
  stateName,
  alternativeText,
  setCounterFinished,
  countdownFinished,
}) => (
  <div
    className={styles.counterWidget}
    data-test-id={`eto-whitelist-countdown${countdownFinished ? "-finished" : ""}`}
  >
    <div className={styles.title}>
      {alternativeText ? (
        alternativeText
      ) : (
        <FormattedMessage id="shared-component.eto-overview.count-down-to" values={{ stateName }} />
      )}
    </div>

    <Counter endDate={endDate} onFinish={setCounterFinished} />

    <time className={styles.endsAt} dateTime={endDate.toISOString()}>
      <FormattedMessage
        id="shared-component.eto-overview.ends-at"
        values={{
          date: (
            <FormattedDate
              value={endDate}
              year="numeric"
              month="short"
              day="numeric"
              weekday="long"
            />
          ),
          time: <FormattedTime value={endDate} timeZone="UTC" timeZoneName="short" />,
        }}
      />
    </time>

    {countdownFinished && (
      <p className="mt-2 mb-0">
        <FormattedMessage
          id="shared-component.eto-overview.waiting-for-next-block-with-state"
          values={{ stateName }}
        />
      </p>
    )}
  </div>
);

const CounterWidget = compose<TCounterWidgetProps, TExternalProps>(
  withProps<TWithProps, TExternalProps>(({ awaitedState }) => ({
    stateName: generalStateToName[awaitedState],
  })),
  withStateHandlers(
    {
      countdownFinished: false,
    },
    {
      setCounterFinished: () => () => ({
        countdownFinished: true,
      }),
    },
  ),
)(CounterBase);

export { CounterWidget };
