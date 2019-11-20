import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { EKycRequestType, IKycFileInfo } from "../../lib/api/kyc/KycApi.interfaces";
import { ArrayWithAtLeastOneMember } from "../../types";
import { Dropzone } from "./Dropzone";
import { TAcceptedFileType } from "./forms/fields/utils.unsafe";
import { ResponsiveImage } from "./ResponsiveImage";
import { UploadedFiles } from "./UploadedFiles";

import * as bankStatementTemplate from "../../assets/img/bank-statement-template.svg";
import * as documentBothSidesImage from "../../assets/img/document-both-side.jpg";
import * as documentBothSidesImage2x from "../../assets/img/document-both-side@2x.jpg";
import * as documentBothSidesImage3x from "../../assets/img/document-both-side@3x.jpg";
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
      <div className={styles.uploadContainer}>
        <Dropzone
          data-test-id="multi-file-upload-dropzone"
          accept={acceptedFiles}
          onDrop={onDrop}
          disabled={fileUploading}
          isUploading={fileUploading}
          name={uploadType}
          {...props}
        />
        <section className={styles.uploaderInfo}>
          <p className={styles.uploadTitle}>
            {uploadType === EKycRequestType.US_ACCREDITATION ? (
              <FormattedMessage id="shared-component.multi-file-upload-accreditation.title" />
            ) : (
              <FormattedMessage id="shared-component.multi-file-upload.title" />
            )}
          </p>
          <p className={styles.fileTypes}>
            <FormattedMessage id="shared-component.multi-file-upload.accepted-types" />
          </p>
        </section>
      </div>

      {files && files.length > 0 && <UploadedFiles files={files} />}

      {uploadType !== EKycRequestType.US_ACCREDITATION && (
        <div className={styles.requirements}>
          <p className={styles.requirementsTitle}>
            <FormattedHTMLMessage
              tagName="span"
              id="shared-component.multi-file-upload.requirements.file-requirements"
            />
          </p>
        </div>
      )}
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
          <div className={styles.title}>
            <FormattedHTMLMessage
              tagName="span"
              id="shared-component.multi-file-upload.requirements.individual.proof-of-identity"
            />
          </div>
          <h4 className={cn(styles.hint, "mb-3")}>
            <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.proof-of-identity-note" />
          </h4>
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
          <div className={cn(styles.title, "mt-4")}>
            <FormattedHTMLMessage
              tagName="span"
              id="shared-component.multi-file-upload.requirements.individual.proof-of-address"
            />
          </div>
          <h4 className={cn(styles.hint, "mb-3")}>
            <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.proof-of-address-note" />
          </h4>
          <div className={styles.imagesWrapper}>
            <div className={styles.bankStatementWrapper}>
              <img src={bankStatementTemplate} alt="bank statement" />
            </div>
            <div className={styles.idWrapper} />
          </div>
        </div>
      );
    /* Preparation for Accreditation documents upload */
    case EKycRequestType.US_ACCREDITATION:
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
    <MultiFileUploadInfo uploadType={uploadType} />

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
