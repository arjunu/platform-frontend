import * as cn from "classnames";
import { Formik, FormikConsumer, FormikProps } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { generateCampaigningValidation } from "../../../../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { Button, EButtonSize, EButtonWidth } from "../../../../shared/buttons";
import { Money } from "../../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../../shared/formatters/utils";
import { CheckboxLayout, EInputSize, FormDeprecated } from "../../../../shared/forms";
import { MaskedNumberInput } from "../../../../shared/MaskedNumberInput";
import { Tooltip } from "../../../../shared/tooltips";

import * as styles from "../EtoOverviewStatus.module.scss";

export enum CampaigningFormState {
  VIEW,
  EDIT,
}

export interface ICampaigningActivatedInvestorWidgetLayoutProps {
  pledgedAmount: string;
  consentToRevealEmail: boolean;
  backNow: (amount: number) => void;
  formState: CampaigningFormState;
  showMyEmail: (consentToRevealEmail: boolean) => void;
  changePledge: () => void;
  deletePledge: () => void;
  minPledge: number;
  maxPledge?: number;
}

interface IPledgeData {
  amount: string;
}

const CampaigningActivatedInvestorApprovedWidgetLayout: React.FunctionComponent<
  ICampaigningActivatedInvestorWidgetLayoutProps
> = ({
  pledgedAmount,
  consentToRevealEmail,
  backNow,
  formState,
  showMyEmail,
  changePledge,
  deletePledge,
  minPledge,
  maxPledge,
}) => (
  <>
    <div className={cn(styles.group, styles.groupNoPadding)}>
      <label htmlFor="consentToRevealEmail" className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.reveal-my-email" />
        <Tooltip
          content={<FormattedMessage id="shared-component.eto-overview.reveal-my-email.tooltip" />}
        />
      </label>
      <div className={styles.value}>
        <CheckboxLayout
          name="consentToRevealEmail"
          inputId="consentToRevealEmail"
          checked={consentToRevealEmail}
          onChange={event => showMyEmail(event.target.checked)}
        />
      </div>
    </div>
    {formState === CampaigningFormState.VIEW ? (
      <div className={cn(styles.group, styles.groupNoPadding)}>
        <div className={styles.label} data-test-id="campaigning-your-commitment">
          <FormattedMessage id="eto-overview.campaigning.your-commitment" />
          <br />
          <Money
            value={pledgedAmount}
            inputFormat={ENumberInputFormat.FLOAT}
            valueType={ECurrency.EUR}
            outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
          />
        </div>
        <div className={styles.value}>
          <button
            onClick={changePledge}
            className={styles.changePledge}
            data-test-id="campaigning-your-commitment-change"
          >
            <FormattedMessage id="shared-component.eto-overview.change" />
          </button>{" "}
          <FormattedMessage id="shared-component.eto-overview.or" />{" "}
          <button
            onClick={deletePledge}
            className={styles.deletePledge}
            data-test-id="campaigning-your-commitment-delete"
          >
            <FormattedMessage id="shared-component.eto-overview.delete" />
          </button>{" "}
          <FormattedMessage id="shared-component.eto-overview.your-pledge" />{" "}
        </div>
      </div>
    ) : (
      <Formik<{ amount: string }>
        initialValues={{ amount: pledgedAmount }}
        onSubmit={({ amount }) => backNow(Number(amount))}
        validationSchema={generateCampaigningValidation(minPledge, maxPledge)}
        isInitialValid={!!pledgedAmount}
      >
        <FormikConsumer>
          {({ values, setFieldValue, isValid, setFieldTouched }: FormikProps<IPledgeData>) => (
            <FormDeprecated className={cn(styles.group, styles.groupNoPadding)}>
              <div className={cn(styles.label, styles.labelFull)}>
                <FormattedMessage id="eto-overview.campaigning.indicate-commitment" />
              </div>
              <div className={cn(styles.label)}>
                <MaskedNumberInput
                  size={EInputSize.SMALL}
                  storageFormat={ENumberInputFormat.FLOAT}
                  valueType={ECurrency.EUR}
                  outputFormat={ENumberOutputFormat.INTEGER}
                  name="amount"
                  value={values["amount"]}
                  onChangeFn={value => {
                    setFieldValue("amount", value);
                    setFieldTouched("amount", true);
                  }}
                  returnInvalidValues={true}
                  showUnits={true}
                />
              </div>
              <div className={cn(styles.value, styles.backNow)}>
                <Button
                  data-test-id="eto-bookbuilding-commit"
                  type="submit"
                  size={EButtonSize.SMALL}
                  width={EButtonWidth.BLOCK}
                  disabled={!isValid}
                >
                  <FormattedMessage id="shared-component.eto-overview.back-now" />
                </Button>
              </div>
            </FormDeprecated>
          )}
        </FormikConsumer>
      </Formik>
    )}
  </>
);

export { CampaigningActivatedInvestorApprovedWidgetLayout };
