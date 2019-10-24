import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "recompose";

import { externalRoutes } from "../../../config/externalRoutes";
import { minimumLedgerVersion } from "../../../lib/web3/ledger-wallet/ledgerUtils";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { Button } from "../../shared/buttons";
import { ExternalLink } from "../../shared/links";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { WarningAlert } from "../../shared/WarningAlert";
import { getMessageTranslation, LedgerErrorMessage } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";
import { LedgerHeader } from "./LedgerHeader";

import * as imgStep1 from "../../../assets/img/wallet_selector/ledger_login_step_1.svg";
import * as imgStep2 from "../../../assets/img/wallet_selector/ledger_login_step_2.svg";
import * as imgStep3 from "../../../assets/img/wallet_selector/ledger_login_step_3.svg";
import * as imgStep4 from "../../../assets/img/wallet_selector/ledger_login_step_4.svg";
import * as imgStep5 from "../../../assets/img/wallet_selector/ledger_login_step_5.svg";
import * as imgStep6 from "../../../assets/img/wallet_selector/ledger_login_step_6.svg";
import * as styles from "./WalletLedgerInitComponent.module.scss";

interface IInitStep {
  header: string | React.ReactNode;
  img: string;
  desc: string | React.ReactNode;
}

const InitStep: React.FunctionComponent<IInitStep> = ({ header, img, desc }) => (
  <Col xs="12" md="4" className={cn("mb-4 mb-md-0 px-4", styles.step)}>
    <div className={styles.header}>{header}</div>
    <img className="my-2 my-md-5" src={img} alt="" />
    <p>{desc}</p>
  </Col>
);

const LedgerConnectionSteps: React.FunctionComponent = () => (
  <>
    <Row>
      <InitStep
        header={<FormattedMessage id="wallet-selector.ledger.start.step1.header" />}
        img={imgStep1}
        desc={<FormattedMessage id="wallet-selector.ledger.start.step1.description" />}
      />
      <InitStep
        header={<FormattedMessage id="wallet-selector.ledger.start.step2.header" />}
        img={imgStep2}
        desc={<FormattedMessage id="wallet-selector.ledger.start.step2.description" />}
      />
      <InitStep
        header={<FormattedMessage id="wallet-selector.ledger.start.step3.header" />}
        img={imgStep3}
        desc={<FormattedMessage id="wallet-selector.ledger.start.step3.description" />}
      />
    </Row>
    <Row>
      <InitStep
        header={<FormattedMessage id="wallet-selector.ledger.start.step4.header" />}
        img={imgStep4}
        desc={<FormattedMessage id="wallet-selector.ledger.start.step4.description" />}
      />
      <InitStep
        header={<FormattedMessage id="wallet-selector.ledger.start.step5.header" />}
        img={imgStep5}
        desc={<FormattedMessage id="wallet-selector.ledger.start.step5.description" />}
      />
      <InitStep
        header={<FormattedMessage id="wallet-selector.ledger.start.step6.header" />}
        img={imgStep6}
        desc={<FormattedMessage id="wallet-selector.ledger.start.step6.description" />}
      />
    </Row>
  </>
);

interface IStateProps {
  isInitialConnectionInProgress: boolean;
  errorMessage?: TMessage;
}

interface IDispatchProps {
  tryToEstablishConnectionWithLedger: () => void;
}

export const WalletLedgerInitComponent: React.FunctionComponent<IStateProps & IDispatchProps> = ({
  errorMessage,
  isInitialConnectionInProgress,
  tryToEstablishConnectionWithLedger,
}) => (
  <>
    <LedgerHeader />

    {isInitialConnectionInProgress && <LoadingIndicator />}

    {errorMessage && (
      <section className="text-center my-5">
        <WarningAlert className="mb-4">
          <FormattedMessage id="wallet-selector.ledger.start.connection-status" />{" "}
          <span data-test-id="ledger-wallet-error-msg">{getMessageTranslation(errorMessage)}</span>
        </WarningAlert>

        <Button
          onClick={tryToEstablishConnectionWithLedger}
          data-test-id="ledger-wallet-init.try-again"
        >
          <FormattedMessage id="common.try-again" />
        </Button>
      </section>
    )}

    {/* If there is a need for more visual cases then we will need to implement a full solution */}
    {errorMessage && errorMessage.messageType === LedgerErrorMessage.NOT_SUPPORTED ? (
      <div className={cn(styles.step, "mx-md-5")}>
        <p>
          <FormattedMessage
            values={{ minimumVersion: minimumLedgerVersion }}
            id="wallet-selector.ledger.please-upgrade"
          />
        </p>
        <p>
          <FormattedMessage
            values={{
              ledgerUpgradeLink: (
                <ExternalLink href={externalRoutes.ledgerSupport}>
                  <FormattedMessage id="wallet-selector.ledger.update-link" />
                </ExternalLink>
              ),
            }}
            id="wallet-selector.ledger.update-instructions"
          />
        </p>
      </div>
    ) : (
      <LedgerConnectionSteps />
    )}
  </>
);

export const WalletLedgerInit = compose<IStateProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      isInitialConnectionInProgress: state.ledgerWizardState.isInitialConnectionInProgress,
      errorMessage: state.ledgerWizardState.errorMsg,
    }),
    dispatchToProps: dispatch => ({
      tryToEstablishConnectionWithLedger: () =>
        dispatch(actions.walletSelector.ledgerTryEstablishingConnectionWithLedger()),
    }),
  }),
)(WalletLedgerInitComponent);
