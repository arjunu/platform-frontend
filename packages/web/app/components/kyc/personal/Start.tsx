import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  IKycIndividualData,
  KycPersonalDataSchemaRequiredWithAdditionalData,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import {
  selectIndividualFiles,
  selectIndividualFilesLoading,
  selectKycUploadedFiles,
} from "../../../modules/kyc/selectors";
import { ENotificationText, ENotificationType } from "../../../modules/notifications/types";
import { appConnect } from "../../../store";
import { ECountries } from "../../../utils/enums/countriesEnum";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/buttons";
import { EButtonLayout } from "../../shared/buttons/Button";
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
import { EKycUploadType } from "../../shared/MultiFileUpload";
import { Notification } from "../../shared/notification-widget/Notification";
import { KYCAddDocuments } from "../shared/AddDocuments";
import { KycStep } from "../shared/KycStep";

import * as styles from "./Start.module.scss";

const GENERIC_SHORT_ANSWERS = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes-i-am" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no-i-am-not" />,
};

interface IStateProps {
  currentValues?: IKycIndividualData;
  loadingData: boolean;
  isSavingForm: boolean;
  uploadedFiles: ReturnType<typeof selectKycUploadedFiles>;
  uploadedFilesLoading: ReturnType<typeof selectIndividualFilesLoading>;
}

interface IDispatchProps {
  submitForm: (values: IKycIndividualData, skipContinue?: boolean) => void;
  goBack: () => void;
}

type TProps = IStateProps & IDispatchProps & FormikProps<IKycIndividualData>;

const KYCForm: React.FunctionComponent<TProps> = ({
  uploadedFiles,
  values,
  uploadedFilesLoading,
  ...props
}) => {
  const shouldAddAccreditedInvestorFlow = [values.country, values.nationality].includes(
    ECountries.UNITED_STATES,
  );
  const shouldDisableUntilAccreditationIsUploaded =
    shouldAddAccreditedInvestorFlow && uploadedFiles.length === 0;

  return (
    <FormDeprecated>
      <Row>
        <Col xs={12} md={6} lg={6}>
          <FormField
            label={<FormattedMessage id="form.label.first-name" />}
            name="firstName"
            data-test-id="kyc-personal-start-first-name"
          />
        </Col>
        <Col xs={12} md={6} lg={6}>
          <FormField
            label={<FormattedMessage id="form.label.last-name" />}
            name="lastName"
            data-test-id="kyc-personal-start-last-name"
          />
        </Col>
      </Row>
      <FormFieldDate
        label={<FormattedMessage id="form.label.birth-date" />}
        name="birthDate"
        data-test-id="kyc-personal-start-birth-date"
      />
      <Row>
        <Col xs={12} md={6} lg={6}>
          <FormSelectCountryField
            label={<FormattedMessage id="form.label.place-of-birth" />}
            name="placeOfBirth"
            data-test-id="kyc-personal-start-place-of-birth"
          />
        </Col>
        <Col xs={12} md={6} lg={6}>
          <FormSelectNationalityField
            label={<FormattedMessage id="form.label.nationality" />}
            name="nationality"
            data-test-id="kyc-personal-start-nationality"
          />
        </Col>
      </Row>
      <FormSelectCountryField
        label={<FormattedMessage id="form.label.country" />}
        name="country"
        data-test-id="kyc-personal-start-country"
      />
      {shouldAddAccreditedInvestorFlow && (
        <>
          <FormSelectField
            values={GENERIC_SHORT_ANSWERS}
            label={<FormattedMessage id={"kyc.personal.accredited-us-citizen.question"} />}
            name="isAccreditedUsCitizen"
            data-test-id="kyc-personal-start-is-accredited-us-citizen"
          />

          {values.isAccreditedUsCitizen === BOOL_FALSE_KEY && (
            <Notification
              text={ENotificationText.NOT_ACCREDITED_INVESTOR}
              type={ENotificationType.WARNING}
            />
          )}
          {values.isAccreditedUsCitizen === BOOL_TRUE_KEY && (
            <KYCAddDocuments
              uploadType={EKycUploadType.US_ACCREDITATION}
              /* TODO: Remove in future this is temporary solution for uploading documents
                which is not working without saved form first */
              onEnter={actions.kyc.kycSubmitPersonalData(boolify(values), true)}
              isLoading={props.isSavingForm}
            />
          )}
        </>
      )}
      <div className={styles.buttons}>
        <Button
          layout={EButtonLayout.OUTLINE}
          className={styles.button}
          type="button"
          data-test-id="kyc-personal-start-go-back"
          onClick={props.goBack}
        >
          <FormattedMessage id="form.back" />
        </Button>
        <Button
          type="submit"
          className={styles.button}
          layout={EButtonLayout.PRIMARY}
          disabled={
            uploadedFilesLoading ||
            !props.isValid ||
            props.loadingData ||
            shouldDisableUntilAccreditationIsUploaded
          }
          data-test-id="kyc-personal-start-submit-form"
        >
          <FormattedMessage id="form.save-and-submit" />
        </Button>
      </div>
    </FormDeprecated>
  );
};

const KYCEnhancedForm = withFormik<IStateProps & IDispatchProps, IKycIndividualData>({
  validationSchema: KycPersonalDataSchemaRequiredWithAdditionalData,
  isInitialValid: (props: object) =>
    KycPersonalDataSchemaRequiredWithAdditionalData.isValidSync(
      (props as IStateProps).currentValues,
    ),
  mapPropsToValues: props => unboolify(props.currentValues as IKycIndividualData),
  enableReinitialize: true,
  handleSubmit: (values, props) => {
    props.props.submitForm(boolify(values));
  },
})(KYCForm);

export const KYCPersonalStartComponent: React.FunctionComponent<IStateProps &
  IDispatchProps> = props => (
  <>
    <KycStep
      step={2}
      allSteps={5}
      title={<FormattedMessage id="kyc.personal.details.title" />}
      description={<FormattedMessage id="shared.kyc.select-type.company.description" />}
    />
    <KYCEnhancedForm {...props} />
  </>
);

export const KYCPersonalStart = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      currentValues: state.kyc.individualData,
      loadingData: !!state.kyc.individualDataLoading,
      // TODO: Remove after getting rid of upload document hack
      isSavingForm: !!state.kyc.kycSaving,
      uploadedFiles: selectIndividualFiles(state),
      uploadedFilesLoading: selectIndividualFilesLoading(state),
    }),
    dispatchToProps: dispatch => ({
      goBack: () => dispatch(actions.routing.goToKYCHome()),
      submitForm: (values: IKycIndividualData, skipContinue = false) =>
        dispatch(actions.kyc.kycSubmitPersonalData(values, skipContinue)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualData()),
  }),
)(KYCPersonalStartComponent);
