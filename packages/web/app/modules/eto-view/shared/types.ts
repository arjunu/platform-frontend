import { XOR } from "../../../types";
import { EProcessState } from "../../../utils/enums/processStates";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";

export type TSocialChannel = {
  url: string | undefined;
  type: string;
};

export enum EEtoViewType {
  ETO_VIEW_NOT_AUTHORIZED = "etoViewNotAuthorized",
  ETO_VIEW_INVESTOR = "etoViewInvestor",
  ETO_VIEW_ISSUER = "etoViewIssuer",
  ETO_VIEW_ISSUER_PREVIEW = "etoViewIssuerPreview",
  ETO_VIEW_NOMINEE = "etoViewNominee",
}

export type TCampaignOverviewTabsData = {
  url: string;
  path: string;
  etoId: string;
};

export type TEtoViewData = {
  eto: TEtoWithCompanyAndContractReadonly;
  userIsFullyVerified: boolean;
  campaignOverviewData: TCampaignOverviewData;
};

export enum EEtoViewCampaignOverviewType {
  WITH_STATS = "withStats",
  WITHOUT_STATS = "withoutStats",
}

export type TCampaignOverviewWithStatsRouteData = {
  url: string;
  path: string;
};

export type TCampaignOverviewParams = {
  url: string;
  showYouTube: boolean;
  showSlideshare: boolean;
  showSocialChannels: boolean;
  showInvestmentTerms: boolean;
} & XOR<{ showTwitterFeed: true; twitterUrl: string }, { showTwitterFeed: false }>;

export type TCampaignOverviewData = TCampaignOverviewParams &
  XOR<
    { campaignOverviewType: EEtoViewCampaignOverviewType.WITHOUT_STATS },
    {
      campaignOverviewType: EEtoViewCampaignOverviewType.WITH_STATS;
    } & TCampaignOverviewWithStatsRouteData
  >;

export type TReadyEtoViewData =
  | ({ etoViewType: EEtoViewType.ETO_VIEW_NOT_AUTHORIZED } & TEtoViewData)
  | ({ etoViewType: EEtoViewType.ETO_VIEW_INVESTOR } & TEtoViewData)
  | ({ etoViewType: EEtoViewType.ETO_VIEW_ISSUER } & TEtoViewData)
  | ({ etoViewType: EEtoViewType.ETO_VIEW_ISSUER_PREVIEW } & TEtoViewData)
  | ({ etoViewType: EEtoViewType.ETO_VIEW_NOMINEE } & TEtoViewData);

export type TReadyEtoView = {
  processState: EProcessState.SUCCESS;
} & TReadyEtoViewData;

export type TNotReadyEtoView =
  | { processState: EProcessState.ERROR }
  | { processState: EProcessState.NOT_STARTED }
  | { processState: EProcessState.IN_PROGRESS };

export type TEtoViewState = XOR<TReadyEtoView, TNotReadyEtoView>;
