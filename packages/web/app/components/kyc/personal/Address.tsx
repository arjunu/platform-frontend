import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import {
  IKycIndividualData,
  KycPersonalAddressSchemaRequired,
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
import { appConnect } from "../../../store";
import { ECountries } from "../../../utils/enums/countriesEnum";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/buttons";
import { EButtonLayout, EButtonSize } from "../../shared/buttons/Button";
import { ButtonGroup } from "../../shared/buttons/ButtonGroup";
import { boolify, FormDeprecated, FormField, unboolify } from "../../shared/forms";
import { FormSelectCountryField } from "../../shared/forms/fields/FormSelectCountryField.unsafe";
import { FormSelectStateField } from "../../shared/forms/fields/FormSelectStateField.unsafe";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { EKycUploadType } from "../../shared/MultiFileUpload";
import { KYCAddDocuments } from "../shared/AddDocuments";
import { KycStep } from "../shared/KycStep";

import * as styles from "./Start.module.scss";

interface IStateProps {
  currentValues?: IKycIndividualData;
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
  const shouldDisableSubmit =
    uploadedFilesLoading ||
    !props.isValid ||
    props.loadingData ||
    uploadedFiles.length === 0 ||
    individualFileUploading;

  return (
    <>
      <KycStep
        step={3}
        allSteps={5}
        title={<FormattedMessage id="kyc.personal.address.title" />}
        description={<FormattedMessage id="kyc.personal.address.description" />}
        buttonAction={() => props.submitAndClose(values)}
        data-test-id="kyc.individual-address"
      />
      <FormDeprecated>
        <FormField
          label={<FormattedMessage id="form.label.street-and-number" />}
          name="street"
          data-test-id="kyc-personal-address-street"
        />
        <FormField
          label={<FormattedMessage id="form.label.additional-information" />}
          name="additionalInformation"
          data-test-id="kyc-personal-address-additional"
        />
        {/*TODO: Remove while reworking inputs*/}
        <span>
          <FormattedMessage id="form.label.additional-information.description" />
        </span>
        <Row>
          <Col xs={12} md={6} lg={8}>
            <FormField
              label={<FormattedMessage id="form.label.city" />}
              name="city"
              data-test-id="kyc-personal-start-city"
            />
          </Col>
          <Col xs={12} md={6} lg={4}>
            <FormField
              label={<FormattedMessage id="form.label.zip-code" />}
              name="zipCode"
              data-test-id="kyc-personal-start-zip-code"
            />
          </Col>
        </Row>

        <Row>
          {values.country === ECountries.UNITED_STATES && (
            <Col xs={12} md={6} lg={6}>
              <FormSelectStateField
                label={<FormattedMessage id="form.label.us-state" />}
                name="usState"
                data-test-id="kyc-personal-start-us-state"
              />
            </Col>
          )}

          <Col>
            <FormSelectCountryField
              label={<FormattedMessage id="form.label.country-address" />}
              name="country"
              data-test-id="kyc-personal-start-country"
              disabled={true}
            />
          </Col>
        </Row>

        <KYCAddDocuments
          uploadType={EKycUploadType.PROOF_OF_ADDRESS}
          isLoading={props.isSavingForm}
        />

        <ButtonGroup className={styles.buttons}>
          <Button
            layout={EButtonLayout.OUTLINE}
            size={EButtonSize.HUGE}
            className={styles.button}
            data-test-id="kyc-personal-address-go-back"
            onClick={props.goBack}
          >
            <FormattedMessage id="form.back" />
          </Button>
          <Button
            type="submit"
            layout={EButtonLayout.PRIMARY}
            size={EButtonSize.HUGE}
            className={styles.button}
            disabled={shouldDisableSubmit}
            data-test-id="kyc-personal-address-submit-form"
          >
            <FormattedMessage id="form.save-and-submit" />
          </Button>
        </ButtonGroup>
      </FormDeprecated>
    </>
  );
};

const KYCEnhancedForm = withFormik<IStateProps & IDispatchProps, IKycIndividualData>({
  validationSchema: KycPersonalAddressSchemaRequired,
  isInitialValid: (props: object) =>
    KycPersonalAddressSchemaRequired.isValidSync((props as IStateProps).currentValues),
  mapPropsToValues: props => unboolify(props.currentValues as IKycIndividualData),
  enableReinitialize: true,
  handleSubmit: (values, { props }) => {
    props.submitForm(boolify(values));
  },
})(KYCForm);

export const KYCPersonalAddress = compose<IStateProps & IDispatchProps, {}>(
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
      goBack: () => dispatch(actions.routing.goToKYCIndividualStart()),
      submitForm: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitPersonalAddress(values)),
      submitAndClose: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitPersonalAddressAndClose(values)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualData()),
  }),
  branch<IStateProps>(props => props.loadingData, renderComponent(LoadingIndicator)),
)(KYCEnhancedForm);
