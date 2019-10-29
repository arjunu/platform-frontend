import BigNumber from "bignumber.js";
import * as cn from "classnames";
import { FormikConsumer, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { ITxData } from "../../../../lib/web3/types";
import * as YupTS from "../../../../lib/yup-ts.unsafe";
import { actions } from "../../../../modules/actions";
import { EBankTransferType } from "../../../../modules/bank-transfer-flow/reducer";
import {
  selectBankRedeemMinAmount,
  selectRedeemFeeUlps,
} from "../../../../modules/bank-transfer-flow/selectors";
import { selectLiquidEuroTokenBalance } from "../../../../modules/wallet/selectors";
import { doesUserHaveEnoughNEuro, doesUserWithdrawMinimal } from "../../../../modules/web3/utils";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button, ButtonSize, EButtonLayout } from "../../../shared/buttons/Button";
import { ButtonArrowRight } from "../../../shared/buttons/index";
import { FormatNumber } from "../../../shared/formatters/FormatNumber";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  formatNumber,
  selectDecimalPlaces,
  toFixedPrecision,
} from "../../../shared/formatters/utils";
import { FormLabel } from "../../../shared/forms/fields/FormFieldLabel";
import { FormDeprecated } from "../../../shared/forms/FormDeprecated";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { MaskedNumberInput } from "../../../shared/MaskedNumberInput";
import { ETheme, MoneySuiteWidget } from "../../../shared/MoneySuiteWidget/MoneySuiteWidget";
import { Tooltip } from "../../../shared/tooltips/Tooltip";
import { VerifiedBankAccount } from "../../../wallet/VerifiedBankAccount";
import { CalculatedFee } from "./CalculatedFee";
import { TotalRedeemed } from "./TotalRedeemed";

import * as neuroIcon from "../../../../assets/img/nEUR_icon.svg";
import * as styles from "./BankTransferRedeemInit.module.scss";

interface IStateProps {
  minAmount: string;
  neuroAmount: string;
  neuroEuroAmount: string;
  bankFee: string;
}

interface IDispatchProps {
  confirm: (tx: Partial<ITxData>) => void;
  verifyBankAccount: () => void;
}

type IProps = IStateProps & IDispatchProps;

export interface IReedemData {
  amount: string;
}

const getValidators = (minAmount: string, neuroAmount: string) =>
  YupTS.object({
    amount: YupTS.number().enhance(v =>
      v
        .typeError(((
          <FormattedMessage id="investment-flow.validation-error" />
        ) as unknown) as string)
        .moreThan(0)
        .test(
          "isEnoughNEuro",
          ((
            <FormattedMessage id="bank-transfer.redeem.init.errors.value-higher-than-balance" />
          ) as unknown) as string,
          (value: string) => doesUserHaveEnoughNEuro(value, neuroAmount),
        )
        .test(
          "isMinimal",
          ((
            <FormattedMessage
              id="bank-transfer.redeem.init.errors.value-lower-than-minimal"
              values={{
                minAmount: formatNumber({
                  value: minAmount,
                  roundingMode: ERoundingMode.UP,
                  inputFormat: ENumberInputFormat.ULPS,
                  decimalPlaces: selectDecimalPlaces(
                    ECurrency.EUR_TOKEN,
                    ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
                  ),
                }),
              }}
            />
          ) as unknown) as string,
          (value: string) => doesUserWithdrawMinimal(value, minAmount),
        ),
    ),
  }).toYup();

