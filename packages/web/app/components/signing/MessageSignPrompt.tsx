import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { selectWalletSubType, selectWalletType } from "../../modules/web3/selectors";
import { EWalletSubType, EWalletType } from "../../modules/web3/types";
import { appConnect } from "../../store";

import ledgerConfirm from "../../assets/img/wallet_selector/ledger_confirm.svg";
import walletConfirmIcon from "../../assets/img/wallet_selector/wallet_confirm_icon.svg";

interface IStateProps {
  walletType: EWalletType;
  walletSubType: EWalletSubType;
}

export const BrowserWalletMessageSignPrompt: React.FunctionComponent<IStateProps> = ({
  walletSubType,
}) => (
  <Row className="text-center">
    <Col>
      <h1>
        <FormattedMessage id="signing.browser-wallet.header" />
      </h1>
      <img className="mt-5 mb-4" src={walletConfirmIcon} />
      <p className="font-weight-bold">
        {walletSubType === EWalletSubType.GNOSIS ? (
          <FormattedMessage id="signing.browser-gnosis-wallet.message" />
        ) : (
          <FormattedMessage id="signing.browser-wallet.message" />
        )}
      </p>
    </Col>
  </Row>
);

export const LedgerWalletMessageSignPrompt: React.FunctionComponent = () => (
  <Row className="text-center">
    <Col>
      <h1>
        <FormattedMessage id="signing.ledger-wallet.header" />
      </h1>
      <img className="mt-5 mb-4" src={ledgerConfirm} />
      <p className="font-weight-bold">
        <FormattedMessage id="signing.ledger-wallet.message" />
      </p>
    </Col>
  </Row>
);

export const MessageSignPromptComponent: React.FunctionComponent<IStateProps> = ({
  walletType,
  walletSubType,
}) =>
  walletType === EWalletType.LEDGER ? (
    <LedgerWalletMessageSignPrompt />
  ) : (
    <BrowserWalletMessageSignPrompt walletType={walletType} walletSubType={walletSubType} />
  );

export const MessageSignPrompt = appConnect<IStateProps>({
  stateToProps: s => ({
    walletType: selectWalletType(s.web3)!,
    walletSubType: selectWalletSubType(s.web3)!,
  }),
})(MessageSignPromptComponent);
