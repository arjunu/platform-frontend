import * as cn from "classnames";
import { FormikErrors, FormikTouched, FormikValues } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EAdditionalValidationDataNotifications } from "../../../../../../modules/tx/validator/reducer";
import { isValidFormNumber } from "../../../../../../modules/tx/validator/transfer/utils";
import { EquityToken } from "../../../../../../utils/opaque-types/types";
import { Money } from "../../../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../../../shared/formatters/utils";
import { EInputTheme, FormFieldBoolean, FormLabel } from "../../../../../shared/forms";
import { MaskedNumberInput } from "../../../../../shared/MaskedNumberInput";
import { hasNotification } from "../utils";

import * as styles from "../../Transfer.module.scss";

const TokenValueFormRow: React.FunctionComponent<{
  disabled?: boolean;
  valueEuro: string;
  setFieldValue: (field: string, value: string, shouldValidate?: boolean) => void;
  setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => void;
  values: FormikValues;
  notifications: ReadonlyArray<EAdditionalValidationDataNotifications>;
  errors: FormikErrors<{ value: string }>;
  touched: FormikTouched<{ value: boolean }>;
  tokenImage: string;
  tokenSymbol: EquityToken;
  decimals: number;
}> = ({
  setFieldValue,
  setFieldTouched,
  values,
  notifications: warnings,
  valueEuro,
  errors,
  disabled,
  touched,
  tokenImage,
  tokenSymbol,
  decimals,
}) => (
  <>
    <section>
      <FormLabel for="value" className={styles.label}>
        <FormattedMessage id="modal.transfer.sent.amount" />
      </FormLabel>
      <MaskedNumberInput
        className="text-right"
        storageFormat={ENumberInputFormat.FLOAT}
        valueType={tokenSymbol}
        outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
        data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.value"
        name="value"
        reverseMetaInfo={true}
        value={values.value}
        onChangeFn={value => {
          setFieldValue("value", value);
          setFieldTouched("value", true);
        }}
        returnInvalidValues={true}
        disabled={disabled}
        showUnits={true}
        theme={EInputTheme.BOX}
        icon={tokenImage}
        tokenDecimals={decimals}
      />
    </section>
    <section
      className={cn(styles.withSpacing, "text-right", {
        [styles.compensateSpacing]: errors.value && touched.value,
      })}
    >
      {tokenSymbol === ECurrency.ETH && (
        <small>
          {"= "}
          <Money
            value={
              isValidFormNumber(valueEuro)
                ? valueEuro
                : "0" /* Show 0 if form is invalid due of initially populated state */
            }
            inputFormat={ENumberInputFormat.ULPS}
            valueType={ECurrency.EUR}
            outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
          />
        </small>
      )}
    </section>
    {hasNotification(EAdditionalValidationDataNotifications.WILL_EMPTY_WALLET, warnings) && (
      <FormFieldBoolean
        className={styles.withSpacing}
        data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.will-empty-wallet"
        name="withdrawAll"
        label={
          <FormattedMessage id="modals.tx-sender.withdraw-flow.withdraw-component.errors.value-will-empty-wallet" />
        }
      />
    )}
  </>
);

export { TokenValueFormRow };
