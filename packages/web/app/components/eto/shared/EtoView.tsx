import * as cn from "classnames";
import { some } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { match as routerMatch, Route, RouteComponentProps, withRouter } from "react-router";
import { branch, compose, renderComponent } from "recompose";

import { ETHEREUM_ZERO_ADDRESS } from "../../../config/constants";
import {
  EtoCompanyInformationType,
  EtoPitchType,
  TSocialChannelsType,
} from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { selectIsIssuer } from "../../../modules/auth/selectors";
import {
  EETOStateOnChain,
  EEtoSubState,
  TEtoWithCompanyAndContractReadonly,
} from "../../../modules/eto/types";
import { isOnChain } from "../../../modules/eto/utils";
import { appConnect } from "../../../store";
import { SwitchConnected } from "../../../utils/connectedRouting";
import { withMetaTags } from "../../../utils/withMetaTags.unsafe";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { WidgetGrid } from "../../layouts/WidgetGrid";
import { PersonProfileModal } from "../../modals/PersonProfileModal";
import { FieldSchemaProvider } from "../../shared/Field";
import { ILink, MediaLinksWidget } from "../../shared/MediaLinksWidget";
import { Panel } from "../../shared/Panel";
import { Slides } from "../../shared/Slides";
import { IEtoSocialProfile, SocialProfilesList } from "../../shared/SocialProfilesList";
import { TabContent, Tabs } from "../../shared/Tabs";
import { TwitterTimelineEmbed } from "../../shared/TwitterTimeline";
import { Video } from "../../shared/Video";
import { EtoOverviewStatus } from "../overview/EtoOverviewStatus/EtoOverviewStatus";
import { CompanyDescription } from "../public-view/CompanyDescription";
import { Cover } from "../public-view/Cover";
import { CoverBanner } from "../public-view/CoverBanner";
import { DocumentsWidget } from "../public-view/DocumentsWidget";
import { EtoAccordionElements } from "../public-view/EtoAccordionElements";
import { EtoInvestmentTermsWidget } from "../public-view/EtoInvestmentTermsWidget";
import { ETOTimeline } from "../public-view/ETOTimeline";
import { Individuals } from "../public-view/Individuals";
import { LegalInformationWidget } from "../public-view/LegalInformationWidget";
import { MarketingDocumentsWidget } from "../public-view/MarketingDocumentsWidget";
import { DashboardHeading } from "./DashboardHeading";
import { EtoViewFundraisingStatistics } from "./EtoViewFundraisingStatistics";

import * as styles from "./EtoView.module.scss";

export const CHART_COLORS = ["#50e3c2", "#2fb194", "#4a90e2", "#0b0e11", "#394652", "#c4c5c6"];
export const DEFAULT_CHART_COLOR = "#c4c5c6";

interface IProps {
  eto: TEtoWithCompanyAndContractReadonly;
  publicView: boolean;
  isUserFullyVerified: boolean;
}

interface IEtoViewTabsState {
  isIssuer: boolean;
}

interface IEtoViewTabsExternalProps {
  match: routerMatch<unknown>;
  isUserFullyVerified: boolean;
  publicView: boolean;
  eto: TEtoWithCompanyAndContract;
}

const EtoViewSchema = EtoCompanyInformationType.toYup().concat(EtoPitchType.toYup());

const EtoViewCampaignOverview: React.FunctionComponent<IProps> = ({ eto, isUserFullyVerified }) => {
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

const EtoViewTabsLayout: React.FunctionComponent<IEtoViewTabsState & IEtoViewTabsExternalProps> = ({
  eto,
  publicView,
  isUserFullyVerified,
  match,
}) => (
  <Container id="eto-view-tabs" columnSpan={EColumnSpan.THREE_COL}>
    <Tabs
      className="mb-3"
      layoutSize="large"
      layoutOrnament={false}
      data-test-id="eto.public-view.campaign-overview"
    >
      <TabContent
        tab={<FormattedMessage id="eto.public-view.campaign-overview" />}
        routerPath={match.url}
      />
      <TabContent
        tab={<FormattedMessage id="eto.public-view.fundraising-statistics" />}
        data-test-id="eto.public-view.fundraising-statistics"
        routerPath={`${match.url}/stats`}
      />
    </Tabs>
    <SwitchConnected>
      <Route
        path={match.path}
        render={() => (
          <WidgetGrid className={styles.etoLayout} data-test-id="eto.public-view">
            <EtoViewCampaignOverview
              eto={eto}
              isUserFullyVerified={isUserFullyVerified}
              publicView={publicView}
            />
          </WidgetGrid>
        )}
        exact
      />
      <Route
        path={`${match.path}/stats`}
        render={() => <EtoViewFundraisingStatistics etoId={eto.etoId} />}
      />
    </SwitchConnected>
  </Container>
);

const EtoViewTabs = compose<
  IEtoViewTabsExternalProps & IEtoViewTabsState,
  IEtoViewTabsExternalProps
>(
  appConnect<IEtoViewTabsState, {}, IProps>({
    stateToProps: state => ({
      isIssuer: selectIsIssuer(state),
    }),
  }),
  branch<IProps & IEtoViewTabsState>(
    props =>
      isOnChain(props.eto) &&
      props.eto.contract.timedState === EETOStateOnChain.Whitelist &&
      props.eto.subState !== EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE,
    renderComponent(EtoViewTabsLayout),
  ),
  branch<IProps & IEtoViewTabsState>(
    props =>
      isOnChain(props.eto) &&
      props.eto.contract.timedState === EETOStateOnChain.Whitelist &&
      // investor can invest
      (props.eto.subState !== EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE ||
        // or it's a issuer view
        !props.publicView),
    renderComponent(EtoViewTabsLayout),
  ),
  branch<IProps>(
    props =>
      isOnChain(props.eto) &&
      [
        EETOStateOnChain.Public,
        EETOStateOnChain.Signing,
        EETOStateOnChain.Claim,
        EETOStateOnChain.Payout,
        EETOStateOnChain.Refund,
      ].includes(props.eto.contract.timedState),
    renderComponent(EtoViewTabsLayout),
  ),
)(EtoViewCampaignOverview);

const EtoViewLayout: React.FunctionComponent<IProps & RouteComponentProps<unknown>> = ({
  eto,
  publicView,
  isUserFullyVerified,
  match,
}) => {
  const { categories, brandName, companyOneliner, companyLogo, companyBanner } = eto.company;

  return (
    <FieldSchemaProvider value={EtoViewSchema}>
      <PersonProfileModal />
      <WidgetGrid className={styles.etoLayout} data-test-id="eto.public-view">
        <CoverBanner eto={eto} publicView={publicView} />
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
        <EtoOverviewStatus eto={eto} publicView={publicView} isEmbedded={false} url={match.url} />
        <EtoViewTabs
          match={match}
          eto={eto}
          publicView={publicView}
          isUserFullyVerified={isUserFullyVerified}
        />
      </WidgetGrid>
    </FieldSchemaProvider>
  );
};

const EtoView = compose<IProps & RouteComponentProps<unknown>, IProps>(
  withMetaTags<IProps>(({ eto }, intl) => {
    const requiredDataPresent =
      eto.company.brandName && eto.equityTokenName && eto.equityTokenSymbol;

    return {
      title: requiredDataPresent
        ? `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`
        : intl.formatIntlMessage("menu.eto-page"),
    };
  }),
  withRouter,
)(EtoViewLayout);

export { EtoView, EtoViewLayout };