const BankTransferRedeemLayout: React.FunctionComponent<IProps> = ({
  neuroAmount,
  neuroEuroAmount,
  verifyBankAccount,
  bankFee,
}) => (
  <>
    <Heading size={EHeadingSize.SMALL} level={4} className="mb-4">
      <FormattedMessage id="bank-transfer.redeem.init.title" />
    </Heading>

    <p className="mb-3">
      <FormattedHTMLMessage id="bank-transfer.redeem.init.description" tagName="span" />
    </p>

    <section className={styles.section}>
      <Heading level={3} decorator={false} size={EHeadingSize.SMALL}>
        <FormattedMessage id="bank-transfer.redeem.init.neur-balance" />
      </Heading>
    </section>

    <section className={styles.section}>
      <MoneySuiteWidget
        icon={neuroIcon}
        currency={ECurrency.EUR_TOKEN}
        currencyTotal={ECurrency.EUR}
        largeNumber={neuroAmount}
        value={neuroEuroAmount}
        theme={ETheme.FRAMED}
        walletName={<FormattedMessage id="bank-transfer.redeem.init.wallet-name" />}
      />
    </section>

    <FormikConsumer>
      {({ values, setFieldValue, isValid, setFieldTouched }: FormikProps<IReedemData>) => (
        <>
          <section className={styles.section}>
            <FormLabel for="amount" className={styles.label}>
              <FormattedMessage id="bank-transfer.redeem.init.redeem-amount" />
            </FormLabel>
            <Button
              data-test-id="bank-transfer.reedem-init.redeem-whole-balance"
              className={styles.linkButton}
              onClick={() => {
                setFieldValue(
                  "amount",
                  toFixedPrecision({
                    value: neuroAmount,
                    roundingMode: ERoundingMode.DOWN,
                    inputFormat: ENumberInputFormat.ULPS,
                    decimalPlaces: selectDecimalPlaces(
                      ECurrency.EUR_TOKEN,
                      ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
                    ),
                  }),
                  true,
                );
                setFieldTouched("amount", true, true);
              }}
              layout={EButtonLayout.INLINE}
              size={ButtonSize.SMALL}
            >
              <FormattedMessage id="bank-transfer.redeem.init.entire-wallet" />
            </Button>
          </section>

          <FormDeprecated>
            <MaskedNumberInput
              storageFormat={ENumberInputFormat.FLOAT}
              valueType={ECurrency.EUR}
              outputFormat={ENumberOutputFormat.FULL}
              name="amount"
              value={values["amount"]}
              onChangeFn={value => {
                setFieldValue("amount", value);
                setFieldTouched("amount", true);
              }}
              returnInvalidValues={true}
              showUnits={true}
            />
            <section className={cn(styles.section, "mt-4")}>
              <Tooltip
                content={
                  <FormattedMessage
                    id="bank-transfer.redeem.init.redeem-fee.tooltip"
                    values={{
                      //  value is stored as decimal fraction Ulps formatted number
                      // to get percentage value we have to multiply ba 100
                      // ex value, convertToBigNumber(0.005) * 100 = 0.5%
                      fee: (
                        <FormatNumber
                          value={new BigNumber(bankFee).mul("100")}
                          inputFormat={ENumberInputFormat.ULPS}
                          outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                          roundingMode={ERoundingMode.DOWN}
                          decimalPlaces={1}
                        />
                      ),
                    }}
                  />
                }
              >
                <Heading level={3} decorator={false} size={EHeadingSize.SMALL}>
                  <FormattedMessage id="bank-transfer.redeem.init.redeem-fee" />
                </Heading>
              </Tooltip>
              <span className="text-warning">
                {"-"} {isValid && <CalculatedFee bankFee={bankFee} amount={values.amount} />}
              </span>
            </section>
            <section className={styles.section}>
              <Heading level={3} decorator={false} size={EHeadingSize.SMALL}>
                <FormattedMessage id="bank-transfer.redeem.init.total-redeemed" />
              </Heading>
              <span className="text-success">
                {isValid ? <TotalRedeemed bankFee={bankFee} amount={values.amount} /> : "-"}
              </span>
            </section>
            <VerifiedBankAccount withBorder={true} onVerify={verifyBankAccount} />
            <p className="text-warning mx-4 text-center">
              <FormattedMessage id="bank-transfer.redeem.init.note" />
            </p>
            <section className="text-center">
              <ButtonArrowRight
                data-test-id="bank-transfer.reedem-init.continue"
                disabled={!isValid}
                type="submit"
              >
                <FormattedMessage id="bank-transfer.redeem.init.continue" />
              </ButtonArrowRight>
            </section>
          </FormDeprecated>
        </>
      )}
    </FormikConsumer>
  </>
);

const BankTransferRedeemInit = compose<IProps, {}>(
  onEnterAction({
    actionCreator: d => {
      d(actions.bankTransferFlow.getRedeemData());
    },
  }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      neuroAmount: selectLiquidEuroTokenBalance(state),
      neuroEuroAmount: selectLiquidEuroTokenBalance(state),
      bankFee: selectRedeemFeeUlps(state),
      minAmount: selectBankRedeemMinAmount(state),
    }),
    dispatchToProps: dispatch => ({
      verifyBankAccount: () =>
        dispatch(actions.bankTransferFlow.startBankTransfer(EBankTransferType.VERIFY)),
      confirm: (tx: Partial<ITxData>) => dispatch(actions.txSender.txSenderAcceptDraft(tx)),
    }),
  }),
  withFormik<IStateProps & IDispatchProps, IReedemData>({
    validationSchema: (props: IStateProps) => getValidators(props.minAmount, props.neuroAmount),
    handleSubmit: (values, { props }) => {
      props.confirm({ value: values.amount });
    },
  }),
)(BankTransferRedeemLayout);

export { BankTransferRedeemLayout, BankTransferRedeemInit };
