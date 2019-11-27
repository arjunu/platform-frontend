import { AppReducer } from "../../store";
import { DeepReadonly, XOR } from "../../types";
import { actions } from "../actions";
import { EProcessState } from "../../utils/enums/processStates";
import { TEtoWithCompanyAndContractReadonly } from "../eto/types";

export enum EEtoViewType {
  ETO_VIEW_NOT_AUTHORIZED = "etoViewNotAuthorized",
  ETO_VIEW_INVESTOR = "etoViewInvestor",
  ETO_VIEW_ISSUER = "etoViewIssuer",
  ETO_VIEW_ISSUER_PREVIEW = "etoViewIssuerPreview",
  ETO_VIEW_NOMINEE = "etoViewNominee",
}

export type TNotAuthorizedEtoViewData = {
  eto: TEtoWithCompanyAndContractReadonly,
  campaignOverviewData: TCampaignOverviewData
}

export type TInvestorEtoViewData = {
  eto: TEtoWithCompanyAndContractReadonly,
  userIsFullyVerified: boolean,
  campaignOverviewData: TCampaignOverviewData
}

export type TIssuerEtoViewData = {
  eto: TEtoWithCompanyAndContractReadonly,
  campaignOverviewData: TCampaignOverviewData
}

export type TIssuerPreviewEtoViewData = {
  eto: TEtoWithCompanyAndContractReadonly,
  campaignOverviewData: TCampaignOverviewData
}

export type TNomineeEtoViewData = {
  eto: TEtoWithCompanyAndContractReadonly,
  campaignOverviewData: TCampaignOverviewData
}

export enum EEtoViewCampaignOverviewType {
  WITH_STATS = "withStats",
  WITHOUT_STATS = "withoutStats"
}

export type TCampaignOverviewWithStatsData = {
  url: string,
  path: string,
}

export type TCampaignOverviewData = XOR<{ campaignOverviewType: EEtoViewCampaignOverviewType.WITH_STATS } & TCampaignOverviewWithStatsData,
  { campaignOverviewType: EEtoViewCampaignOverviewType.WITHOUT_STATS }>

export type TReadyEtoViewData =
  { etoViewType: EEtoViewType.ETO_VIEW_NOT_AUTHORIZED, } & TNotAuthorizedEtoViewData |
  { etoViewType: EEtoViewType.ETO_VIEW_INVESTOR, } & TInvestorEtoViewData |
  { etoViewType: EEtoViewType.ETO_VIEW_ISSUER, } & TIssuerEtoViewData |
  { etoViewType: EEtoViewType.ETO_VIEW_ISSUER_PREVIEW, } & TIssuerPreviewEtoViewData |
  { etoViewType: EEtoViewType.ETO_VIEW_NOMINEE, } & TNomineeEtoViewData

export type TReadyEtoView = {
  processState: EProcessState.SUCCESS,
} & TReadyEtoViewData

export type TNotReadyEtoView = { processState: EProcessState.ERROR } |
  { processState: EProcessState.NOT_STARTED } |
  { processState: EProcessState.IN_PROGRESS }

export type TEtoViewState = XOR<TReadyEtoView, TNotReadyEtoView>

const etoViewInitialState: TNotReadyEtoView = {
  processState: EProcessState.NOT_STARTED,
};

export const etoViewReducer: AppReducer<TEtoViewState> = (
  state = etoViewInitialState,
  action,
): DeepReadonly<TEtoViewState> => {
  switch (action.type) {
    case actions.etoView.setEtoViewData.getType():
      return {
        processState: EProcessState.SUCCESS,
        ...action.payload.etoData
      };
    case actions.etoView.setEtoError.getType():
      return {
        processState: EProcessState.ERROR,
      }
  }
  return state;
};
