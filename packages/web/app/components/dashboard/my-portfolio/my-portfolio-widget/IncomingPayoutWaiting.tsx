import * as React from "react";
import { compose } from "recompose";

import { PAYOUT_POLLING_DELAY } from "../../../../config/constants";
import { actions } from "../../../../modules/actions";
import {
  selectEtherTokenIncomingPayout,
  selectEuroTokenIncomingPayout,
} from "../../../../modules/investor-portfolio/selectors";
import { appConnect } from "../../../../store";
import { withActionWatcher } from "../../../../utils/withActionWatcher.unsafe";
import { CounterLayout } from "../../../shared/Counter";
import { IIncomingPayoutData, IncomingPayoutPendingBase } from "./IncomingPayoutPending";

import * as styles from "./PayoutWidget.module.scss";

export const IncomingPayoutWaitingLayout: React.FunctionComponent<IIncomingPayoutData> = ({
  etherTokenIncomingPayout,
  euroTokenIncomingPayout,
}) => (
  <IncomingPayoutPendingBase
    dataTestId="my-portfolio-widget-incoming-payout-waiting"
    etherTokenIncomingPayout={etherTokenIncomingPayout}
    euroTokenIncomingPayout={euroTokenIncomingPayout}
  >
    <CounterLayout
      data-test-id="incoming-payout-counter"
      className={styles.counterWidget}
      timeLeft={0}
      blink={true}
    />
  </IncomingPayoutPendingBase>
);

export const IncomingPayoutWaiting = compose<IIncomingPayoutData, {}>(
  appConnect({
    stateToProps: s => ({
      etherTokenIncomingPayout: selectEtherTokenIncomingPayout(s),
      euroTokenIncomingPayout: selectEuroTokenIncomingPayout(s),
    }),
  }),
  withActionWatcher({
    actionCreator: d => {
      d(actions.investorEtoTicket.getIncomingPayoutsInBackground());
      d(actions.investorEtoTicket.loadClaimablesInBackground());
    },
    interval: PAYOUT_POLLING_DELAY,
  }),
)(IncomingPayoutWaitingLayout);
