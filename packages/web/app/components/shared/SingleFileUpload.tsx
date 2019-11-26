import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ArrayWithAtLeastOneMember, CommonHtmlProps, TTranslatedString } from "../../types";
import { Dropzone } from "./Dropzone";
import { DropzoneActionButtons } from "./DropzoneActionButtons";
import { FormFieldError } from "./forms/fields/FormFieldError";
import { TAcceptedFileType } from "./forms/fields/utils.unsafe";

import * as styles from "./SingleFileUpload.module.scss";

export interface IUploadRequirements {
  [key: string]: TTranslatedString;
  dimensions: TTranslatedString;
  size: TTranslatedString;
}

interface IProps {
  name: string;
  disabled?: boolean;
  acceptedFiles: ArrayWithAtLeastOneMember<TAcceptedFileType>;
  fileUploading: boolean;
  file?: string;
  fileFormatInformation: string;
  label: string | React.ReactNode;
  onDropFile: (file: File) => void;
  "data-test-id"?: string;
  onDownload: () => void;
  onRemove: () => void;
  uploadRequirements?: IUploadRequirements;
}

const SingleFileUploadUploaded: React.FunctionComponent<Pick<
  IProps,
  "file" | "onRemove" | "onDownload" | "data-test-id"
>> = ({ file, onRemove, onDownload, "data-test-id": dataTestId }) => (
  <div className={styles.fileUploaded}>
    <img src={file} alt="File uploaded" data-test-id={`${dataTestId}.image`} />
    <DropzoneActionButtons
      data-test-id={dataTestId}
      className={styles.buttons}
      onRemove={onRemove}
      onDownload={onDownload}
    />
  </div>
);

export const SingleFileUpload: React.FunctionComponent<IProps & CommonHtmlProps> = ({
  disabled,
  acceptedFiles,
  file,
  fileUploading,
  label,
  className,
  style,
  name,
  onDownload,
  onRemove,
  uploadRequirements,
  onDropFile,
  "data-test-id": dataTestId,
}) => {
  const onDrop = (accepted: File[]) => accepted[0] && onDropFile(accepted[0]);

  return (
    <div className={styles.fileContainer} data-test-id={dataTestId}>
      {file ? (
        <SingleFileUploadUploaded
          file={file}
          onDownload={onDownload}
          onRemove={onRemove}
          data-test-id={`${dataTestId}.uploaded`}
        />
      ) : (
        <Dropzone
          accept={acceptedFiles}
          disabled={disabled || fileUploading}
          onDrop={onDrop}
          multiple={false}
          acceptClassName="accept"
          rejectClassName="reject"
          disabledClassName="disabled"
          className={className}
          style={style}
          data-test-id={"dropzone"}
          isUploading={fileUploading}
          name={name}
        />
      )}
      <div className={styles.uploadRequirements}>
        <p className={styles.fieldLabel}>{label}</p>
        {uploadRequirements && (
          <p>
            <FormattedMessage
              id="shared.form.single-file-upload.requirements"
              values={uploadRequirements}
            />
          </p>
        )}
        <FormFieldError name={name} className="text-left" />
      </div>
    </div>
  );
};
