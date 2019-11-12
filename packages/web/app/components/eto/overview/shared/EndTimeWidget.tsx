import * as React from "react";
import { FormattedRelative, FormattedTime } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps, TDataTestId } from "../../../../types";
import { isLessThanNDays } from "../../../../utils/DateUtils";
import { TimeBasedComponentSwitcher } from "../../shared/TimeBasedComponentSwitcher";

interface IExternalProps {
  endTime: Date;
}

const EndTimeRunningWidget: React.FunctionComponent<
  IExternalProps & CommonHtmlProps & TDataTestId
> = ({ endTime, ...props }) => (
  <span {...props}>
    <FormattedMessage
      id="shared-component.eto-overview.invest.ends-in"
      values={{
        endsIn: (
          <FormattedRelative
            value={endTime}
            units="day"
            //initial now is necessary for storybook tests
            initialNow={new Date()}
          />
        ),
      }}
    />
    {isLessThanNDays(new Date(), endTime, 2) && (
      <>
        {" "}
        <FormattedMessage
          id="shared-component.eto-overview.invest.ends-at"
          values={{
            endsAtTime: <FormattedTime value={endTime} timeZone="UTC" timeZoneName="short" />,
          }}
        />
      </>
    )}
  </span>
);

const EndTimeFinishedWidget: React.FunctionComponent<CommonHtmlProps & TDataTestId> = props => (
  <span {...props}>
    <FormattedMessage id="shared-component.eto-overview.waiting-for-next-block" />
  </span>
);

const EndTimeWidget: React.FunctionComponent<IExternalProps & CommonHtmlProps & TDataTestId> = ({
  endTime,
  ...props
}) => (
  <TimeBasedComponentSwitcher
    endDate={endTime}
    timerRunningComponent={() => (
      <EndTimeRunningWidget data-test-id="end-time-widget-running" endTime={endTime} {...props} />
    )}
    timerFinishedComponent={() => (
      <EndTimeFinishedWidget data-test-id="end-time-widget-finished" {...props} />
    )}
  />
);

export { EndTimeWidget };
