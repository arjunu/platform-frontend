import * as React from "react";

import {
  EtoCompanyInformationType,
  EtoPitchType,
} from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { WidgetGrid } from "../../../layouts/WidgetGrid";
import { PersonProfileModal } from "../../../modals/person-profile-modal/PersonProfileModal";
import { FieldSchemaProvider } from "../../../shared/Field";
import { EtoOverviewStatus } from "../../overview/EtoOverviewStatus/EtoOverviewStatus";
import { Cover } from "../../public-view/Cover";
import { InvestorCoverBannerLayout } from "../../public-view/CoverBanner";
import { TIssuerEtoViewData } from "../../../../modules/eto-view/reducer";
import { EtoViewCampaignOverview } from "../shared/eto-view-tabs/EtoViewCampaignOverview";

import * as styles from "../../shared/EtoView.module.scss";

const EtoViewSchema = EtoCompanyInformationType.toYup().concat(EtoPitchType.toYup());

const EtoViewIssuerLayout: React.FunctionComponent<TIssuerEtoViewData> = ({
  eto,

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
        <EtoViewCampaignOverview
          eto={eto}
          isUserFullyVerified={true}
          publicView={false}
          data={undefined}
        />
      </WidgetGrid>
    </FieldSchemaProvider>
  );
};

export { EtoViewIssuerLayout };
