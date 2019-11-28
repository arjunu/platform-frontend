import * as cn from "classnames";
import * as React from "react";

import { EEtoDocumentType } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { DropFileEventHandler, Dropzone } from "../../shared/Dropzone";

import * as styles from "./EtoAddDocument.module.scss";

interface IDispatchProps {
  onDropFile: (file: File, documentType: EEtoDocumentType) => void;
}

type TExternalProps = {
  documentType: EEtoDocumentType;
  disabled?: boolean;
  className?: string;
  maxSize?: number;
  onDropRejected?: DropFileEventHandler;
  onDropAccepted?: DropFileEventHandler;
  isUploading: boolean;
  onDropFile: (file: File, documentType: EEtoDocumentType) => void;
};

//todo dropzone should accept all files dropped, not only the first one, see #2243
export const ETOAddDocuments: React.FunctionComponent<IDispatchProps & TExternalProps> = ({
  onDropFile,
  children,
  documentType,
  disabled,
  className,
  maxSize,
  onDropRejected,
  onDropAccepted,
  isUploading,
}) => {
  const onDrop = (accepted: File[]) => accepted[0] && onDropFile(accepted[0], documentType);

  return (
    <Dropzone
      data-test-id="eto-add-document-drop-zone"
      accept="application/pdf"
      onDrop={onDrop}
      activeClassName={styles.invisible}
      acceptClassName={styles.invisible}
      rejectClassName={styles.invisible}
      className={cn(className, styles.dropzone, styles.invisible)}
      disabled={disabled}
      maxSize={maxSize}
      onDropRejected={onDropRejected}
      onDropAccepted={onDropAccepted}
      isUploading={isUploading}
      name={documentType}
    >
      {children}
    </Dropzone>
  );
};
