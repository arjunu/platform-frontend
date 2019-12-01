import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Container, EColumnSpan, EContainerType } from "../../../../layouts/Container";
import { DashboardHeading } from "../../../../shared/DashboardHeading";
import { ILink, MediaLinksWidget } from "../../../../shared/MediaLinksWidget";
import { Panel } from "../../../../shared/Panel";
import { Slides } from "../../../../shared/Slides";
import { IEtoSocialProfile, SocialProfilesList } from "../../../../shared/SocialProfilesList";
import { TwitterTimelineEmbed } from "../../../../shared/TwitterTimeline";
import { Video } from "../../../../shared/Video";
import { EtoAccordionElements } from "../EtoAccordionElements";
import { CompanyDescription } from "./CompanyDescription";
import { DocumentsWidget } from "./documents-widget/DocumentsWidget";
import { EtoInvestmentTermsWidget } from "./eto-investment-terms-widget/EtoInvestmentTermsWidget";
import { ETOTimeline } from "./eto-timeline/ETOTimeline";
import { TEtoViewCampaignOverviewProps } from "./EtoViewCampaignOverview";
import { Individuals } from "./individuals/Individuals";
import { LegalInformationWidget } from "./legal-information-widget/LegalInformationWidget";
import { MarketingDocumentsWidget } from "./MarketingDocumentsWidget";

import * as styles from "../EtoView.module.scss";

export const EtoViewCampaignOverviewLayout: React.FunctionComponent<TEtoViewCampaignOverviewProps> = ({
  data: {
    showTwitterFeed,
    twitterUrl,
    showYouTube,
    showSlideshare,
    showSocialChannels,
    showInvestmentTerms,
  },
  eto,
  isUserFullyVerified,
}) => {
  const {
    socialChannels,
    companyVideo,
    companySlideshare,
    brandName,
    companyNews,
    marketingLinks,
  } = eto.company;

  const shouldSplitGrid =
    showSlideshare || showTwitterFeed || showYouTube || showSocialChannels
      ? EColumnSpan.TWO_COL
      : EColumnSpan.THREE_COL;

  return (
    <>
      <ETOTimeline eto={eto} />

      <Container columnSpan={shouldSplitGrid}>
        <CompanyDescription eto={eto} />
        <LegalInformationWidget companyData={eto.company} columnSpan={EColumnSpan.THREE_COL} />
      </Container>
      <Container columnSpan={EColumnSpan.ONE_COL}>
        {showSlideshare && (
          <Container>
            <DashboardHeading title={<FormattedMessage id="eto.public-view.pitch-deck" />} />
            <Slides slideShareUrl={companySlideshare && companySlideshare.url} />
          </Container>
        )}

        {showYouTube && (
          <Container>
            <DashboardHeading title={<FormattedMessage id="eto.public-view.video" />} />
            <Video youTubeUrl={companyVideo && companyVideo.url} hasModal />
          </Container>
        )}
        <Container>
          <div className={cn((showSlideshare || showYouTube) && "mt-4")}>
            <SocialProfilesList profiles={(socialChannels as IEtoSocialProfile[]) || []} />
          </div>
        </Container>
      </Container>
      <MarketingDocumentsWidget
        columnSpan={EColumnSpan.THREE_COL}
        companyMarketingLinks={marketingLinks}
      />
      {showInvestmentTerms && (
        <Container columnSpan={EColumnSpan.THREE_COL}>
          <DashboardHeading title={<FormattedMessage id="eto.public-view.token-terms.title" />} />
          <EtoInvestmentTermsWidget eto={eto} isUserFullyVerified={isUserFullyVerified} />
        </Container>
      )}
      <Individuals eto={eto} />
      <EtoAccordionElements eto={eto} />

      <Container columnSpan={EColumnSpan.ONE_COL} type={EContainerType.INHERIT_GRID}>
        <DocumentsWidget
          eto={eto}
          columnSpan={EColumnSpan.THREE_COL}
          isUserFullyVerified={isUserFullyVerified}
        />

        {showTwitterFeed && (
          <Container columnSpan={EColumnSpan.ONE_COL}>
            <DashboardHeading title={<FormattedMessage id={"eto.public-view.twitter-feed"} />} />
            <Panel className={styles.twitter}>
              <TwitterTimelineEmbed url={twitterUrl!} userName={brandName} />
            </Panel>
          </Container>
        )}

        {companyNews && !!companyNews[0].url && (
          <Container columnSpan={EColumnSpan.ONE_COL}>
            <DashboardHeading title={<FormattedMessage id="eto.form.media-links.title" />} />
            <MediaLinksWidget
              links={[...companyNews].reverse() as ILink[]}
              columnSpan={EColumnSpan.THREE_COL}
            />
          </Container>
        )}
      </Container>
    </>
  );
};
