import * as React from "react";
import { compose } from "redux";

import { EKycRequestType, IKycFileInfo } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { AppActionTypes, appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { FunctionWithDeps } from "../../../utils/opaque-types/types";
import { EMimeType } from "../../shared/forms/fields/utils.unsafe";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { MultiFileUpload } from "../../shared/MultiFileUpload";

interface IStateProps {
  fileUploading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  onDropFile: (file: File) => void;
}

interface IOwnProps {
  uploadType: EKycRequestType;
  onEnter?: AppActionTypes | FunctionWithDeps;
  isLoading?: boolean;
}

export const KYCAddDocumentsComponent: React.FunctionComponent<IStateProps &
  IDispatchProps &
  IOwnProps> = ({ onDropFile, files, fileUploading, uploadType, isLoading }) =>
  isLoading ? (
    <LoadingIndicator />
  ) : (
    <MultiFileUpload
      data-test-id={
        uploadType === EKycRequestType.US_ACCREDITATION
          ? "kyc-personal-accreditation-upload-dropzone"
          : undefined
      }
      acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
      onDropFile={onDropFile}
      files={files}
      fileUploading={fileUploading}
      uploadType={uploadType}
      layout="vertical"
    />
  );

export const KYCAddDocuments = compose<React.FunctionComponent<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: (state, ownProps) => ({
      files: [EKycRequestType.INDIVIDUAL, EKycRequestType.US_ACCREDITATION].includes(
        ownProps.uploadType,
      )
        ? state.kyc.individualFiles
        : state.kyc.businessFiles,
      filesLoading: [EKycRequestType.INDIVIDUAL, EKycRequestType.US_ACCREDITATION].includes(
        ownProps.uploadType,
      )
        ? !!state.kyc.individualFilesLoading
        : !!state.kyc.businessFilesLoading,
      fileUploading: [EKycRequestType.INDIVIDUAL, EKycRequestType.US_ACCREDITATION].includes(
        ownProps.uploadType,
      )
        ? !!state.kyc.individualFileUploading
        : !!state.kyc.businessFileUploading,
      title: "",
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      onDropFile: (file: File) =>
        [EKycRequestType.INDIVIDUAL, EKycRequestType.US_ACCREDITATION].includes(ownProps.uploadType)
          ? dispatch(actions.kyc.kycUploadIndividualDocument(file))
          : dispatch(actions.kyc.kycUploadBusinessDocument(file)),
    }),
  }),
  onEnterAction<IOwnProps>({
    actionCreator: (dispatch, props) => {
      dispatch(actions.kyc.kycLoadIndividualDocumentList());
      if (props.onEnter) {
        dispatch(props.onEnter);
      }
    },
  }),
)(KYCAddDocumentsComponent);
