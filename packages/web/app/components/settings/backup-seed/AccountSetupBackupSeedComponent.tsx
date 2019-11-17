import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button, EButtonLayout } from "../../shared/buttons/Button";
import { connectBackupSeedWidget } from "./ConnectSetupWidget";

import * as styles from "./AccountSetupBackupSeedComponent.module.scss";

interface IStateProps {
  backupCodesVerified: boolean;
}

interface IDispatchProps {
  startBackupProcess: () => void;
}

export const AccountSetupBackupWidgetLayout: React.FunctionComponent<
  IStateProps & IDispatchProps
> = ({ startBackupProcess }) => (
  <section data-test-id="account-setup-backup-seed-section" className={styles.accountSetupSection}>
    <p className={styles.accountSetupText}>
      <FormattedMessage id="account-setup.backup-seed-widget.text-1" />
    </p>
    <p className={styles.accountSetupText}>
      <FormattedMessage id="account-setup.backup-seed-widget.text-2" />
    </p>
    <p className={styles.accountSetupText}>
      <FormattedMessage id="account-setup.backup-seed-widget.text-3" />
    </p>

    <Button
      onClick={startBackupProcess}
      layout={EButtonLayout.PRIMARY}
      data-test-id="backup-seed-widget-link-button"
    >
      <FormattedMessage id="settings.backup-seed-widget.backup-phrase" />
    </Button>
  </section>
);

const AccountSetupBackupSeedComponent = connectBackupSeedWidget<{}>(AccountSetupBackupWidgetLayout);

export { AccountSetupBackupSeedComponent };
