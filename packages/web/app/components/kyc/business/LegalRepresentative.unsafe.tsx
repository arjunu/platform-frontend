import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EKycRequestType,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  KycLegalRepresentativeSchemaRequired,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { ECountries } from "../../../utils/enums/countriesEnum";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers.unsafe";
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
import { EMimeType } from "../../shared/forms/fields/utils.unsafe";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { Tooltip } from "../../shared/tooltips";
import { KycPanel } from "../KycPanel";
import { kycRoutes } from "../routes";
import { KYCBeneficialOwners } from "./BeneficialOwners";

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
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.review" />,
    isChecked: false,
  },
];

const PEP_VALUES = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes-i-am" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no-i-am-not" />,
};

interface IStateProps {
  legalRepresentative?: IKycLegalRepresentative;
  loadingData: boolean;
  fileUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
  businessData?: IKycBusinessData;
}

interface IDispatchProps {
  submitForm: (values: IKycIndividualData) => void;
  onDropFile: (file: File) => void;
  onContinue: () => void;
}

type IProps = IStateProps & IDispatchProps;

const KYCForm = injectIntlHelpers<FormikProps<IKycLegalRepresentative> & IProps>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <FormDeprecated>
      <FormField
        data-test-id="kyc-company-legal-representative-first-name"
        label={formatIntlMessage("form.label.first-name")}
        name="firstName"
      />
      <FormField
        data-test-id="kyc-company-legal-representative-last-name"
        label={formatIntlMessage("form.label.last-name")}
        name="lastName"
      />
      <FormFieldDate label={formatIntlMessage("form.label.birth-date")} name="birthDate" />

      <FormField
        data-test-id="kyc-company-legal-representative-address"
        label={formatIntlMessage("form.label.address")}
        name="street"
      />
      <Row>
        <Col xs={12} md={6} lg={8}>
          <FormField
            data-test-id="kyc-company-legal-representative-city"
            label={formatIntlMessage("form.label.city")}
            name="city"
          />
        </Col>
        <Col xs={12} md={6} lg={4}>
          <FormField
            data-test-id="kyc-company-legal-representative-zip-code"
            label={formatIntlMessage("form.label.zip-code")}
            name="zipCode"
          />
        </Col>
      </Row>
      <FormSelectCountryField
        data-test-id="kyc-company-legal-representative-country"
        label={formatIntlMessage("form.label.country")}
        name="country"
      />
      {props.values.country === ECountries.UNITED_STATES && (
        <FormSelectStateField
          label={formatIntlMessage("form.label.us-state")}
          name="usState"
          data-test-id="kyc-company-legal-representative-us-state"
        />
      )}
      <FormSelectCountryField
        label={formatIntlMessage("form.label.place-of-birth")}
        name="placeOfBirth"
        data-test-id="kyc-company-legal-representative-place-of-birth"
      />
      <FormSelectNationalityField
        label={formatIntlMessage("form.label.nationality")}
        name="nationality"
        data-test-id="kyc-company-legal-representative-nationality"
      />
      <FormSelectField
        data-test-id="kyc-company-legal-representative-pep"
        values={PEP_VALUES}
        label={
          <>
            <FormattedMessage id="kyc.business.legal-representative.pep" />
            <Tooltip
              content={
                <FormattedHTMLMessage tagName="div" id="kyc.personal.politically-exposed.tooltip" />
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
      />
      <br />
      <div className="p-4 text-center">
        <Button
          data-test-id="kyc-company-legal-representative-save"
          type="submit"
          disabled={!props.isValid || props.loadingData}
        >
          <FormattedMessage id="form.button.save" />
        </Button>
      </div>
    </FormDeprecated>
  ),
);

const KYCEnhancedForm = withFormik<IProps, IKycIndividualData>({
  validationSchema: KycLegalRepresentativeSchemaRequired,
  mapPropsToValues: props => unboolify(props.legalRepresentative as IKycIndividualData),
  isInitialValid: (props: any) =>
    KycLegalRepresentativeSchemaRequired.isValidSync(props.legalRepresentative),
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(boolify(values)),
})(KYCForm);

const FileUploadList: React.FunctionComponent<IProps & { lrDataValid: boolean }> = props => {
  if (!props.lrDataValid) return <div />;
  return (
    <div>
      <MultiFileUpload
        uploadType={EKycRequestType.INDIVIDUAL}
        layout="vertical"
        acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
        data-test-id="kyc-company-legal-representative-documents"
        onDropFile={props.onDropFile}
        files={props.files}
        fileUploading={props.fileUploading}
      />
    </div>
  );
};

const BeneficialOwners: React.FunctionComponent<IProps & { lrDataValid: boolean }> = props => {
  if (!props.lrDataValid || props.files.length === 0) return null;
  return <KYCBeneficialOwners />;
};

export const KycLegalRepresentativeComponent = ({
  intl: { formatIntlMessage },
  ...props
}: IProps & IIntlProps) => {
  const lrDataValid = KycLegalRepresentativeSchemaRequired.isValidSync(props.legalRepresentative);
  return (
    <KycPanel
      title={<FormattedMessage id="kyc.panel.business-verification" />}
      steps={businessSteps}
      description={formatIntlMessage("kyc.business.legal-representative.description")}
      backLink={kycRoutes.businessData}
    >
      <KYCEnhancedForm {...props} />
      <FileUploadList {...props} lrDataValid={lrDataValid} />
      <BeneficialOwners {...props} lrDataValid={lrDataValid} />
      <div className="p-4 text-center">
        <Button
          data-test-id="kyc-company-legal-representative-upload-and-submit"
          type="submit"
          disabled={!props.legalRepresentative || props.files.length === 0}
          onClick={props.onContinue}
        >
          <FormattedMessage id="form.button.submit-request" />
        </Button>
      </div>
    </KycPanel>
  );
};

export const KycLegalRepresentative = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      businessData: state.kyc.businessData,
      legalRepresentative: state.kyc.legalRepresentative,
      loadingData: !!state.kyc.legalRepresentativeLoading,
      files: state.kyc.legalRepresentativeFiles,
      filesLoading: !!state.kyc.legalRepresentativeFilesLoading,
      fileUploading: !!state.kyc.legalRepresentativeFileUploading,
    }),
    dispatchToProps: dispatch => ({
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadLegalRepresentativeDocument(file)),
      onContinue: () => dispatch(actions.kyc.kycSubmitBusinessRequest()),
      submitForm: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitLegalRepresentative(boolify(values))),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadBusinessData());
      dispatch(actions.kyc.kycLoadLegalRepresentative());
      dispatch(actions.kyc.kycLoadLegalRepresentativeDocumentList());
    },
  }),
  injectIntlHelpers,
)(KycLegalRepresentativeComponent);
