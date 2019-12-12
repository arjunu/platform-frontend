import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { EKycRequestType, IKycFileInfo } from "../../lib/api/kyc/KycApi.interfaces";
import { ArrayWithAtLeastOneMember } from "../../types";
import { Dropzone } from "./Dropzone";
import { TAcceptedFileType } from "./forms/fields/utils.unsafe";
import { ResponsiveImage } from "./ResponsiveImage";
import { UploadedFiles } from "./UploadedFiles";

import * as documentBothSidesImage from "../../assets/img/document-both-side.jpg";
import * as documentBothSidesImage2x from "../../assets/img/document-both-side@2x.jpg";
import * as documentBothSidesImage3x from "../../assets/img/document-both-side@3x.jpg";
import * as styles from "./MultiFileUpload.module.scss";

export enum EKycUploadType {
  US_ACCREDITATION = "us_accreditation",
  PROOF_OF_ADDRESS = "proof_of_address",
  ADDITIONAL_INDIVIDUAL = "additional_individual",
}

interface IProps {
  uploadType: EKycRequestType | EKycUploadType;
  acceptedFiles: ArrayWithAtLeastOneMember<TAcceptedFileType>;
  fileUploading: boolean;
  onDropFile: (file: File) => void;
  layout?: "horizontal" | "vertical";
  files?: ReadonlyArray<IKycFileInfo>;
  "data-test-id"?: string;
}

const selectTitle = (uploadType: EKycRequestType | EKycUploadType) => {
  switch (uploadType) {
    case EKycUploadType.US_ACCREDITATION:
      return <FormattedMessage id="shared-component.multi-file-upload-accreditation.title" />;
    case EKycUploadType.PROOF_OF_ADDRESS:
      return <FormattedMessage id="shared-component.multi-file-upload-proof-of-address.title" />;
    default:
      return <FormattedMessage id="shared-component.multi-file-upload.title" />;
  }
};

const MultiFileUploadComponent: React.FunctionComponent<IProps> = ({
  acceptedFiles,
  fileUploading,
  files,
  layout,
  onDropFile,
  uploadType,
  "data-test-id": dataTestId,
  ...props
}) => {
  const onDrop = (accepted: File[]) => accepted[0] && onDropFile(accepted[0]);

  return (
    <div className={cn(styles.multiFileUpload, layout)} data-test-id={dataTestId}>
      <p className={styles.uploadTitle}>{selectTitle(uploadType)}</p>
      <div className={styles.uploadContainer}>
        <div className={styles.dropzoneWrapper}>
          <Dropzone
            data-test-id="multi-file-upload-dropzone"
            accept={acceptedFiles}
            onDrop={onDrop}
            disabled={fileUploading}
            isUploading={fileUploading}
            name={uploadType}
            {...props}
          />
          <p className={styles.fileTypes}>
            <FormattedMessage id="shared-component.multi-file-upload.accepted-types" />
          </p>
        </div>
        <section className={styles.uploaderInfo}>
          <div className={styles.uploadInformationsWrapper}>
            <MultiFileUploadInfo uploadType={uploadType} />
          </div>
        </section>
      </div>

      {files && files.length > 0 && <UploadedFiles files={files} />}
    </div>
  );
};

MultiFileUploadComponent.defaultProps = {
  layout: "horizontal",
};

const MultiFileUploadInfo: React.FunctionComponent<{
  uploadType: EKycRequestType | EKycUploadType;
}> = ({ uploadType }) => {
  switch (uploadType) {
    case EKycRequestType.BUSINESS:
      return (
        <>
          <div className={styles.title}>
            <FormattedHTMLMessage
              tagName="span"
              id="shared-component.multi-file-upload.requirements.business.documents"
            />
          </div>
          <h4 className={cn(styles.hint, "mb-3")}>
            <FormattedMessage id="shared-component.multi-file-upload.requirements.business.documents-note" />
          </h4>
        </>
      );
    case EKycRequestType.INDIVIDUAL:
      return (
        <FormattedHTMLMessage
          tagName="span"
          id="shared-component.multi-file-upload.individual.info"
        />
      );
    case EKycUploadType.PROOF_OF_ADDRESS:
      return (
        <FormattedHTMLMessage
          tagName="span"
          id="shared-component.multi-file-upload.proof-of-address.info"
        />
      );
    /* Preparation for Accreditation documents upload */
    case EKycUploadType.US_ACCREDITATION:
      return (
        <FormattedHTMLMessage
          tagName="span"
          id="shared-component.multi-file-upload.us-accreditation.info"
        />
      );
    case EKycUploadType.ADDITIONAL_INDIVIDUAL:
      return (
        <FormattedHTMLMessage
          tagName="span"
          id="shared-component.multi-file-upload.additional-upload.info"
        />
      );
    default:
      return null;
  }
};

export const MultiFileUploadGuide: React.FunctionComponent<{
  uploadType: EKycRequestType | EKycUploadType;
}> = ({ uploadType }) => {
  switch (uploadType) {
    case EKycRequestType.INDIVIDUAL:
      return (
        <section className="mb-4">
          <span className={cn(styles.hint, "mb-4")}>
            <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.proof-of-identity-note" />
          </span>
          <ResponsiveImage
            srcSet={{
              "1x": documentBothSidesImage,
              "2x": documentBothSidesImage2x,
              "3x": documentBothSidesImage3x,
            }}
            alt="ID"
            width={344}
            height={111}
          />
        </section>
      );
    case EKycUploadType.ADDITIONAL_INDIVIDUAL:
      return (
        <section className="mb-4">
          <span className={cn(styles.hint, "mb-4")}>
            <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.additional-upload" />
          </span>
        </section>
      );
    default:
      return null;
  }
};

// TODO: MultiFileUpload should not contain any information about upload type
export const MultiFileUpload: React.FunctionComponent<IProps> = ({
  acceptedFiles,
  fileUploading,
  files,
  onDropFile,
  uploadType,
  layout,
  "data-test-id": dataTestId,
}) => (
  <>
    <MultiFileUploadGuide uploadType={uploadType} />
    <div className={styles.upload}>
      <MultiFileUploadComponent
        acceptedFiles={acceptedFiles}
        onDropFile={onDropFile}
        files={files}
        fileUploading={fileUploading}
        uploadType={uploadType}
        layout={layout}
        data-test-id={dataTestId}
      />
    </div>
  </>
);
