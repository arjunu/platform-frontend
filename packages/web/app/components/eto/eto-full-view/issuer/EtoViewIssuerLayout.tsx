import * as React from "react";

import {
  EtoCompanyInformationType,
  EtoPitchType,
} from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TIssuerEtoViewData } from "../../../../modules/eto-view/shared/types";
import { WidgetGrid } from "../../../layouts/WidgetGrid";
import { PersonProfileModal } from "../../../modals/person-profile-modal/PersonProfileModal";
import { FieldSchemaProvider } from "../../../shared/Field";
import { EtoOverviewStatus } from "../../overview/EtoOverviewStatus/EtoOverviewStatus";
import { InvestorCoverBannerLayout } from "../shared/cover-banner/CoverBanner";
import { Cover } from "../shared/cover/Cover";
import { CampaignOverviewIssuer } from "./campaign-overview/CampaignOverviewIssuer";

import * as styles from "../shared/EtoView.module.scss";

const EtoViewSchema = EtoCompanyInformationType.toYup().concat(EtoPitchType.toYup());

const EtoViewIssuerLayout: React.FunctionComponent<TIssuerEtoViewData> = ({
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
        <EtoOverviewStatus eto={eto} publicView={false} isEmbedded={false} />
        <CampaignOverviewIssuer eto={eto} campaignOverviewData={campaignOverviewData} />
      </WidgetGrid>
    </FieldSchemaProvider>
  );
};

export { EtoViewIssuerLayout };
