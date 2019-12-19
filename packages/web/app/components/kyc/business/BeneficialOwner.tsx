import { FormikProps, withFormik } from "formik";
import { defaultTo } from "lodash/fp";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EKycRequestType,
  IKycBeneficialOwner,
  IKycFileInfo,
  KycBeneficialOwnerSchemaRequired,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { ECountries } from "../../../utils/enums/countriesEnum";
import { injectIntlHelpers } from "../../../utils/injectIntlHelpers.unsafe";
import { AccordionElement } from "../../shared/Accordion";
import { Button, EButtonLayout } from "../../shared/buttons";
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
import { FormSelectStateField } from "../../shared/forms/fields/FormSelectStateField.unsafe";
import { EMimeType } from "../../shared/forms/fields/utils.unsafe";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { Tooltip } from "../../shared/tooltips";

const PEP_VALUES = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes-i-am" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no-i-am-not" />,
};

interface IStateProps {
  owner: IKycBeneficialOwner;
  index: number;
  fileUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
  loading: boolean;
  id: string;
}

interface IDispatchProps {
  submitForm: (owner: IKycBeneficialOwner) => void;
  loadDocumentList: () => void;
  submit: () => void;
  delete: () => void;
  onDropFile: (file: File) => void;
}

interface IOwnProps {
  owner: IKycBeneficialOwner;
  index: number;
  id: string;
}

type IProps = IStateProps & IDispatchProps;

const KYCForm = injectIntlHelpers<FormikProps<IKycBeneficialOwner> & IProps>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <FormDeprecated>
      <FormField label={formatIntlMessage("form.label.first-name")} name="firstName" />
      <FormField label={formatIntlMessage("form.label.last-name")} name="lastName" />
      <FormFieldDate label={formatIntlMessage("form.label.birth-date")} name="birthDate" />
      <FormField label={formatIntlMessage("form.label.address")} name="street" />
      <Row>
        <Col xs={12} md={6} lg={8}>
          <FormField label={formatIntlMessage("form.label.city")} name="city" />
        </Col>
        <Col xs={12} md={6} lg={4}>
          <FormField label={formatIntlMessage("form.label.zip-code")} name="zipCode" />
        </Col>
      </Row>
      <FormSelectCountryField label={formatIntlMessage("form.label.country")} name="country" />
      {props.values.country === ECountries.UNITED_STATES && (
        <FormSelectStateField label={formatIntlMessage("form.label.us-state")} name="usState" />
      )}
      <FormSelectCountryField
        label={formatIntlMessage("form.label.place-of-birth")}
        name="placeOfBirth"
      />
      <FormSelectNationalityField
        label={formatIntlMessage("form.label.nationality")}
        name="nationality"
      />
      <FormSelectField
        values={PEP_VALUES}
        label={
          <>
            <FormattedMessage id="kyc.business.beneficial-owner.pep" />
            <Tooltip
              content={
                <FormattedHTMLMessage
                  id="kyc.personal.politically-exposed.tooltip"
                  tagName="span"
                />
              }
            />
          </>
        }
        name="isPoliticallyExposed"
      />
      <Row>
        <Col xs={6} md={4}>
          <FormField
            label={formatIntlMessage("kyc.business.beneficial-owner.percent-held")}
            name="ownership"
            suffix="%"
          />
        </Col>
      </Row>
      <div className="p-4 text-center">
        <Button type="submit" disabled={!props.isValid || props.loading}>
          <FormattedMessage tagName="div" id="form.button.submit-changes" />
        </Button>
      </div>
    </FormDeprecated>
  ),
);

const defaultEmptyObject = defaultTo<IKycBeneficialOwner | {}>({});

const KYCEnhancedForm = withFormik<IProps, IKycBeneficialOwner>({
  validationSchema: KycBeneficialOwnerSchemaRequired,
  validateOnMount: true,
  enableReinitialize: true,
  mapPropsToValues: props => defaultEmptyObject(props.owner),
  handleSubmit: (values, { props }) => {
    // TODO: Fix props here, `ownership` from ui is passed as string but it's declared as number in types
    // tslint:disable-next-line:no-any-on-steroid
    const ownership: any = values.ownership || "";
    props.submitForm({ ...values, ownership: parseInt(ownership, 10) || 0 });
  },
})(KYCForm);

export class KYCBeneficialOwnerComponent extends React.Component<IProps> {
  componentDidMount(): void {
    this.props.loadDocumentList();
  }

  render(): React.ReactChild {
    const { owner } = this.props;

    const name =
      owner && owner.firstName && owner.lastName ? (
        `${owner.firstName} ${owner.lastName}`
      ) : (
        <FormattedMessage
          id="kyc.business.beneficial-owner.label"
          values={{ id: this.props.index + 1 }}
        />
      );

    return (
      <AccordionElement title={name} isDefaultOpened={true}>
        <KYCEnhancedForm {...this.props} />
        <MultiFileUpload
          uploadType={EKycRequestType.INDIVIDUAL}
          acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
          layout="vertical"
          onDropFile={this.props.onDropFile}
          files={this.props.files}
          fileUploading={this.props.fileUploading}
        />
        <div className="p-4 text-center">
          <Button
            data-test-id="kyc-beneficial-owner-delete"
            layout={EButtonLayout.GHOST}
            onClick={this.props.delete}
          >
            <FormattedMessage id="form.button.delete" /> {name}
          </Button>
        </div>
      </AccordionElement>
    );
  }
}

export const KYCBeneficialOwner = compose<React.FunctionComponent<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: (state, ownProps) => ({
      id: ownProps.id,
      owner: ownProps.owner,
      index: ownProps.index,
      files: state.kyc.beneficialOwnerFiles[ownProps.id] || [],
      filesLoading: !!state.kyc.beneficialOwnerFilesLoading[ownProps.id],
      fileUploading: !!state.kyc.beneficialOwnerFileUploading[ownProps.id],
      loading: !!state.kyc.loadingBeneficialOwner,
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      onDropFile: (file: File) =>
        dispatch(actions.kyc.kycUploadBeneficialOwnerDocument(ownProps.id, file)),
      submit: () => dispatch(actions.kyc.kycSubmitBusinessRequest()),
      loadDocumentList: () => dispatch(actions.kyc.kycLoadBeneficialOwnerDocumentList(ownProps.id)),
      submitForm: (owner: IKycBeneficialOwner) =>
        dispatch(actions.kyc.kycSubmitBeneficialOwner(owner)),
      delete: () => dispatch(actions.kyc.kycDeleteBeneficialOwner(ownProps.id)),
    }),
  }),
)(KYCBeneficialOwnerComponent);
