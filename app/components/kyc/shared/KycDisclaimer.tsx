import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl";
import { CommonHtmlProps } from "../../../types";

export const KycDisclaimer: React.SFC<CommonHtmlProps> = props => (
  <div {...props}>
    <h6>
      <FormattedMessage id="kyc.disclaimer.header" />
    </h6>
    <FormattedHTMLMessage tagName="span" id="kyc.disclaimer.contents" />
  </div>
);
