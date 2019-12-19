import { FormikProps, withFormik } from "formik";
import { defaultTo } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import {
  IKycIndividualData,
  KycPersonalDataSchemaRequiredWithAdditionalData,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import {
  selectIndividualData,
  selectIndividualDataLoading,
  selectIndividualFiles,
  selectIndividualFilesLoading,
  selectIndividualFileUploading,
  selectIsSavingKycForm,
  selectKycUploadedFiles,
} from "../../../modules/kyc/selectors";
import { ENotificationType } from "../../../modules/notifications/types";
import { appConnect } from "../../../store";
import { ECountries } from "../../../utils/enums/countriesEnum";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/buttons";
import { EButtonLayout, EButtonSize } from "../../shared/buttons/Button";
import { ButtonGroup } from "../../shared/buttons/ButtonGroup";
import {
  BOOL_FALSE_KEY,
  BOOL_TRUE_KEY,
  FormDeprecated,
  FormField,
  FormFieldDate,
  FormSelectCountryField,
  FormSelectField,
  FormSelectNationalityField,
  NONE_KEY,
} from "../../shared/forms";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
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
  currentValues: IKycIndividualData | undefined;
  loadingData: boolean;
  isSavingForm: boolean;
  uploadedFiles: ReturnType<typeof selectKycUploadedFiles>;
  uploadedFilesLoading: ReturnType<typeof selectIndividualFilesLoading>;
  individualFileUploading: ReturnType<typeof selectIndividualFileUploading>;
}

interface IDispatchProps {
  submitForm: (values: IKycIndividualData) => void;
  submitAndClose: (values: IKycIndividualData) => void;
  goBack: () => void;
}

type TProps = IStateProps & IDispatchProps & FormikProps<IKycIndividualData>;

const KYCForm: React.FunctionComponent<TProps> = ({
  uploadedFiles,
  values,
  uploadedFilesLoading,
  individualFileUploading,
  ...props
}) => {
  const shouldAddAccreditedInvestorFlow = [values.country, values.nationality].includes(
    ECountries.UNITED_STATES,
  );
  const shouldDisableUntilAccreditationIsUploaded =
    shouldAddAccreditedInvestorFlow && uploadedFiles.length === 0;

  const shouldDisableSubmit =
    uploadedFilesLoading ||
    !props.isValid ||
    props.loadingData ||
    shouldDisableUntilAccreditationIsUploaded;

  return (
    <>
      <KycStep
        step={2}
        allSteps={5}
        title={<FormattedMessage id="kyc.personal.details.title" />}
        description={<FormattedMessage id="kyc.personal.details.description" />}
        buttonAction={() => props.submitAndClose(values)}
        data-test-id="kyc.individual-start"
      />
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
        <Row>
          <Col xs={12} md={6} lg={6}>
            <FormFieldDate
              label={<FormattedMessage id="form.label.birth-date" />}
              name="birthDate"
              data-test-id="kyc-personal-start-birth-date"
            />
          </Col>
        </Row>
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

            {values.isAccreditedUsCitizen === false && (
              <Notification
                className="mb-4"
                text={<FormattedMessage id="notifications.not-accredited-investor" />}
                type={ENotificationType.WARNING}
              />
            )}
            {values.isAccreditedUsCitizen === true && (
              <KYCAddDocuments
                onEnter={actions.kyc.kycSubmitPersonalDataNoRedirect(values)}
                uploadType={EKycUploadType.US_ACCREDITATION}
                // We can skip showing loader if there is a file already uploaded
                isLoading={props.isSavingForm && uploadedFiles.length === 0}
              />
            )}
          </>
        )}
        <ButtonGroup className={styles.buttons}>
          <Button
            layout={EButtonLayout.OUTLINE}
            size={EButtonSize.HUGE}
            className={styles.button}
            data-test-id="kyc-personal-start-go-back"
            onClick={props.goBack}
          >
            <FormattedMessage id="form.back" />
          </Button>
          <Button
            type="submit"
            className={styles.button}
            layout={EButtonLayout.PRIMARY}
            size={EButtonSize.HUGE}
            disabled={shouldDisableSubmit}
            isLoading={props.isSavingForm}
            data-test-id="kyc-personal-start-submit-form"
          >
            <FormattedMessage id="form.save-and-submit" />
          </Button>
        </ButtonGroup>
      </FormDeprecated>
    </>
  );
};

const defaultEmptyObject = defaultTo<IKycIndividualData | {}>({});

const KYCEnhancedForm = withFormik<IStateProps & IDispatchProps, IKycIndividualData>({
  validationSchema: KycPersonalDataSchemaRequiredWithAdditionalData,
  validateOnMount: true,
  enableReinitialize: true,
  mapPropsToValues: props => defaultEmptyObject(props.currentValues),
  handleSubmit: (values, props) => {
    props.props.submitForm(values);
  },
})(KYCForm);

export const KYCPersonalStart = compose<IStateProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      currentValues: selectIndividualData(state),
      loadingData: selectIndividualDataLoading(state),
      isSavingForm: selectIsSavingKycForm(state),
      uploadedFiles: selectIndividualFiles(state),
      uploadedFilesLoading: selectIndividualFilesLoading(state),
      individualFileUploading: selectIndividualFileUploading(state),
    }),
    dispatchToProps: dispatch => ({
      goBack: () => dispatch(actions.routing.goToKYCHome()),
      submitForm: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitPersonalData(values)),
      submitAndClose: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitPersonalDataAndClose(values)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualData()),
  }),
  branch<IStateProps>(props => props.loadingData, renderComponent(LoadingIndicator)),
)(KYCEnhancedForm);
