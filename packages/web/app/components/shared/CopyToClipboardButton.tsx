import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps, TDataTestId, TTranslatedString } from "../../types";
import { Button } from "./buttons";
import { EButtonLayout, EButtonSize, EButtonWidth } from "./buttons/Button";
import { useCopyClipboard } from "./hooks/useCopyToClipboard";

import * as clipboardIcon from "../../assets/img/inline_icons/icon-clipboard.svg";

interface IProps {
  value: string;
  alt?: TTranslatedString;
  message?: TTranslatedString;
  size?: EButtonSize;
}

const CopyToClipboardButton: React.FunctionComponent<IProps & TDataTestId & CommonHtmlProps> = ({
  className,
  alt,
  value,
  message,
}) => {
  const [, copyToClipboard] = useCopyClipboard();

  return (
    <Button
      className={className}
      layout={EButtonLayout.GHOST}
      svgIcon={clipboardIcon}
      width={EButtonWidth.NO_PADDING}
      iconProps={{
        alt: alt || <FormattedMessage id="shared-component.copy-to-clipboard.alt" />,
      }}
      onClick={() => copyToClipboard(value, { message })}
    />
  );
};

export { CopyToClipboardButton };
