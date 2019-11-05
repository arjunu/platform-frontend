import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EKycRequestType,
  IKycIndividualData,
  KycIndividualDataSchemaRequiredWithAdditionalData,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { ENotificationText, ENotificationType } from "../../../modules/notifications/types";
import { appConnect } from "../../../store";
import { ECountries } from "../../../utils/enums/countriesEnum";
import { injectIntlHelpers } from "../../../utils/injectIntlHelpers.unsafe";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/buttons";
import {
  BOOL_FALSE_KEY,
  BOOL_TRUE_KEY,
  boolify,
  FormDeprecated,
  FormField,
  FormFieldDate,
  FormSelectCountryField,
  FormSelectField,
  FormSelectNationalityField,
  NONE_KEY,
  unboolify,
} from "../../shared/forms";
import { FormSelectStateField } from "../../shared/forms/fields/FormSelectStateField.unsafe";
import { Notification } from "../../shared/notification-widget/Notification";
import { Tooltip } from "../../shared/tooltips";
import { KycPanel } from "../KycPanel";
import { kycRoutes } from "../routes";
import { KYCAddDocuments } from "../shared/AddDocuments";
import { KycDisclaimer } from "../shared/KycDisclaimer";

export const personalSteps = [
  {
    label: <FormattedMessage id="kyc.steps.representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.personal-details" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.documents-verification" />,
    isChecked: false,
  },
  {
    label: <FormattedMessage id="kyc.steps.review" />,
    isChecked: false,
  },
];

const GENERIC_SHORT_ANSWERS = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes-i-am" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no-i-am-not" />,
};

const HIGH_INCOME_VALUES = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no" />,
};

interface IStateProps {
  currentValues?: IKycIndividualData;
  loadingData: boolean;
  isSavingForm: boolean;
}

interface IDispatchProps {
  submitForm: (values: IKycIndividualData, skipContinue?: boolean) => void;
}

type IProps = IStateProps & IDispatchProps & FormikProps<IKycIndividualData>;

