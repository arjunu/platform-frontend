import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { EKycRequestType, IKycFileInfo } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/buttons";
import { EButtonLayout } from "../../shared/buttons/Button";
import { EMimeType } from "../../shared/forms/fields/utils.unsafe";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { KycStep } from "../shared/KycStep";

import * as styles from "./Start.module.scss";

interface IStateProps {
  fileUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  onDone: () => void;
  onDropFile: (file: File) => void;
  goBack: () => void;
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
      onDropFile={props.onDropFile}
      uploadType={props.layout}
      files={props.files}
      fileUploading={props.fileUploading}
      data-test-id="kyc-personal-upload-dropzone"
      layout="vertical"
    />

    <div className={styles.buttons}>
      <Button
        layout={EButtonLayout.OUTLINE}
        className={styles.button}
        data-test-id="kyc-personal-start-go-back"
        onClick={props.goBack}
      >
        <FormattedMessage id="form.back" />
      </Button>
      <Button
        layout={EButtonLayout.PRIMARY}
        className={styles.button}
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
      goBack: () => dispatch(actions.routing.goToKYCIndividualDocumentVerification()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualDocumentList()),
  }),
)(KYCUploadComponent);
