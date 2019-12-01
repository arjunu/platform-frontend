import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EJurisdiction } from "../../../../../lib/api/eto/EtoProductsApi.interfaces";
import { CoverBannerBase } from "./CoverBannerBase";

interface IJurisdictionBannerProps {
  jurisdiction?: EJurisdiction;
}

export const CoverBanner: React.FunctionComponent<IJurisdictionBannerProps> = ({
  jurisdiction,
}) => {
  switch (jurisdiction) {
    case EJurisdiction.GERMANY:
      return (
        <CoverBannerBase data-test-id={`eto.public-view.jurisdiction-banner.${jurisdiction}`}>
          <FormattedMessage id="eto-overview.cover-banner.jurisdiction.de" />
        </CoverBannerBase>
      );
    case EJurisdiction.LIECHTENSTEIN:
      return (
        <CoverBannerBase data-test-id={`eto.public-view.jurisdiction-banner.${jurisdiction}`}>
          <FormattedMessage id="eto-overview.cover-banner.jurisdiction.li" />
        </CoverBannerBase>
      );
    default:
      return null;
  }
};
