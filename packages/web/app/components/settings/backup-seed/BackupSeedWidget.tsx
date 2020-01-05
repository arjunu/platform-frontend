import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EColumnSpan } from "../../layouts/Container";
import { ButtonLink, EButtonLayout, EIconPosition } from "../../shared/buttons/index";
import { Panel } from "../../shared/Panel";
import { profileRoutes } from "../routes";
import { connectBackupSeedWidget } from "./ConnectSetupWidget";

import arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import successIcon from "../../../assets/img/notifications/success.svg";
import warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./BackupSeedWidget.module.scss";

interface IProps {
  backupCodesVerified: boolean;
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
  step: number;
}

const BackupSeedWidgetBase: React.FunctionComponent<IProps & IExternalProps> = ({
  backupCodesVerified,
  columnSpan,
}) => (
  <Panel
    columnSpan={columnSpan}
    headerText={<FormattedMessage id="settings.backup-seed-widget.header" />}
    rightComponent={
      backupCodesVerified ? (
        <img src={successIcon} className={styles.icon} aria-hidden="true" />
      ) : (
        <img src={warningIcon} className={styles.icon} aria-hidden="true" />
      )
    }
    data-test-id="profile.backup-seed-widget"
  >
    {backupCodesVerified ? (
      <section
        data-test-id="backup-seed-verified-section"
        className={cn(styles.section, "d-flex flex-wrap align-content-around")}
      >
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage id="settings.backup-seed-widget.backed-up-seed" />
        </p>
        <ButtonLink
          to={profileRoutes.seedBackup}
          layout={EButtonLayout.GHOST}
          iconPosition={EIconPosition.ICON_AFTER}
          svgIcon={arrowRight}
          data-test-id="backup-seed-verified-section.view-again"
        >
          <FormattedMessage id="settings.backup-seed-widget.view-again" />
        </ButtonLink>
      </section>
    ) : (
      <section
        data-test-id="backup-seed-unverified-section"
        className={cn(styles.section, "d-flex flex-wrap align-content-around")}
      >
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage id="settings.backup-seed-widget.write-down-recovery-phrase" />
        </p>
        <ButtonLink
          to={profileRoutes.seedBackup}
          data-test-id="backup-seed-widget-link-button"
          layout={EButtonLayout.GHOST}
          iconPosition={EIconPosition.ICON_AFTER}
          svgIcon={arrowRight}
        >
          <FormattedMessage id="settings.backup-seed-widget.backup-phrase" />
        </ButtonLink>
      </section>
    )}
  </Panel>
);

const BackupSeedWidget = connectBackupSeedWidget<IExternalProps>(BackupSeedWidgetBase);

export { BackupSeedWidget, BackupSeedWidgetBase };
