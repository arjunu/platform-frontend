import * as cn from "classnames";
import * as React from "react";
import ReactDropzone, { DropFileEventHandler, DropzoneProps } from "react-dropzone";
import { FormattedMessage } from "react-intl-phraseapp";

import { TDataTestId } from "../../types";
import { Button, EButtonLayout, EIconPosition } from "./buttons";
import { EInlineIconFill } from "./icons/InlineIcon";
import { ELoadingIndicator, LoadingIndicator } from "./loading-indicator/LoadingIndicator";

import * as upload from "../../assets/img/inline_icons/cloud.svg";
import * as styles from "./Dropzone.module.scss";

interface IProps {
  isUploading?: boolean;
  name: string;
  isDisabled?: boolean;
}

const DropzoneSpinner: React.FunctionComponent = () => (
  <div className={styles.dropzoneBusy}>
    <LoadingIndicator type={ELoadingIndicator.SPINNER_SMALL} />
    <FormattedMessage id="shared.dropzone.uploading" />
  </div>
);

const DocumentDropzoneContent: React.FunctionComponent<{
  disabled?: boolean;
  name: string;
}> = ({ disabled, name }) => (
  <>
    <Button
      disabled={disabled}
      layout={EButtonLayout.PRIMARY}
      svgIcon={upload}
      iconPosition={EIconPosition.ICON_BEFORE}
      iconProps={{ fill: EInlineIconFill.FILL_OUTLINE }}
      data-test-id={`form.name.${name}.upload`}
    >
      <FormattedMessage id="shared.dropzone.upload.upload" />
    </Button>
    <p className={cn(styles.dragDescription)}>
      <FormattedMessage id="shared.dropzone.upload.drag-n-drop" />
    </p>
  </>
);

const Dropzone: React.FunctionComponent<DropzoneProps & TDataTestId & IProps> = ({
  className,
  "data-test-id": dataTestId,
  isUploading,
  name,
  disabled,
  ...props
}) => (
  <ReactDropzone
    data-test-id={dataTestId}
    className={cn(className, styles.dropzone)}
    disabled={disabled}
    disabledClassName={styles.dropzoneDisabled}
    {...props}
  >
    <DocumentDropzoneContent name={name} disabled={disabled} />
    {isUploading && <DropzoneSpinner />}
  </ReactDropzone>
);

export { Dropzone, DropFileEventHandler };
