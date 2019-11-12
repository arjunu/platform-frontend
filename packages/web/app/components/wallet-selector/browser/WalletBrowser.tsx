import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { selectIsLoginRoute } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/buttons";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { StepCard } from "../../shared/StepCard";
import { WarningAlert } from "../../shared/WarningAlert";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";
import { resetWalletOnEnter } from "../resetWallet";

import * as check_metamask from "../../../assets/img/wallet_selector/check_metamask.svg";
import * as enter_password from "../../../assets/img/wallet_selector/enter_password.svg";
import * as reload from "../../../assets/img/wallet_selector/reload.svg";
import * as styles from "./WalletBrowser.module.scss";

interface IWalletBrowserProps {
  errorMessage?: TMessage;
  isLoading: boolean;
  isLoginRoute: boolean;
  approvalRejected: boolean;
}

interface IWalletBrowserDispatchProps {
  tryConnectingWithBrowserWallet: () => void;
}

export const WalletBrowserComponent: React.FunctionComponent<
  IWalletBrowserProps & IWalletBrowserDispatchProps
> = ({
  errorMessage,
  isLoading,
  isLoginRoute,
  approvalRejected,
  tryConnectingWithBrowserWallet,
}) => (
  <div>
    <h2 className={styles.title} data-test-id="modals.wallet-selector.wallet-browser.title">
      {isLoginRoute ? (
        <FormattedMessage id="wallet-selector.browser.login-prompt" />
      ) : (
        <FormattedMessage id="wallet-selector.browser.register-prompt" />
      )}
    </h2>

    {isLoading ? (
      <LoadingIndicator />
    ) : (
      <>
        {errorMessage && (
          <section className="text-center my-5">
            <WarningAlert className="mb-4" data-test-id="browser-wallet-error-msg">
              {getMessageTranslation(errorMessage)}
            </WarningAlert>

            <Button
              onClick={tryConnectingWithBrowserWallet}
              data-test-id="ledger-wallet-init.try-again"
            >
              <FormattedMessage id="common.try-again" />
            </Button>
          </section>
        )}

        {approvalRejected && (
          <>
            <Row className="justify-content-center mb-4">
              <div>
                <FormattedMessage id="wallet-selector.browser.approval-rejected" />
              </div>
            </Row>
            <Row className="justify-content-center mb-4">
              <Button onClick={tryConnectingWithBrowserWallet}>
                <FormattedMessage id="wallet-selector.browser.approval-resend" />
              </Button>
            </Row>
          </>
        )}

        <div className={styles.stepCardWrapper}>
          <StepCard
            img={check_metamask}
            text={<FormattedMessage id="wallet-selector.browser.steps.1" />}
          />
          <StepCard
            img={enter_password}
            text={<FormattedMessage id="wallet-selector.browser.steps.2" />}
          />
          <StepCard img={reload} text={<FormattedMessage id="wallet-selector.browser.steps.3" />} />
        </div>
      </>
    )}
  </div>
);

export const WalletBrowser = compose<React.FunctionComponent>(
  appConnect<IWalletBrowserProps, IWalletBrowserDispatchProps>({
    stateToProps: state => ({
      errorMessage: state.browserWalletWizardState.errorMsg as TMessage,
      isLoading: state.browserWalletWizardState.isLoading,
      isLoginRoute: selectIsLoginRoute(state.router),
      approvalRejected: state.browserWalletWizardState.approvalRejected,
    }),
    dispatchToProps: dispatch => ({
      tryConnectingWithBrowserWallet: () => {
        dispatch(actions.walletSelector.tryConnectingWithBrowserWallet());
      },
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.walletSelector.tryConnectingWithBrowserWallet());
    },
  }),
  resetWalletOnEnter(),
)(WalletBrowserComponent);
