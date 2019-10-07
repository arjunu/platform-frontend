import * as cn from "classnames";
import * as React from "react";
import Dropzone from "react-dropzone";
import { FormattedMessage } from "react-intl-phraseapp";

import {ArrayWithAtLeastOneMember, CommonHtmlProps, TDataTestId, TTranslatedString} from "../../types";
import { Button, EButtonLayout, EIconPosition } from "./buttons";
import {CircleButtonIcon, CircleButtonWarning, UploadButton} from "./buttons/RoundedButton";
import { FormFieldError } from "./forms/fields/FormFieldError";
import { TAcceptedFileType } from "./forms/fields/utils.unsafe";
import {InlineIcon} from "./icons/InlineIcon";

import * as remove from "../../assets/img/inline_icons/delete.svg";
import * as download from "../../assets/img/inline_icons/download.svg";
import * as spinner from "../../assets/img/inline_icons/loading_spinner.svg";
import * as uploadIcon from "../../assets/img/inline_icons/upload.svg";
import * as styles from "./SingleFileUpload.module.scss";

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
  downloadAction?: () => void;
  removeAction?: () => void;
}

interface IActionButtons {
  className?: string;
  downloadAction?: () => void;
  removeAction?: () => void;
  busy?: boolean;
  linkDisabled?: boolean;
  activeUpload?: boolean;
}

export const SingleFileUploadInner: React.FunctionComponent<{
  isDisabled?: boolean;
} & TDataTestId> = ({ isDisabled, "data-test-id": dataTestId }) => (
  <>
    <UploadButton isDisabled={isDisabled} data-test-id={dataTestId}>
      <FormattedMessage id="shared-component.single-file-upload.upload" />
    </UploadButton>
    <p className={styles.dragDescription}>
      <FormattedMessage id="shared-component.single-file-upload.drag-n-drop" />
    </p>
  </>
);

export const SingleFileUploadSpinner: React.FunctionComponent<{message?: TTranslatedString}> = ({message}) => (
  <div className={styles.fileBusy}>
    <InlineIcon svgIcon={spinner} className={styles.spinner} />
    {message || <FormattedMessage id="shared-component.single-file-upload.uploading" />}
  </div>
);

export const SingleFileUploadActionButtons: React.FunctionComponent<IActionButtons> = ({className, downloadAction, busy, linkDisabled, removeAction, activeUpload = true}) => {
  const [confirmRemove, toggleConfirmRemove] = React.useState(false);

  return <div className={cn(className, styles.buttons)}>
    <CircleButtonIcon
      data-test-id="shared-component.single-file-upload.download"
      onClick={downloadAction}
      type="button"
      svgIcon={download}
      disabled={busy || linkDisabled}
      alt={<FormattedMessage id="documents.download.alt" />}
    />
    {activeUpload && removeAction &&
    (confirmRemove ? (
      <CircleButtonWarning
        data-test-id="shared-component.single-file-upload.remove-confirm"
        onClick={removeAction}
        type="button"
        disabled={busy}
      >
        <FormattedMessage id="shared-component.single-file-upload.remove-confirm" />
      </CircleButtonWarning>
    ) : (
      <CircleButtonIcon
        data-test-id="shared-component.single-file-upload.remove"
        onClick={() => toggleConfirmRemove(!confirmRemove)}
        type="button"
        svgIcon={remove}
        alt={<FormattedMessage id="documents.remove.alt" />}
      />
    ))}
  </div>
};

export class SingleFileUpload extends React.Component<IProps & CommonHtmlProps> {
  onDrop = (accepted: File[]) => accepted[0] && this.props.onDropFile(accepted[0]);

  render(): React.ReactNode {
    const {
      disabled,
      acceptedFiles,
      file,
      fileUploading,
      fileFormatInformation,
      label,
      className,
      style,
      downloadAction,
      removeAction,
    } = this.props;

    return (
      file ? <div className={styles.fileContainer}>
          <img src={file} alt="File uploaded" />
          <SingleFileUploadActionButtons className={styles.actions} removeAction={removeAction} downloadAction={downloadAction} />
      </div> :
      <>
      <Dropzone
        accept={acceptedFiles}
        disabled={disabled || fileUploading}
        onDrop={this.onDrop}
        multiple={false}
        acceptClassName="accept"
        rejectClassName="reject"
        disabledClassName="disabled"
        className={cn(styles.dropzone, className)}
        style={style}
        data-test-id={this.props["data-test-id"]}
      >
        {fileUploading && <SingleFileUploadSpinner />}
        <SingleFileUploadInner />
      </Dropzone>
      <div className={styles.sideBox}>
        {!disabled && (
          <>
            <Button
              layout={EButtonLayout.SECONDARY}
              iconPosition={EIconPosition.ICON_BEFORE}
              svgIcon={uploadIcon}
            >
              {label}
            </Button>
            <div className={styles.acceptedFiles}>{fileFormatInformation}</div>
          </>
        )}
        <FormFieldError name={this.props.name} />
      </div>
      </>
    );
  }
}
