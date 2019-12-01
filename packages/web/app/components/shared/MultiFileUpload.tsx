import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { EKycRequestType, IKycFileInfo } from "../../lib/api/kyc/KycApi.interfaces";
import { ArrayWithAtLeastOneMember } from "../../types";
import { Dropzone } from "./Dropzone";
import { TAcceptedFileType } from "./forms/fields/utils.unsafe";
import { UploadedFiles } from "./UploadedFiles";

import * as styles from "./MultiFileUpload.module.scss";

interface IProps {
  uploadType: EKycRequestType;
  acceptedFiles: ArrayWithAtLeastOneMember<TAcceptedFileType>;
  fileUploading: boolean;
  onDropFile: (file: File) => void;
  layout?: "horizontal" | "vertical";
  files?: ReadonlyArray<IKycFileInfo>;
  "data-test-id"?: string;
}

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
      <p className={styles.uploadTitle}>
        {uploadType === EKycRequestType.US_ACCREDITATION ? (
          <FormattedMessage id="shared-component.multi-file-upload-accreditation.title" />
        ) : (
          <FormattedMessage id="shared-component.multi-file-upload.title" />
        )}
      </p>
      <div className={styles.uploadContainer}>
        <div>
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
          <MultiFileUploadInfo uploadType={uploadType} />
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
  uploadType: EKycRequestType | EKycRequestType[];
}> = ({ uploadType }) => {
  switch (uploadType) {
    case EKycRequestType.BUSINESS:
      return (
        <div className={styles.uploadInformationsWrapper}>
          <div className={styles.title}>
            <FormattedHTMLMessage
              tagName="span"
              id="shared-component.multi-file-upload.requirements.business.documents"
            />
          </div>
          <h4 className={cn(styles.hint, "mb-3")}>
            <FormattedMessage id="shared-component.multi-file-upload.requirements.business.documents-note" />
          </h4>
        </div>
      );
    case EKycRequestType.INDIVIDUAL:
      return (
        <div className={styles.uploadInformationsWrapper}>
          <FormattedHTMLMessage
            tagName="span"
            id="shared-component.multi-file-upload.requirements.individual.proof-of-address"
          />
        </div>
      );
    /* Preparation for Accreditation documents upload */
    case EKycRequestType.US_ACCREDITATION:
      return (
        <div className={styles.uploadInformationsWrapper}>
          <FormattedHTMLMessage
            tagName="span"
            id="shared-component.multi-file-upload.us-accreditation.info"
          />
        </div>
      );
    default:
      return null;
  }
};

export const MultiFileUpload: React.FunctionComponent<IProps> = ({
  acceptedFiles,
  fileUploading,
  files,
  onDropFile,
  uploadType,
  layout,
  "data-test-id": dataTestId,
}) => (
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
);
