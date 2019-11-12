import { FormikConsumer } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { branch, compose, fromRenderProps, renderComponent, setDisplayName } from "recompose";

import { symbols } from "../../../../di/symbols";
import { getEtoTermsSchema, TEtoSpecsData } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { etoFormIsReadonly } from "../../../../lib/api/eto/EtoApiUtils";
import {
  EAssetType,
  EOfferingDocumentType,
  EtoProductSchema,
  TEtoProduct,
  TEtoProducts,
} from "../../../../lib/api/eto/EtoProductsApi.interfaces";
import { ILogger } from "../../../../lib/dependencies/logger";
import * as YupTS from "../../../../lib/yup-ts.unsafe";
import { actions } from "../../../../modules/actions";
import {
  selectAvailableProducts,
  selectIssuerEto,
  selectIssuerEtoSaving,
  selectIssuerEtoState,
} from "../../../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../../../modules/eto-flow/types";
import { appConnect } from "../../../../store";
import { DeepReadonly, RequiredByKeys } from "../../../../types";
import { ContainerContext, TContainerContext } from "../../../../utils/InversifyProvider";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button, EButtonLayout } from "../../../shared/buttons";
import {
  ECheckboxLayout,
  FormField,
  FormFieldCheckbox,
  FormFieldCheckboxGroup,
  FormFieldLabel,
  FormFieldLayout,
  FormHighlightGroup,
  FormLabel,
  FormRange,
  FormToggle,
  RadioButtonLayout,
} from "../../../shared/forms/index";
import { List } from "../../../shared/List";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import { Tooltip } from "../../../shared/tooltips";
import { convert, parseStringToInteger } from "../../utils";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";
import { convertAmountToText, getProductMeaningfulName } from "./etoTermsUtils";

import * as styles from "../Shared.module.scss";

interface IStateProps {
  readonly: boolean;
  savingData: boolean;
  eto: TEtoSpecsData;
  availableProducts?: DeepReadonly<TEtoProducts>;
}

interface IDispatchProps {
  saveData: (values: TEtoSpecsData) => void;
  changeProductType: (productId: string) => void;
}

interface IContainerProps {
  logger: ILogger | undefined;
}

type IProps = RequiredByKeys<IStateProps, "availableProducts"> & IDispatchProps & IContainerProps;

interface ICurrencies {
  [key: string]: string;
}

const CURRENCIES: ICurrencies = {
  eth: "ETH",
  eur_t: "nEUR",
};

const currencies = Object.keys(CURRENCIES);

const EtoRegistrationTermsAllowedChanges: React.FunctionComponent<IProps> = ({ readonly }) => (
  <FormikConsumer>
    {({ values }) => (
      <>
        <p>
          <FormattedMessage id="eto.form.section.eto-terms.settings-ready-for-configuration" />
        </p>

        {values.product.canSetTransferability && (
          <div className="form-group">
            <FormFieldLabel name="tokenTradeableOnSuccess">
              <FormattedMessage id="eto.form.section.eto-terms.when-token-tradable.label" />
            </FormFieldLabel>
            <FormToggle
              name="tokenTradeableOnSuccess"
              enabledLabel={
                <FormattedMessage id="eto.form.section.eto-terms.when-token-tradable.value.enabled" />
              }
              disabledLabel={
                <FormattedMessage id="eto.form.section.eto-terms.when-token-tradable.value.disabled" />
              }
              disabled={readonly}
            />
          </div>
        )}

        <Row>
          <Col>
            <FormField
              label={<FormattedMessage id="eto.form.section.eto-terms.minimum-ticket-size" />}
              placeholder={values.product.minTicketSize || "Unlimited"}
              prefix="€"
              name="minTicketEur"
              disabled={readonly}
            />
          </Col>
          <Col>
            <FormField
              label={<FormattedMessage id="eto.form.section.eto-terms.maximum-ticket-size" />}
              placeholder={values.product.maxTicketSize || "Unlimited"}
              prefix="€"
              name="maxTicketEur"
              disabled={readonly}
            />
          </Col>
        </Row>

        <div className="form-group">
          <FormFieldLabel name="whitelistDurationDays">
            <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration" />
          </FormFieldLabel>
          <FormRange
            disabled={readonly}
            name="whitelistDurationDays"
            unitMin={
              <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-min" />
            }
            unitMax={
              <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-max" />
            }
          />
        </div>

        <div className="form-group">
          <FormFieldLabel name="publicDurationDays">
            <FormattedMessage id="eto.form.section.eto-terms.public-offer-duration" />
          </FormFieldLabel>
          <FormRange
            disabled={readonly}
            name="publicDurationDays"
            unit={<FormattedMessage id="eto.form.section.eto-terms.public-offer-duration.unit" />}
          />
        </div>

        <div className="form-group">
          <FormFieldLabel name="signingDurationDays">
            <FormattedMessage id="eto.form.section.eto-terms.signing-duration" />
          </FormFieldLabel>
          <FormRange
            disabled={readonly}
            name="signingDurationDays"
            unit={<FormattedMessage id="eto.form.section.eto-terms.signing-duration.unit" />}
          />
        </div>
      </>
    )}
  </FormikConsumer>
);

