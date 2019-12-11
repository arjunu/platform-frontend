import { IIntlProps, injectIntlHelpers } from "@neufund/shared"
import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EKycRequestType,
  IKycBusinessData,
  IKycFileInfo,
  KycBusinessDataSchema,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { ECountries } from "../../../utils/enums/countriesEnum";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { Button } from "../../shared/buttons";
import { FormDeprecated, FormField, FormSelectCountryField } from "../../shared/forms";
import { FormSelectStateField } from "../../shared/forms/fields/FormSelectStateField.unsafe";
import { EMimeType } from "../../shared/forms/fields/utils.unsafe";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { KycPanel } from "../KycPanel";
import { kycRoutes } from "../routes";
import { KycDisclaimer } from "../shared/KycDisclaimer";

export const businessSteps = [
  {
    label: <FormattedMessage id="kyc.steps.representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.company-details" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.legal-representation" />,
    isChecked: false,
  },
  {
    label: <FormattedMessage id="kyc.steps.review" />,
    isChecked: false,
  },
];
interface IStateProps {
  currentValues?: IKycBusinessData;
  loadingData: boolean;
  fileUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  submitForm: (values: IKycBusinessData) => void;
  onDropFile: (file: File) => void;
  submit: () => void;
}

type IProps = IStateProps & IDispatchProps;

const KYCForm = injectIntlHelpers<FormikProps<IKycBusinessData> & IProps>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <FormDeprecated>
      <FormField
        data-test-id="kyc-company-business-data-company-name"
        label={formatIntlMessage("form.label.company-name")}
        name="name"
      />
      <FormField
        data-test-id="kyc-company-business-data-registration-number"
        label={formatIntlMessage("form.label.company-registration-number")}
        name="registrationNumber"
      />
      <FormField
        data-test-id="kyc-company-business-data-legal-form"
        label={formatIntlMessage("form.label.legal-form")}
        name="legalForm"
      />
      <FormField
        data-test-id="kyc-company-business-data-street"
        label={formatIntlMessage("form.label.street-and-number")}
        name="street"
      />
      <Row>
        <Col xs={12} md={6} lg={8}>
          <FormField
            data-test-id="kyc-company-business-data-city"
            label={formatIntlMessage("form.label.city")}
            name="city"
          />
        </Col>
        <Col xs={12} md={6} lg={4}>
          <FormField
            data-test-id="kyc-company-business-data-zip-code"
            label={formatIntlMessage("form.label.zip-code")}
            name="zipCode"
          />
        </Col>
      </Row>
      <FormSelectCountryField
        data-test-id="kyc-company-business-data-country"
        label={formatIntlMessage("form.label.country")}
        name="country"
      />
      {props.values.country === ECountries.UNITED_STATES && (
        <FormSelectStateField
          label={formatIntlMessage("form.label.us-state")}
          name="usState"
          data-test-id="kyc-company-business-data-us-state"
        />
      )}
      <FormSelectCountryField
        data-test-id="kyc-company-business-data-jurisdiction"
        label={formatIntlMessage("form.label.jurisdiction")}
        name="jurisdiction"
      />
      <div className="p-4 text-center">
        <Button
          data-test-id="kyc-company-business-data-save"
          type="submit"
          disabled={!props.isValid || props.loadingData}
        >
          <FormattedMessage id="form.button.save" />
        </Button>
      </div>
    </FormDeprecated>
  ),
);

const KYCEnhancedForm = withFormik<IProps, IKycBusinessData>({
  validationSchema: KycBusinessDataSchema,
  mapPropsToValues: props => props.currentValues as IKycBusinessData,
  enableReinitialize: true,
  isInitialValid: (props: any) => KycBusinessDataSchema.isValidSync(props.currentValues),
  handleSubmit: (values, props) => props.props.submitForm(values),
})(KYCForm);

const FileUploadList: React.FunctionComponent<IProps & { dataValid: boolean }> = props => {
  if (!props.dataValid) return <div />;
  return (
    <div>
      <br />
      <h4>
        <FormattedMessage id="kyc.business.business-data.supporting-documents" />
      </h4>
      <br />
      <FormattedMessage id="kyc.business.business-data.upload-documents" />
      <br />
      <br />
      <MultiFileUpload
        uploadType={EKycRequestType.BUSINESS}
        acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
        data-test-id="kyc-company-business-supporting-documents"
        onDropFile={props.onDropFile}
        files={props.files}
        fileUploading={props.fileUploading}
      />
    </div>
  );
};

export const KycBusinessDataComponent = ({
  intl: { formatIntlMessage },
  ...props
}: IProps & IIntlProps) => {
  const dataValid = KycBusinessDataSchema.isValidSync(props.currentValues);
  return (
    <KycPanel
      steps={businessSteps}
      title={<FormattedMessage id="kyc.panel.business-verification" />}
      description={formatIntlMessage("kyc.business.business-data.description")}
      backLink={kycRoutes.start}
    >
      <KycDisclaimer className="pb-5" />
      <KYCEnhancedForm {...props} />
      <FileUploadList {...props} dataValid={dataValid} />
      <div className="p-4 text-center">
        <Button
          data-test-id="kyc-company-business-supporting-continue"
          type="submit"
          disabled={!props.currentValues || props.files.length === 0}
          onClick={props.submit}
        >
          <FormattedMessage id="form.button.continue" />
        </Button>
      </div>
    </KycPanel>
  );
};

export const KycBusinessData = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      currentValues: state.kyc.businessData,
      loadingData: !!state.kyc.businessDataLoading,
      files: state.kyc.businessFiles,
      filesLoading: !!state.kyc.businessFilesLoading,
      fileUploading: !!state.kyc.businessFileUploading,
    }),
    dispatchToProps: dispatch => ({
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadBusinessDocument(file)),
      submit: () => dispatch(actions.routing.goToKYCLegalRepresentative()),
      submitForm: (values: IKycBusinessData) => dispatch(actions.kyc.kycSubmitBusinessData(values)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadBusinessData());
      dispatch(actions.kyc.kycLoadBusinessDocumentList());
    },
  }),
  injectIntlHelpers,
)(KycBusinessDataComponent);
