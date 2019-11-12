import * as React from "react";
import { FormattedDate, FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { InfoRow } from "./InfoRow";

const TimestampRow: React.FunctionComponent<{ timestamp: number }> = ({ timestamp }) => (
  <InfoRow
    caption={<FormattedMessage id="tx-monitor.details.timestamp" />}
    data-test-id="timestamp-row.timestamp"
    value={
      <>
        <FormattedRelative value={timestamp} initialNow={new Date()} /> (
        <FormattedDate
          value={timestamp}
          timeZone="UTC"
          timeZoneName="short"
          year="numeric"
          month="short"
          day="numeric"
          hour="numeric"
          minute="numeric"
        />
        )
      </>
    }
  />
);

export { TimestampRow };
