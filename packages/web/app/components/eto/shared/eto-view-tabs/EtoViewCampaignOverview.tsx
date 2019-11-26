import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import * as cn from "classnames";
import { some } from "lodash";

import { TSocialChannelsType } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { ETHEREUM_ZERO_ADDRESS } from "../../../../config/constants";
import { Container, EColumnSpan, EContainerType } from "../../../layouts/Container";
import { ETOTimeline } from "../../public-view/ETOTimeline";
import { CompanyDescription } from "../../public-view/CompanyDescription";
import { LegalInformationWidget } from "../../public-view/LegalInformationWidget";
import { DashboardHeading } from "../DashboardHeading";
import { Slides } from "../../../shared/Slides";
import { Video } from "../../../shared/Video";
import { IEtoSocialProfile, SocialProfilesList } from "../../../shared/SocialProfilesList";
import { MarketingDocumentsWidget } from "../../public-view/MarketingDocumentsWidget";
import { EtoInvestmentTermsWidget } from "../../public-view/EtoInvestmentTermsWidget";
import { Individuals } from "../../public-view/Individuals";
import { EtoAccordionElements } from "../../public-view/EtoAccordionElements";
import { DocumentsWidget } from "../../public-view/DocumentsWidget";
import { Panel } from "../../../shared/Panel";
import { TwitterTimelineEmbed } from "../../../shared/TwitterTimeline";
import { ILink, MediaLinksWidget } from "../../../shared/MediaLinksWidget";
import { IProps } from "./EtoViewTabs";

import * as styles from "../EtoView.module.scss";

export const EtoViewCampaignOverview: React.FunctionComponent<IProps> = ({ eto, isUserFullyVerified }) => {
  const {
    socialChannels,
    companyVideo,
    disableTwitterFeed,
    companySlideshare,
    brandName,
    companyNews,
    marketingLinks,
  } = eto.company;

  const isTwitterFeedEnabled =
    some<TSocialChannelsType[0]>(
      socialChannels,
      channel => channel.type === "twitter" && !!channel.url && !!channel.url.length,
    ) && !disableTwitterFeed;
  const isYouTubeVideoAvailable = !!(companyVideo && companyVideo.url);
  const isSlideShareAvailable = !!(companySlideshare && companySlideshare.url);
  const hasSocialChannelsAdded = !!(socialChannels && socialChannels.length);
  const twitterUrl =
    isTwitterFeedEnabled && socialChannels
      ? socialChannels.find(c => c.type === "twitter") &&
      socialChannels.find(c => c.type === "twitter")!.url
      : "";

  const isProductSet = eto.product.id !== ETHEREUM_ZERO_ADDRESS;

  const shouldSplitGrid =
    isSlideShareAvailable ||
    isTwitterFeedEnabled ||
    isYouTubeVideoAvailable ||
    hasSocialChannelsAdded
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
        {isSlideShareAvailable && (
          <Container>
            <DashboardHeading title={<FormattedMessage id="eto.public-view.pitch-deck" />} />
            <Slides slideShareUrl={companySlideshare && companySlideshare.url} />
          </Container>
        )}

        {isYouTubeVideoAvailable && (
          <Container>
            <DashboardHeading title={<FormattedMessage id="eto.public-view.video" />} />
            <Video youTubeUrl={companyVideo && companyVideo.url} hasModal />
          </Container>
        )}
        <Container>
          <div className={cn((isSlideShareAvailable || isYouTubeVideoAvailable) && "mt-4")}>
            <SocialProfilesList profiles={(socialChannels as IEtoSocialProfile[]) || []} />
          </div>
        </Container>
      </Container>
      <MarketingDocumentsWidget
        columnSpan={EColumnSpan.THREE_COL}
        companyMarketingLinks={marketingLinks}
      />
      {isProductSet && (
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

        {isTwitterFeedEnabled && (
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
