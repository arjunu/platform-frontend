import BigNumber from "bignumber.js";
import { FormikConsumer } from "formik";
import { Col, Row } from "reactstrap";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { FormFieldLayout } from "../../../../shared/forms/layouts/FormFieldLayout";
import {
  ECurrency,
  ENumberFormat,
  ENumberInputFormat, ENumberOutputFormat, EPriceFormat,
  formatNumber,
  selectDecimalPlaces,
  selectUnits, THumanReadableFormat, TValueFormat
} from "../../../../shared/formatters/utils";
import { calculateInvestmentValues, convertAndValidateCalculatorValues } from "../../../../../lib/api/eto/EtoUtils";
import { FormHighlightGroup } from "../../../../shared/forms/FormHighlightGroup";
import { TTranslatedString } from "../../../../../types";

interface ICalculatorField {
  value: string | number | BigNumber;
  name: string;
  label: TTranslatedString;
  valueType: TValueFormat;
  outputFormat: THumanReadableFormat;
}

interface ICalculatorProps {
  etoProductMaxInvestmentAmount: number;
}

const CalculatorField: React.FunctionComponent<ICalculatorField> = ({
  value,
  name,
  label,
  valueType,
  outputFormat,
}) => (
  <FormFieldLayout
    label={label}
    suffix={selectUnits(valueType)}
    name={name}
    value={formatNumber({
      value: value,
      inputFormat: ENumberInputFormat.FLOAT,
      outputFormat: outputFormat,
      decimalPlaces: selectDecimalPlaces(valueType, outputFormat),
    })}
    readOnly={true}
  />
);

export const InvestmentCalculator: React.FunctionComponent<ICalculatorProps> = ({
  etoProductMaxInvestmentAmount,
}) => (
  <FormikConsumer>
    {({ values }) => {
      const calculatorValues = convertAndValidateCalculatorValues(values);
      console.log("calculatorValues",calculatorValues);

      const {
        sharePrice,
        tokensPerShare,
        tokenPrice,
        minInvestmentAmount,
        maxInvestmentAmount,
        computedMinNumberOfTokens,
        computedMaxNumberOfTokens,
        computedMinCapPercent,
        computedMaxCapPercent,
      } = calculateInvestmentValues(calculatorValues);

      return (
        <FormHighlightGroup>
          <CalculatorField
            value={sharePrice}
            name="newSharePrice"
            label={<FormattedMessage id="eto.form.section.investment-terms.new-share-price" />}
            valueType={EPriceFormat.SHARE_PRICE}
            outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
          />
          <CalculatorField
            value={tokensPerShare}
            name="equityTokensPerShare"
            label={<FormattedMessage id="eto.form.section.investment-terms.tokens-per-share" />}
            valueType={EPriceFormat.SHARE_PRICE}
            outputFormat={ENumberOutputFormat.INTEGER}
          />
          <CalculatorField
            value={tokenPrice}
            name="equityTokenPrice"
            label={<FormattedMessage id="eto.form.section.investment-terms.equity-token-price" />}
            valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
            outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
          />
          <Row>
            <Col sm={12} md={6}>
              <CalculatorField
                value={minInvestmentAmount}
                name="minInvestmentAmount"
                label={<FormattedMessage id="eto.form.section.investment-terms.minimum-amount" />}
                valueType={ECurrency.EUR}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              />
            </Col>
            <Col sm={12} md={6}>
              <CalculatorField
                value={maxInvestmentAmount}
                name="totalInvestment"
                label={<FormattedMessage id="eto.form.section.investment-terms.total-investment" />}
                valueType={ECurrency.EUR}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              />
            </Col>
            {etoProductMaxInvestmentAmount !== 0 &&
            etoProductMaxInvestmentAmount < minInvestmentAmount && (
              <Col sm={12}>
                <p className="text-error">
                  <FormattedMessage id="eto.form.investment-terms.min-investment-amount-warning" />
                </p>
              </Col>
            )}
            {etoProductMaxInvestmentAmount !== 0 &&
            etoProductMaxInvestmentAmount < maxInvestmentAmount && (
              <Col sm={12}>
                <p className="text-warning">
                  <FormattedMessage id="eto.form.investment-terms.max-investment-amount-warning" />
                </p>
              </Col>
            )}
            <Col sm={12} md={6}>
              <CalculatorField
                value={computedMinNumberOfTokens}
                name="minCapEur"
                label={
                  <FormattedMessage id="eto.form.section.investment-terms.minimum-token-cap" />
                }
                valueType={ECurrency.EUR}
                outputFormat={ENumberOutputFormat.INTEGER}
              />
            </Col>
            <Col sm={12} md={6}>
              <CalculatorField
                value={computedMaxNumberOfTokens}
                name="maxCapEur"
                label={
                  <FormattedMessage id="eto.form.section.investment-terms.maximum-token-cap" />
                }
                valueType={ECurrency.EUR}
                outputFormat={ENumberOutputFormat.INTEGER}
              />
            </Col>
            <Col sm={12} md={6}>
              <CalculatorField
                value={computedMinCapPercent}
                name="minSharesGenerated"
                label={
                  <FormattedMessage id="eto.form.section.investment-terms.minimum-shares-generated" />
                }
                valueType={ENumberFormat.PERCENTAGE}
                outputFormat={ENumberOutputFormat.FULL}
              />
            </Col>
            <Col sm={12} md={6}>
              <CalculatorField
                value={computedMaxCapPercent}
                name="maxSharesGenerated"
                label={
                  <FormattedMessage id="eto.form.section.investment-terms.maximum-shares-generated" />
                }
                valueType={ENumberFormat.PERCENTAGE}
                outputFormat={ENumberOutputFormat.FULL}
              />
            </Col>
          </Row>
        </FormHighlightGroup>
      );
    }}
  </FormikConsumer>
);
