import * as cn from "classnames";
import { FormikErrors } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EAdditionalValidationDataNotifications } from "../../../../../../modules/tx/validator/reducer";
import { FormFieldBoolean } from "../../../../../shared/forms";
import { hasNotification } from "../utils";

import * as styles from "../../Transfer.module.scss";

export const ShowAdditionalNotifications: React.FunctionComponent<{
  notifications: ReadonlyArray<EAdditionalValidationDataNotifications>;
  errors: FormikErrors<{ to: string }>;
}> = ({ notifications, errors }) =>
  !errors.to ? (
    <>
      {hasNotification(
        EAdditionalValidationDataNotifications.IS_VERIFIED_PLATFORM_USER,
        notifications,
      ) && (
        <p
          data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.verified-user"
          className={cn(styles.compensateSpacing, styles.verifiedUser)}
        >
          <FormattedMessage id="modal.sent-eth.verified-platform-user" />
        </p>
      )}

      {hasNotification(EAdditionalValidationDataNotifications.IS_NEW_ADDRESS, notifications) && (
        <FormFieldBoolean
          className={styles.withTopSpacing}
          data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.new-address"
          name="allowNewAddress"
          label={<FormattedMessage id="modal.sent-eth.new-address" />}
        />
      )}

      {hasNotification(
        EAdditionalValidationDataNotifications.IS_NEW_ADDRESS_WITH_BALANCE,
        notifications,
      ) && (
        <FormFieldBoolean
          className={styles.withTopSpacing}
          data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.new-address-with-balance"
          name="allowNewAddress"
          label={<FormattedMessage id="modal.sent-eth.new-address-with-balance" />}
        />
      )}

      {hasNotification(EAdditionalValidationDataNotifications.IS_SMART_CONTRACT, notifications) && (
        <FormFieldBoolean
          className={styles.withTopSpacing}
          data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.smart-contract"
          name="allowSmartContract"
          label={<FormattedMessage id="modal.sent-eth.smart-contract-address" />}
        />
      )}
    </>
  ) : null;