const ProductHighlights: React.FunctionComponent<{ product: TEtoProduct }> = ({ product }) => (
  <List
    className="mb-0"
    items={[
      <FormattedMessage
        id="eto.form.section.eto-terms.product.max-investment-amount"
        values={{ amount: convertAmountToText(product.maxInvestmentAmount) }}
      />,
      <FormattedMessage
        id="eto.form.section.eto-terms.product.min-ticket-size"
        values={{ amount: convertAmountToText(product.minTicketSize) }}
      />,
      <FormattedMessage
        id="eto.form.section.eto-terms.product.asset-type"
        values={{ type: product.assetType }}
      />,
      <FormattedMessage
        id="eto.form.section.eto-terms.product.document-type"
        values={{ type: product.offeringDocumentType }}
      />,
      <FormattedMessage
        id="eto.form.section.eto-terms.product.is-transferable"
        values={{ isTransferable: product.canSetTransferability }}
      />,
    ]}
  />
);

const EtoRegistrationProductType: React.FunctionComponent<IProps> = ({
  readonly,
  availableProducts,
  changeProductType,
  logger,
}) => (
  <FormikConsumer>
    {({ values }) => (
      <>
        <div className="form-group">
          <FormLabel for="productId">
            <FormattedMessage id="eto.form.section.eto-terms.eto-type" />
          </FormLabel>

          {availableProducts.map(product => {
            const productMeaningfulName = getProductMeaningfulName(product.name);

            if (productMeaningfulName === undefined) {
              logger && logger.warn(`Meaningful name not provided for "${product.name}" product`);
            }

            return (
              <RadioButtonLayout
                key={product.id}
                layout={ECheckboxLayout.BLOCK}
                disabled={readonly}
                name="productId"
                label={
                  <Tooltip
                    data-test-id={`eto-terms.product.${product.name.replace(/\s/g, "-")}.tooltip`}
                    content={<ProductHighlights product={product} />}
                    placement="right"
                    delay={0}
                    preventDefault={false}
                  >
                    {productMeaningfulName || product.name}
                  </Tooltip>
                }
                value={product.id}
                data-test-id={`form.name.productId.${product.name}`}
                checked={values.product.id === product.id}
                onChange={() => changeProductType(product.id)}
              />
            );
          })}
        </div>

        <FormHighlightGroup
          title={<FormattedMessage id="eto.form.section.eto-terms.setting-auto-calculated" />}
        >
          <div className="form-group">
            <FormFieldLabel name="product.assetType">
              <FormattedMessage id="eto.form.section.eto-terms.product.asset-type.label" />
            </FormFieldLabel>
            <FormToggle
              name="product.assetType"
              trueValue={EAssetType.SECURITY}
              falseValue={EAssetType.VMA}
              enabledLabel={
                <FormattedMessage
                  id="eto.form.section.eto-terms.product.asset-type"
                  values={{ type: EAssetType.SECURITY }}
                />
              }
              disabledLabel={
                <FormattedMessage
                  id="eto.form.section.eto-terms.product.asset-type"
                  values={{ type: EAssetType.VMA }}
                />
              }
              disabled={true}
            />
          </div>

          <div className="form-group">
            <FormFieldLabel name="product.offeringDocumentType">
              <FormattedMessage id="eto.form.section.eto-terms.product.document-type.label" />
            </FormFieldLabel>
            <FormToggle
              name="product.offeringDocumentType"
              trueValue={EOfferingDocumentType.MEMORANDUM}
              falseValue={EOfferingDocumentType.PROSPECTUS}
              enabledLabel={
                <FormattedMessage
                  id="eto.form.section.eto-terms.product.document-type"
                  values={{ type: EOfferingDocumentType.MEMORANDUM }}
                />
              }
              disabledLabel={
                <FormattedMessage
                  id="eto.form.section.eto-terms.product.document-type"
                  values={{ type: EOfferingDocumentType.PROSPECTUS }}
                />
              }
              disabled={true}
            />
          </div>

          <div className="form-group">
            <FormFieldLabel name="prospectusLanguage">
              <FormattedMessage id="eto.form.section.eto-terms.product.document-language.label" />
            </FormFieldLabel>
            <FormToggle
              name="prospectusLanguage"
              trueValue={"de"}
              falseValue={"en"}
              enabledLabel={"DE"}
              disabledLabel={"EN"}
              disabled={true}
            />
          </div>

          <div className="form-group">
            <FormFieldLabel name="product.jurisdiction">
              <FormattedMessage id="eto.form.section.eto-terms.product.jurisdiction.label" />
            </FormFieldLabel>
            <FormToggle
              name="product.jurisdiction"
              trueValue={"DE"}
              falseValue={"LI"}
              enabledLabel={"DE"}
              disabledLabel={"LI"}
              disabled={true}
            />
          </div>

          <div className="form-group">
            <FormFieldCheckboxGroup
              name="currencies"
              label={<FormattedMessage id="eto.form.section.eto-terms.fundraising-currency" />}
            >
              {currencies.map(currency => (
                <FormFieldCheckbox
                  key={currency}
                  label={CURRENCIES[currency]}
                  value={currency}
                  disabled={true}
                />
              ))}
            </FormFieldCheckboxGroup>
          </div>

          {values.product.maxInvestmentAmount === 0 ? (
            <FormFieldLayout
              name="product.maxInvestmentAmount"
              disabled={true}
              label={<FormattedMessage id="eto.form.section.eto-terms.product.max-amount.label" />}
              prefix="€"
              value={"Unlimited"}
            />
          ) : (
            <FormField
              prefix="€"
              label={<FormattedMessage id="eto.form.section.eto-terms.product.max-amount.label" />}
              name="product.maxInvestmentAmount"
              disabled={true}
            />
          )}

          <div className="form-group mb-0">
            <FormFieldLabel name="product.canSetTransferability">
              <FormattedMessage id="eto.form.section.eto-terms.product.is-transferable.label" />
            </FormFieldLabel>

            <FormToggle
              name="enableTransferOnSuccess"
              enabledLabel={<FormattedMessage id="form.select.yes" />}
              disabledLabel={<FormattedMessage id="form.select.no" />}
              disabled={true}
            />
          </div>
        </FormHighlightGroup>
      </>
    )}
  </FormikConsumer>
);

