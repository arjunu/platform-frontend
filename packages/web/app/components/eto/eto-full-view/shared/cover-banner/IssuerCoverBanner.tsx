import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ExternalLink } from "../../../../shared/links/ExternalLink";
import { CoverBannerBase } from "./CoverBannerBase";

interface IIssuerPreviewProps {
  previewCode: string;
  url: string;
}

export const IssuerCoverBanner: React.FunctionComponent<IIssuerPreviewProps> = ({
  previewCode,
  url,
}) => (
  <CoverBannerBase data-test-id="eto.public-view.investor-preview-banner">
    <FormattedMessage
      tagName="span"
      id="eto-overview.cover-banner.go-to-investor-view"
      values={{
        viewAsInvestor: (
          <ExternalLink
            data-test-id="eto.public-view.investor-preview-banner.view-as-investor"
            href={`${url}/${previewCode}`}
          >
            <FormattedMessage id="eto-overview.cover-banner.view-as-investor" />
          </ExternalLink>
        ),
      }}
    />
  </CoverBannerBase>
);
