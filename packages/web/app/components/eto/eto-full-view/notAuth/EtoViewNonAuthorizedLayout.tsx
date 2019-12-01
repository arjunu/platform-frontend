import * as React from "react";

import {
  EtoCompanyInformationType,
  EtoPitchType,
} from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TNotAuthorizedEtoViewData } from "../../../../modules/eto-view/shared/types";
import { WidgetGrid } from "../../../layouts/WidgetGrid";
import { PersonProfileModal } from "../../../modals/person-profile-modal/PersonProfileModal";
import { FieldSchemaProvider } from "../../../shared/Field";
import { EtoOverviewStatus } from "../../overview/EtoOverviewStatus/EtoOverviewStatus";
import { CoverBanner } from "../shared/cover-banner/CoverBanner";
import { Cover } from "../shared/cover/Cover";
import { CampaignOverviewNotAuth } from "./campaign-overview/CampaignOverviewNotAuth";

import * as styles from "../shared/EtoView.module.scss";

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
        <CoverBanner jurisdiction={eto.product.jurisdiction} />
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
        <CampaignOverviewNotAuth eto={eto} campaignOverviewData={campaignOverviewData} />
      </WidgetGrid>
    </FieldSchemaProvider>
  );
};

export { EtoViewNonAuthorizedLayout };
