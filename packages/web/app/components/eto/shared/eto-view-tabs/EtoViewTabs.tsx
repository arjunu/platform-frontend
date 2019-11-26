import { match as routerMatch } from "react-router";
import { branch, compose, renderComponent } from "recompose";

import { EETOStateOnChain, EEtoSubState, TEtoWithCompanyAndContractReadonly } from "../../../../modules/eto/types";
import { isOnChain } from "../../../../modules/eto/utils";
import { EtoViewTabsLayout } from "./EtoViewTabsLayout";
import { EtoViewCampaignOverview } from "./EtoViewCampaignOverview";


export interface IProps {
  eto: TEtoWithCompanyAndContractReadonly;
  publicView: boolean;
  isUserFullyVerified: boolean;
}

export interface IEtoViewTabsState {
  isIssuer: boolean;
}

export interface IEtoViewTabsExternalProps {
  match: routerMatch<unknown>;
  isUserFullyVerified: boolean;
  publicView: boolean;
  eto: TEtoWithCompanyAndContractReadonly;
}

export const EtoViewTabs = compose<
  IEtoViewTabsExternalProps & IEtoViewTabsState,
  IEtoViewTabsExternalProps
  >(
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
