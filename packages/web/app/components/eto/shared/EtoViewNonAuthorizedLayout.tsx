import * as React from "react";

import {
  EtoCompanyInformationType,
  EtoPitchType,
} from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { WidgetGrid } from "../../layouts/WidgetGrid";
import { PersonProfileModal } from "../../modals/person-profile-modal/PersonProfileModal";
import { FieldSchemaProvider } from "../../shared/Field";
import { EtoOverviewStatus } from "../overview/EtoOverviewStatus/EtoOverviewStatus";
import { Cover } from "../public-view/Cover";
import { InvestorCoverBannerLayout } from "../public-view/CoverBanner";
import { TNotAuthorizedEtoViewData } from "../../../modules/eto-view/reducer";

import * as styles from "./EtoView.module.scss";
import { EtoViewCampaignOverview } from "./eto-view-tabs/EtoViewCampaignOverview";

const EtoViewSchema = EtoCompanyInformationType.toYup().concat(EtoPitchType.toYup());

const EtoViewNonAuthorizedLayout: React.FunctionComponent<TNotAuthorizedEtoViewData> = ({
  eto,
  campaignOverviewData,
}) => {
  const { categories, brandName, companyOneliner, companyLogo, companyBanner } = eto.company;
  return (
    <FieldSchemaProvider value={EtoViewSchema}>
      <PersonProfileModal />
      <WidgetGrid className={styles.etoLayout} data-test-id="eto.public-view">
        <InvestorCoverBannerLayout jurisdiction={eto.product.jurisdiction} />
        <Cover
          companyName={brandName}
          companyOneliner={companyOneliner}
          companyJurisdiction={eto.product.jurisdiction}
          companyLogo={{
            alt: brandName,
            srcSet: {
              "1x": companyLogo as string,
            },
          }}
          companyBanner={{
            alt: brandName,
            srcSet: {
              "1x": companyBanner as string,
            },
          }}
          tags={categories}
        />
        <EtoOverviewStatus eto={eto} publicView={true} isEmbedded={false} />
        <EtoViewCampaignOverview
          eto={eto}
          isUserFullyVerified={false}
          publicView={true}
          data={campaignOverviewData}
        />
      </WidgetGrid>
    </FieldSchemaProvider>
  );
};

export { EtoViewNonAuthorizedLayout };
