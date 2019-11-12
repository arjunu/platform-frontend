import * as React from "react";

import * as styles from "../EtoOverviewStatus.module.scss";

type TWhitelistingNotActiveProps = {
  keyQuoteFounder: string;
};

export const WhitelistingNotActive: React.FunctionComponent<TWhitelistingNotActiveProps> = ({
  keyQuoteFounder,
}) => (
  <div data-test-id="eto-overview-status-founders-quote" className={styles.quote}>
    {keyQuoteFounder}
  </div>
);
