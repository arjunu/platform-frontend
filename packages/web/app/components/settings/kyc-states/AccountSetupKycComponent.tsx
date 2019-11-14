import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { THocProps } from "../../../types";
import { Button, EButtonLayout, EButtonTheme } from "../../shared/buttons/Button";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { WarningAlert } from "../../shared/WarningAlert";
import { connectKycStatusWidget } from "./connectKycStatus";

import * as styles from "./AccountSetupKycComponent.module.scss";

export type ConnectKycStatusWidgetProps = THocProps<typeof connectKycStatusWidget>;

export const AccountSetupKycStartLayout: React.FunctionComponent<ConnectKycStatusWidgetProps> = ({
  isLoading,
  error,
  onGoToKycHome,
}) => {
  if (isLoading) {
    return <LoadingIndicator className={styles.loading} />;
  } else if (error) {
    return (
      <WarningAlert>
        <FormattedMessage id="settings.kyc-widget.error" />
      </WarningAlert>
    );
  } else {
    return (
      <section
        className={styles.accountSetupSection}
        data-test-id="account-setup-start-kyc-section"
      >
        <p className={styles.accountSetupText}>
          <FormattedMessage id="account-setup.kyc-widget-text" />
        </p>
        <Button
          layout={EButtonLayout.PRIMARY}
          theme={EButtonTheme.BRAND}
          type="button"
          onClick={onGoToKycHome}
          data-test-id="start-kyc-button"
        >
          <FormattedMessage id="account-setup.kyc-widget-start-kyc" />
        </Button>
      </section>
    );
  }
};

export const AccountSetupKycPendingLayout: React.FunctionComponent<ConnectKycStatusWidgetProps> = ({
  onGoToKycHome,
}) => (
  <>
    <Button
      layout={EButtonLayout.PRIMARY}
      theme={EButtonTheme.BRAND}
      type="button"
      onClick={onGoToKycHome}
      data-test-id="kyc-additional-documents-button"
    >
      <FormattedMessage id="settings.kyc-status-widget.submit-additional-documents" />
    </Button>
  </>
);

export const AccountSetupKycComponent = compose<ConnectKycStatusWidgetProps, {}>(
  connectKycStatusWidget(),
)(AccountSetupKycStartLayout);

export const AccountSetupKycPendingComponent = compose<ConnectKycStatusWidgetProps, {}>(
  connectKycStatusWidget(),
)(AccountSetupKycPendingLayout);