const KYCForm = injectIntlHelpers<IProps & IKycIndividualData & IDispatchProps>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <FormDeprecated>
      <h5 className="mb-3">
        <FormattedMessage id="kyc.personal.personal-information" />
      </h5>
      <FormField
        label={formatIntlMessage("form.label.first-name")}
        name="firstName"
        data-test-id="kyc-personal-start-first-name"
      />
      <FormField
        label={formatIntlMessage("form.label.last-name")}
        name="lastName"
        data-test-id="kyc-personal-start-last-name"
      />
      <FormFieldDate
        label={formatIntlMessage("form.label.birth-date")}
        name="birthDate"
        data-test-id="kyc-personal-start-birth-date"
      />
      <FormSelectCountryField
        label={formatIntlMessage("form.label.place-of-birth")}
        name="placeOfBirth"
        data-test-id="kyc-personal-start-place-of-birth"
      />
      <FormSelectNationalityField
        label={formatIntlMessage("form.label.nationality")}
        name="nationality"
        data-test-id="kyc-personal-start-nationality"
      />
      <br />
      <FormSelectField
        values={GENERIC_SHORT_ANSWERS}
        label={
          <>
            <FormattedMessage id={"kyc.personal.politically-exposed.question"} />
            <Tooltip
              content={
                <FormattedHTMLMessage
                  tagName="span"
                  id="kyc.personal.politically-exposed.tooltip"
                />
              }
            />
          </>
        }
        name="isPoliticallyExposed"
        extraMessage={
          props.values.isPoliticallyExposed === ("true" as any) ? (
            <FormattedMessage id={"kyc.personal.politically-exposed.disclaimer"} />
          ) : (
            undefined
          )
        }
        data-test-id="kyc-personal-start-is-politically-exposed"
      />
      {process.env.NF_DISABLE_HIGH_INCOME !== "1" && (
        <FormSelectField
          values={HIGH_INCOME_VALUES}
          label={formatIntlMessage("kyc.personal.high-income")}
          name="isHighIncome"
          extraMessage={<FormattedMessage id={"kyc.personal.income.disclaimer"} />}
          data-test-id="kyc-personal-start-has-high-income"
        />
      )}
      <h5 className="mb-3 mt-5">
        <FormattedMessage id="kyc.personal.current.address" />
      </h5>
      <FormSelectCountryField
        label={formatIntlMessage("form.label.country")}
        name="country"
        data-test-id="kyc-personal-start-country"
      />
      <FormField
        label={formatIntlMessage("form.label.street-and-number")}
        name="street"
        data-test-id="kyc-personal-start-street"
      />
      <Row>
        <Col xs={12} md={6} lg={8}>
          <FormField
            label={formatIntlMessage("form.label.city")}
            name="city"
            data-test-id="kyc-personal-start-city"
          />
        </Col>
        <Col xs={12} md={6} lg={4}>
          <FormField
            label={formatIntlMessage("form.label.zip-code")}
            name="zipCode"
            data-test-id="kyc-personal-start-zip-code"
          />
        </Col>
      </Row>
      {props.values.country === ECountries.UNITED_STATES && (
        <FormSelectStateField
          label={formatIntlMessage("form.label.us-state")}
          name="usState"
          data-test-id="kyc-personal-start-us-state"
        />
      )}
      {[props.values.country, props.values.nationality].includes(ECountries.UNITED_STATES) && (
        <>
          <h5 className="mb-3 mt-5">
            <FormattedMessage id="kyc.personal.accreditation-status" />
          </h5>
          <FormSelectField
            values={GENERIC_SHORT_ANSWERS}
            label={
              <>
                <FormattedMessage id={"kyc.personal.accredited-us-citizen.question"} />
                <Tooltip
                  content={
                    <FormattedHTMLMessage
                      tagName="span"
                      id="kyc.personal.accredited-us-citizen.tooltip"
                    />
                  }
                />
              </>
            }
            name="isAccreditedUsCitizen"
            data-test-id="kyc-personal-start-is-accredited-us-citizen"
          />

          {props.values.isAccreditedUsCitizen === BOOL_FALSE_KEY && (
            <Notification
              text={ENotificationText.NOT_ACCREDITED_INVESTOR}
              type={ENotificationType.WARNING}
            />
          )}
          {props.values.isAccreditedUsCitizen === BOOL_TRUE_KEY && (
            <KYCAddDocuments
              uploadType={EKycRequestType.US_ACCREDITATION}
              /* TODO: Remove in future this is temporary solution for uploading documents
                which is not working without saved form first */
              onEnter={actions.kyc.kycSubmitIndividualData(boolify(props.values), true)}
              isLoading={props.isSavingForm}
            />
          )}
        </>
      )}
      <div className="p-4 text-center">
        <Button
          type="submit"
          disabled={!props.isValid || props.loadingData}
          data-test-id="kyc-personal-start-submit-form"
        >
          <FormattedMessage id={"form.save-and-submit"} />
        </Button>
      </div>
    </FormDeprecated>
  ),
);

const KYCEnhancedForm = withFormik<IStateProps & IDispatchProps, IKycIndividualData>({
  validationSchema: KycIndividualDataSchemaRequiredWithAdditionalData,
  isInitialValid: (props: any) =>
    KycIndividualDataSchemaRequiredWithAdditionalData.isValidSync(props.currentValues),
  mapPropsToValues: props => unboolify(props.currentValues as IKycIndividualData),
  enableReinitialize: true,
  handleSubmit: (values, props) => {
    props.props.submitForm(boolify(values));
  },
})(KYCForm);

export const KYCPersonalStartComponent: React.FunctionComponent<
  IStateProps & IDispatchProps
> = props => (
  <KycPanel
    steps={personalSteps}
    backLink={kycRoutes.start}
    isMaxWidth={false}
    title={<FormattedMessage id="kyc.panel.individual-verification" />}
  >
    <KycDisclaimer className="pb-5" />
    <KYCEnhancedForm {...props} />
  </KycPanel>
);

export const KYCPersonalStart = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      currentValues: state.kyc.individualData,
      loadingData: !!state.kyc.individualDataLoading,
      // TODO: Remove after getting rid of upload document hack
      isSavingForm: !!state.kyc.kycSaving,
    }),
    dispatchToProps: dispatch => ({
      submitForm: (values: IKycIndividualData, skipContinue = false) =>
        dispatch(actions.kyc.kycSubmitIndividualData(values, skipContinue)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualData()),
  }),
)(KYCPersonalStartComponent);
