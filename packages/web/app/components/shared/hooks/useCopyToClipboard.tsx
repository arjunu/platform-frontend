import copyTextToClipboard from "copy-text-to-clipboard";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TDataTestId, TTranslatedString } from "../../../types";
import { showErrorToast, showInfoToast } from "../Toast";
import { useLogger } from "./useLogger";

type TCopyToClipboard = boolean | undefined;

type TMessageOptions = {
  message?: TTranslatedString;
} & TDataTestId;

const useCopyClipboard = (): [
  TCopyToClipboard,
  (value: string, options?: TMessageOptions) => void,
] => {
  const logger = useLogger();

  const [isCopied, setIsCopied] = React.useState<TCopyToClipboard>(undefined);

  const copyToClipboard = React.useCallback((value: string, options?: TMessageOptions) => {
    const didCopy = copyTextToClipboard(value);

    if (didCopy) {
      showInfoToast(
        (options && options.message) || (
          <FormattedMessage id="shared-component.copy-to-clipboard.copied" />
        ),
        { "data-test-id": options && options["data-test-id"] },
      );
    } else {
      logger.error(new Error("Failed to copy text to clipboard"));
      showErrorToast(<FormattedMessage id="shared-component.copy-to-clipboard.failed" />);
    }

    setIsCopied(didCopy);
  }, []);

  return [isCopied, copyToClipboard];
};

export { useCopyClipboard };
