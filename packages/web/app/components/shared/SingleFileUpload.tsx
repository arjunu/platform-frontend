import * as cn from "classnames";
import * as React from "react";
import Dropzone from "react-dropzone";
import { FormattedMessage } from "react-intl-phraseapp";

import { ArrayWithAtLeastOneMember, CommonHtmlProps } from "../../types";
import { Button, EButtonLayout, EIconPosition } from "./buttons";
import { FormFieldError } from "./forms/fields/FormFieldError";
import { TAcceptedFileType } from "./forms/fields/utils.unsafe";

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
}

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
    } = this.props;

    const dropzoneInner = fileUploading ? (
      <div>
        <FormattedMessage id="shared-component.single-file-upload.uploading" />
      </div>
    ) : (
      <div>
        <FormattedMessage id="shared-component.single-file-upload.dropzone-cta" />
      </div>
    );

    return (
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
        <div className={styles.fakeDropzoneArea}>
          {file !== undefined ? <img src={file} alt="File uploaded" /> : dropzoneInner}
        </div>
        <div className={styles.sideBox}>
          {!disabled && (
            <>
              <Button
                layout={EButtonLayout.GHOST}
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
      </Dropzone>
    );
  }
}
