import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import { isSupportingLedger } from "../../../modules/user-agent/reducer";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { resetWalletOnEnter } from "../resetWallet";
import { WalletLedgerChooser } from "./WalletLedgerChooser";
import { WalletLedgerInit } from "./WalletLedgerInitComponent";
import { WalletLedgerNotSupported } from "./WalletLedgerNotSupportedComponent";

interface IWalletLedgerStateProps {
  isConnectionEstablished: boolean;
  isLedgerSupported: boolean;
}

export const WalletLedgerComponent: React.FunctionComponent<IWalletLedgerStateProps> = ({
  isConnectionEstablished,
  isLedgerSupported,
}) => {
  if (!isLedgerSupported) {
    return <WalletLedgerNotSupported />;
  } else if (isConnectionEstablished) {
    return <WalletLedgerChooser />;
  } else {
    return <WalletLedgerInit />;
  }
};

export const WalletLedger = compose<IWalletLedgerStateProps, {}>(
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.walletSelector.ledgerTryEstablishingConnectionWithLedger());
    },
  }),
  resetWalletOnEnter(),
  appConnect<IWalletLedgerStateProps>({
    stateToProps: state => ({
      isConnectionEstablished: state.ledgerWizardState.isConnectionEstablished,
      isLedgerSupported: isSupportingLedger(state.browser),
    }),
  }),
)(WalletLedgerComponent);
