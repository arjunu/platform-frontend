import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EJurisdiction } from "../../../../../lib/api/eto/EtoProductsApi.interfaces";
import { ExternalLink } from "../../../../shared/links/ExternalLink";
import { CoverBannerBase } from "./CoverBannerBase";

interface IIssuerPreviewProps {
  previewCode: string;
  url: string;
  jurisdiction: EJurisdiction;
}

export const IssuerCoverBanner: React.FunctionComponent<IIssuerPreviewProps> = ({
  previewCode,
  url,
  jurisdiction,
}) => (
  <CoverBannerBase data-test-id="eto.public-view.investor-preview-banner">
    <FormattedMessage
      tagName="span"
      id="eto-overview.cover-banner.go-to-investor-view"
      values={{
        viewAsInvestor: (
          <ExternalLink
            data-test-id="eto.public-view.investor-preview-banner.view-as-investor"
            href={`${url}/${jurisdiction}/${previewCode}`}
          >
            <FormattedMessage id="eto-overview.cover-banner.view-as-investor" />
          </ExternalLink>
        ),
      }}
    />
  </CoverBannerBase>
);
