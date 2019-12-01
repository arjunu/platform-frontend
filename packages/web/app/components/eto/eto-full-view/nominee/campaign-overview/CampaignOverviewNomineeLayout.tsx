import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TNomineeEtoViewData } from "../../../../../modules/eto-view/shared/types";
import { Container, EColumnSpan, EContainerType } from "../../../../layouts/Container";
import { DashboardHeading } from "../../../../shared/DashboardHeading";
import { ILink, MediaLinksWidget } from "../../../../shared/MediaLinksWidget";
import { Panel } from "../../../../shared/Panel";
import { Slides } from "../../../../shared/Slides";
import { IEtoSocialProfile, SocialProfilesList } from "../../../../shared/SocialProfilesList";
import { TwitterTimelineEmbed } from "../../../../shared/TwitterTimeline";
import { Video } from "../../../../shared/Video";
import { CompanyDescription } from "../../shared/campaign-overview/CompanyDescription";
import { DocumentsWidget } from "../../shared/campaign-overview/documents-widget/DocumentsWidget";
import { EtoInvestmentTermsWidget } from "../../shared/campaign-overview/eto-investment-terms-widget/EtoInvestmentTermsWidget";
import { ETOTimeline } from "../../shared/campaign-overview/eto-timeline/ETOTimeline";
import { Individuals } from "../../shared/campaign-overview/individuals/Individuals";
import { LegalInformationWidget } from "../../shared/campaign-overview/legal-information-widget/LegalInformationWidget";
import { MarketingDocumentsWidget } from "../../shared/campaign-overview/MarketingDocumentsWidget";
import { EtoAccordionElements } from "../../shared/EtoAccordionElements";

import * as styles from "../../shared/EtoView.module.scss";

export const CampaignOverviewNomineeLayout: React.FunctionComponent<TNomineeEtoViewData> = ({
  campaignOverviewData: {
    showTwitterFeed,
    twitterUrl,
    showYouTube,
    showSlideshare,
    showSocialChannels,
    showInvestmentTerms,
  },
  eto,
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
          <EtoInvestmentTermsWidget eto={eto} isUserFullyVerified={true} />
        </Container>
      )}
      <Individuals eto={eto} />
      <EtoAccordionElements eto={eto} />

      <Container columnSpan={EColumnSpan.ONE_COL} type={EContainerType.INHERIT_GRID}>
        <DocumentsWidget eto={eto} columnSpan={EColumnSpan.THREE_COL} isUserFullyVerified={true} />

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
