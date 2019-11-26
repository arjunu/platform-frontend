import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TDataTestId } from "../../types";
import { CircleButton, ECircleButtonLayout } from "./buttons";

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
        <CircleButton
          layout={ECircleButtonLayout.SECONDARY}
          data-test-id={`${dataTestId}.download`}
          onClick={onDownload}
          svgIcon={download}
          iconProps={{
            alt: <FormattedMessage id="shared.dropzone.download.alt" />,
          }}
          disabled={disableDownload}
        />
      )}
      {onRemove && !disableRemove ? (
        confirmRemove ? (
          <CircleButton
            layout={ECircleButtonLayout.DANGER}
            data-test-id={`${dataTestId}.remove`}
            onClick={onRemove}
          >
            <FormattedMessage id="shared.dropzone.remove.confirm" />
          </CircleButton>
        ) : (
          <CircleButton
            layout={ECircleButtonLayout.SECONDARY}
            data-test-id={`${dataTestId}.remove-confirm`}
            onClick={() => toggleConfirmRemove(!confirmRemove)}
            svgIcon={remove}
            iconProps={{
              alt: <FormattedMessage id="shared.dropzone.remove.alt" />,
            }}
          />
        )
      ) : null}
    </div>
  );
};

export { DropzoneActionButtons };
