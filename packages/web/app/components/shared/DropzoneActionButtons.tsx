import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TDataTestId } from "../../types";
import { CircleButtonIcon, CircleButtonWarning } from "./buttons/RoundedButton";

import * as remove from "../../assets/img/inline_icons/delete.svg";
import * as download from "../../assets/img/inline_icons/download.svg";

interface IProps {
  className?: string;
  onDownload?: () => void;
  onRemove?: () => void;
  disableDownload?: boolean;
  disableRemove?: boolean;
}

const DropzoneActionButtons: React.FunctionComponent<IProps & TDataTestId> = ({
  className,
  onDownload,
  onRemove,
  "data-test-id": dataTestId,
  disableDownload,
  disableRemove,
}) => {
  const [confirmRemove, toggleConfirmRemove] = React.useState(false);

  return (
    <div className={className}>
      {onDownload && (
        <CircleButtonIcon
          data-test-id={`${dataTestId}.download`}
          onClick={onDownload}
          type="button"
          svgIcon={download}
          disabled={disableDownload}
          alt={<FormattedMessage id="shared.dropzone.download.alt" />}
        />
      )}
      {onRemove && !disableRemove ? (
        confirmRemove ? (
          <CircleButtonWarning
            data-test-id={`${dataTestId}.remove`}
            onClick={onRemove}
            type="button"
          >
            <FormattedMessage id="shared.dropzone.remove.confirm" />
          </CircleButtonWarning>
        ) : (
          <CircleButtonIcon
            data-test-id={`${dataTestId}.remove-confirm`}
            onClick={() => toggleConfirmRemove(!confirmRemove)}
            type="button"
            svgIcon={remove}
            alt={<FormattedMessage id="shared.dropzone.remove.alt" />}
          />
        )
      ) : null}
    </div>
  );
};

export { DropzoneActionButtons };
