import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../modules/actions";
import { onEnterAction } from "../../utils/react-connected-components/OnEnterAction";
import { Dashboard } from "../dashboard/Dashboard";

export const UnlockWalletFundsFromLinkComponent: React.FunctionComponent<void> = () => (
  <Dashboard />
);

export const UnlockWalletFundsFromLink = compose<void, React.FunctionComponent>(
  onEnterAction({ actionCreator: d => d(actions.txTransactions.startUnlockEtherFunds()) }),
)(UnlockWalletFundsFromLinkComponent);
