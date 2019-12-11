import * as React from "react";
import { compose } from "redux";

import { EKycRequestType, IKycFileInfo } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { AppActionTypes, appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { EMimeType } from "../../shared/forms/fields/utils.unsafe";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { EKycUploadType, MultiFileUpload } from "../../shared/MultiFileUpload";

interface IStateProps {
  fileUploading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  onDropFile: (file: File) => void;
}

interface IOwnProps {
  uploadType: EKycRequestType | EKycUploadType;
  onEnter?: AppActionTypes;
  isLoading?: boolean;
}

export const KYCAddDocumentsComponent: React.FunctionComponent<IStateProps &
  IDispatchProps &
  IOwnProps> = ({ onDropFile, files, fileUploading, uploadType, isLoading }) =>
  isLoading ? (
    <LoadingIndicator />
  ) : (
    <MultiFileUpload
      data-test-id="kyc-upload-documents-dropzone"
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
      files: [
        EKycRequestType.INDIVIDUAL,
        EKycUploadType.US_ACCREDITATION,
        EKycUploadType.PROOF_OF_ADDRESS,
      ].includes(ownProps.uploadType)
        ? state.kyc.individualFiles
        : state.kyc.businessFiles,
      filesLoading: [
        EKycRequestType.INDIVIDUAL,
        EKycUploadType.US_ACCREDITATION,
        EKycUploadType.PROOF_OF_ADDRESS,
      ].includes(ownProps.uploadType)
        ? !!state.kyc.individualFilesLoading
        : !!state.kyc.businessFilesLoading,
      fileUploading: [
        EKycRequestType.INDIVIDUAL,
        EKycUploadType.US_ACCREDITATION,
        EKycUploadType.PROOF_OF_ADDRESS,
      ].includes(ownProps.uploadType)
        ? !!state.kyc.individualFileUploading
        : !!state.kyc.businessFileUploading,
      title: "",
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      onDropFile: (file: File) =>
        [
          EKycRequestType.INDIVIDUAL,
          EKycUploadType.US_ACCREDITATION,
          EKycUploadType.PROOF_OF_ADDRESS,
        ].includes(ownProps.uploadType)
          ? dispatch(actions.kyc.kycUploadIndividualDocument(file))
          : dispatch(actions.kyc.kycUploadBusinessDocument(file)),
    }),
  }),
  onEnterAction<IOwnProps>({
    actionCreator: (dispatch, props) => {
      if (props.onEnter) {
        dispatch(props.onEnter);
      }
      dispatch(actions.kyc.kycLoadIndividualDocumentList());
    },
  }),
)(KYCAddDocumentsComponent);
