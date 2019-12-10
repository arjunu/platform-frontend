import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { assertNever } from "@neufund/shared";
import { ETxStatus } from "../types";

import * as txError from "../../../../assets/img/icon_txn_status_error.svg";
import * as txPending from "../../../../assets/img/icon_txn_status_pending_transaction.svg";
import * as txSuccess from "../../../../assets/img/icon_txn_status_success.svg";
import * as styles from "./TxStatusLabel.module.scss";

interface IProps {
  status: ETxStatus;
}

const TxStatusLabel: React.FunctionComponent<IProps> = ({ status }) => {
  switch (status) {
    case ETxStatus.PENDING:
      return (
        <span className={cn(styles.txStatusLabel, styles.txStatusLabelPending)}>
          <FormattedMessage id="modals.shared.tx-status-label.pending" />
          <img src={txPending} className={cn(styles.icon, styles.iconPending)} alt="" />
        </span>
      );
    case ETxStatus.ERROR:
      return (
        <span className={cn(styles.txStatusLabel, styles.txStatusLabelError)}>
          <FormattedMessage id="modals.shared.tx-status-label.error" />
          <img src={txError} className={styles.icon} alt="" />
        </span>
      );
    case ETxStatus.SUCCESS:
      return (
        <span className={cn(styles.txStatusLabel, styles.txStatusLabelSuccess)}>
          <FormattedMessage id="modals.shared.tx-status-label.success" />
          <img src={txSuccess} className={styles.icon} alt="" />
        </span>
      );
    default:
      return assertNever(status);
  }
};

export { TxStatusLabel };
