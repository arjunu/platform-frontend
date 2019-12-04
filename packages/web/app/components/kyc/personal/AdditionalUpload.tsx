import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { EKycRequestType, IKycFileInfo } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EButtonLayout } from "../../shared/buttons/Button";
import { Button } from "../../shared/buttons/index";
import { EMimeType } from "../../shared/forms/fields/utils.unsafe";
import { MultiFileUpload } from "../../shared/MultiFileUpload";

import * as styles from "./Start.module.scss";

interface IStateProps {
  fileUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  onDropFile: (file: File) => void;
  goBack: () => void;
}

export const KYCAdditionalUploadComponent = ({ ...props }: IStateProps & IDispatchProps) => (
  <>
    <MultiFileUpload
      acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
      onDropFile={props.onDropFile}
      uploadType={EKycRequestType.INDIVIDUAL}
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
    </div>
  </>
);

export const KYCAdditionalUpload = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      files: state.kyc.individualFiles,
      filesLoading: !!state.kyc.individualFilesLoading,
      fileUploading: !!state.kyc.individualFileUploading,
    }),
    dispatchToProps: dispatch => ({
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadIndividualDocument(file)),
      goBack: () => dispatch(actions.routing.goToKYCSuccess()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualDocumentList()),
  }),
)(KYCAdditionalUploadComponent);