const EtoRegistrationTermsLayout: React.FunctionComponent<IProps> = props => {
  const schema = React.useMemo(() => {
    const EtoTermsSchema = getEtoTermsSchema(props.eto.product);

    return EtoTermsSchema.toYup().concat(YupTS.object({ product: EtoProductSchema }).toYup());
  }, [props.eto.product]);

  return (
    <EtoFormBase
      title={<FormattedMessage id="eto.form.eto-terms.title" />}
      enableReinitialize={true}
      validationSchema={schema}
      initialValues={props.eto}
      onSubmit={props.saveData}
    >
      <Section>
        <EtoRegistrationProductType {...props} />

        <EtoRegistrationTermsAllowedChanges {...props} />
      </Section>

      {!props.readonly && (
        <Section className={styles.buttonSection}>
          <Button
            layout={EButtonLayout.PRIMARY}
            type="submit"
            isLoading={props.savingData}
            data-test-id="eto-registration-eto-terms-submit"
          >
            <FormattedMessage id="form.button.save" />
          </Button>
        </Section>
      )}
    </EtoFormBase>
  );
};

const EtoRegistrationTerms = compose<IProps, {}>(
  setDisplayName(EEtoFormTypes.EtoTerms),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.etoFlow.loadProducts());
    },
  }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      savingData: selectIssuerEtoSaving(s),
      eto: selectIssuerEto(s)!,
      readonly: etoFormIsReadonly(EEtoFormTypes.EtoTerms, selectIssuerEtoState(s)),
      availableProducts: selectAvailableProducts(s),
    }),
    dispatchToProps: dispatch => ({
      saveData: (eto: TEtoSpecsData) => {
        const convertedEto = convert(fromFormState)(eto);
        dispatch(actions.etoFlow.saveEtoStart(convertedEto));
      },
      changeProductType: (productId: string) => {
        dispatch(actions.etoFlow.changeProductType(productId));
      },
    }),
  }),
  branch<IStateProps>(
    props => props.availableProducts === undefined,
    renderComponent(LoadingIndicator),
  ),
  fromRenderProps<IContainerProps, unknown, TContainerContext>(
    ContainerContext.Consumer,
    container => ({ logger: container && container.get<ILogger>(symbols.logger) }),
  ),
)(EtoRegistrationTermsLayout);

const fromFormState = {
  publicDurationDays: parseStringToInteger(),
  signingDurationDays: parseStringToInteger(),
  whitelistDurationDays: parseStringToInteger(),
  maxTicketEur: parseStringToInteger(),
  minTicketEur: parseStringToInteger(),
};

export { EtoRegistrationTerms, EtoRegistrationTermsLayout };
