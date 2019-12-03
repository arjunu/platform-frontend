import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { EKycRequestType, IKycFileInfo } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/buttons";
import { EMimeType } from "../../shared/forms/fields/utils.unsafe";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { KycStep } from "../shared/KycStep";

interface IStateProps {
  fileUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  onDone: () => void;
  onDropFile: (file: File) => void;
}

interface IProps {
  layout: EKycRequestType;
}

export const KYCUploadComponent = ({ ...props }: IProps & IStateProps & IDispatchProps) => (
  <>
    <KycStep
      step={4}
      allSteps={5}
      title={<FormattedMessage id="kyc.personal.manual-verification.title" />}
      description={<FormattedMessage id="kyc.personal.manual-verification.description" />}
    />

    <MultiFileUpload
      acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
      uploadType={EKycRequestType.INDIVIDUAL}
      onDropFile={props.onDropFile}
      files={props.files}
      fileUploading={props.fileUploading}
      data-test-id="kyc-personal-upload-dropzone"
      layout="vertical"
    />

    <div className="p-4 text-center">
      <Button
        onClick={props.onDone}
        disabled={!props.files || props.files.length === 0}
        data-test-id="kyc-personal-upload-submit"
      >
        <FormattedMessage id="form.button.submit-request" />
      </Button>
    </div>
  </>
);

export const KYCPersonalUpload = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      files: state.kyc.individualFiles,
      filesLoading: !!state.kyc.individualFilesLoading,
      fileUploading: !!state.kyc.individualFileUploading,
    }),
    dispatchToProps: dispatch => ({
      onDone: () => dispatch(actions.kyc.kycSubmitIndividualRequest()),
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadIndividualDocument(file)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualDocumentList()),
  }),
)(KYCUploadComponent);
