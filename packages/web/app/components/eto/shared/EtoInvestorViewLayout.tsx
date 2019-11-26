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
import { TReadyEtoView } from "../../../modules/eto-view/reducer";

import * as styles from "./EtoView.module.scss";
import { EtoViewTabs } from "./eto-view-tabs/EtoViewTabs";

type EtoInvestorViewLayoutProps = TReadyEtoView //fixme

const EtoViewSchema = EtoCompanyInformationType.toYup().concat(EtoPitchType.toYup());

const EtoViewInvestorLayout: React.FunctionComponent<EtoInvestorViewLayoutProps> = ({
  eto,
  userIsFullyVerified,
  campaignOverviewType,
  match
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
        {campaignOverviewType === } /*fixme <============= */
        <EtoViewTabs
          match={match}
          eto={eto}
          publicView={true}
          isUserFullyVerified={userIsFullyVerified}
        />
      </WidgetGrid>
    </FieldSchemaProvider>
  );
};

export { EtoViewInvestorLayout };
