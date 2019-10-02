import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CircleButtonIcon, CircleButtonWarning } from "./buttons/RoundedButton";
import { InlineIcon } from "./icons/InlineIcon";

import * as remove from "../../assets/img/inline_icons/delete.svg";
import * as download from "../../assets/img/inline_icons/download.svg";
import * as spinner from "../../assets/img/inline_icons/loading_spinner.svg";
import * as styles from "./Document.module.scss";

interface IDocumentProps {
  extension: string;
  blank?: boolean;
  className?: string;
}

interface IDocumentTileProps {
  title: string | React.ReactNode;
  className?: string;
  onlyDownload?: boolean;
  blank?: boolean;
  activeUpload?: boolean;
  busy?: boolean;
  fileName?: string;
  downloadAction?: () => void;
  removeAction?: () => void;
  linkDisabled?: boolean;
}

export const Document: React.FunctionComponent<IDocumentProps> = ({
  extension,
  blank,
  className,
}) => {
  const labelHeight = 24;
  const labelWidth = 50;

  const arr = extension.split(".");
  const computedExtension = arr[arr.length - 1];

  return (
    <svg
      viewBox="0 0 61 73"
      className={cn("document-icon", styles.document, { [computedExtension]: !blank }, className)}
    >
      <path
        className={styles.file}
        d="M40.3300171,1 L7.98360656,1 C4.66989806,1 1.98360656,3.6862915 1.98360656,7 L1.98360656,31 L1,31 L1,6 C1,2.6862915 3.6862915,1.4968968e-15 7,8.8817842e-16 L41.6849183,8.8817842e-16 L61,19.6908043 L61,67 C61,70.3137085 58.3137085,73 55,73 L7,73 C3.6862915,73 1,70.3137085 1,67 L1,57 L1.98360656,57 L1.98360656,66 C1.98360656,69.3137085 4.66989806,72 7.98360656,72 L54.0163934,72 C57.3301019,72 60.0163934,69.3137085 60.0163934,66 L60.0163934,21 L40.3300171,21 L40.3300171,1 Z M41.3300171,1 L41.3300171,20 L59.8687734,20 L41.3345931,1 L41.3300171,1 Z"
      />
      <rect className={styles.label} width={labelWidth} height={labelHeight} y="32" />
      <text className={styles.text} fontSize="8">
        <tspan x="12" y="47">
          .{computedExtension}
        </tspan>
      </text>
    </svg>
  );
};

export const DocumentExtension: React.FunctionComponent<Pick<IDocumentProps, "extension">> = ({
  extension,
}) => {
  const arr = extension.split(".");
  const computedExtension = arr[arr.length - 1];

  return <div className={cn(styles.extension, computedExtension)}>{computedExtension}</div>;
};

// TODO: Add Uploaded timestamp when backend provides it
export const DocumentTile: React.FunctionComponent<IDocumentProps & IDocumentTileProps> = ({
  extension,
  title,
  className,
  blank,
  onlyDownload,
  busy,
  fileName,
  activeUpload,
  downloadAction,
  removeAction,
  linkDisabled,
}) => {
  const [confirmRemove, toggleConfirmRemove] = React.useState(false);

  return (
    <div className={cn(styles.tile, className)}>
      {busy && (
        <div className={styles.documentBusy}>
          <InlineIcon svgIcon={spinner} className={styles.spinner} />
          {onlyDownload ? (
            <FormattedMessage id="documents.generating" />
          ) : (
            <FormattedMessage id="documents.downloading" />
          )}
        </div>
      )}
      <DocumentExtension extension={extension} />
      <p
        className={cn(styles.title, {
          [styles.blankTitle]: blank,
        })}
      >
        {title}
      </p>
      {/* Show name only for uploaded files */}
      {!onlyDownload && <p className={styles.fileName}>{fileName}</p>}
      <div className={styles.buttons}>
        <CircleButtonIcon
          data-test-id="documents-download-document"
          onClick={downloadAction}
          type="button"
          svgIcon={download}
          disabled={busy || linkDisabled}
          alt={<FormattedMessage id="documents.download.alt" />}
        />
        {activeUpload &&
          (confirmRemove ? (
            <CircleButtonWarning
              data-test-id="documents-remove-document-confirm"
              onClick={removeAction}
              type="button"
              disabled={busy}
            >
              Remove?
            </CircleButtonWarning>
          ) : (
            <CircleButtonIcon
              data-test-id="documents-remove-document"
              onClick={() => toggleConfirmRemove(!confirmRemove)}
              type="button"
              svgIcon={remove}
              alt={<FormattedMessage id="documents.remove.alt" />}
            />
          ))}
      </div>
    </div>
  );
};

DocumentTile.defaultProps = {
  busy: false,
};
