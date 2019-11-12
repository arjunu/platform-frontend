import * as cn from "classnames";
import * as React from "react";
import { compose } from "redux";

import { EEtoDocumentType } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { DropFileEventHandler, Dropzone } from "../../shared/Dropzone";

import * as styles from "./EtoAddDocument.module.scss";

interface IDispatchProps {
  onDropFile: (file: File, documentType: EEtoDocumentType) => void;
}

interface IOwnProps {
  documentType: EEtoDocumentType;
  disabled?: boolean;
  className?: string;
  maxSize?: number;
  onDropRejected?: DropFileEventHandler;
  onDropAccepted?: DropFileEventHandler;
  isUploading?: boolean;
}
//todo dropzone should accept all files dropped, not only the first one, see #2243
export const ETOAddDocumentsComponent: React.FunctionComponent<IDispatchProps & IOwnProps> = ({
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

export const ETOAddDocuments = compose<React.FunctionComponent<IOwnProps>>(
  appConnect<{}, IDispatchProps, IOwnProps>({
    dispatchToProps: dispatch => ({
      onDropFile: (file: File, documentType: EEtoDocumentType) =>
        dispatch(
          actions.etoDocuments.showIpfsModal(() =>
            dispatch(actions.etoDocuments.etoUploadDocumentStart(file, documentType)),
          ),
        ),
    }),
  }),
)(ETOAddDocumentsComponent);
