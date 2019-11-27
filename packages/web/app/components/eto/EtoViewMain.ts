import { branch, compose, renderComponent } from "recompose";

import { appConnect } from "../../store";
import {
  EEtoViewType,
  TEtoViewState,
  TInvestorEtoViewData, TIssuerEtoViewData,
  TNotAuthorizedEtoViewData,
  TReadyEtoView
} from "../../modules/eto-view/reducer";
import { selectEtoViewData } from "../../modules/eto-view/selectors";
import { EProcessState } from "../../utils/enums/processStates";
import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";
import { EtoViewNonAuthorized } from "./EtoViewNonAuthorized";
import { EtoViewInvestor } from "./EtoViewInvestor";
import { EtoViewIssuer } from "./EtoViewIssuer";

export const EtoViewMain = compose<{},{}>(
  appConnect<TEtoViewState, {}, {}>({
    stateToProps: (state) => ({
      ...selectEtoViewData(state)
    }),
  }),
  branch<TEtoViewState>(({processState}) => processState !== EProcessState.SUCCESS, renderComponent(LoadingIndicator)), //todo add error state
  branch<TEtoViewState>(({etoViewType}) => etoViewType === EEtoViewType.ETO_VIEW_NOT_AUTHORIZED,
    renderComponent<TNotAuthorizedEtoViewData>(EtoViewNonAuthorized)),
  branch<TEtoViewState>(({etoViewType}) => etoViewType === EEtoViewType.ETO_VIEW_INVESTOR,
    renderComponent<TInvestorEtoViewData>(EtoViewInvestor)),
  branch<TEtoViewState>(({etoViewType}) => etoViewType === EEtoViewType.ETO_VIEW_ISSUER,
    renderComponent<TIssuerEtoViewData>(EtoViewIssuer)),
  branch<TEtoViewState>(({etoViewType}) => etoViewType === EEtoViewType.ETO_VIEW_ISSUER_PREVIEW,
    renderComponent<TReadyEtoView>(EtoViewInvestor)),
  branch<TEtoViewState>(({etoViewType}) => etoViewType === EEtoViewType.ETO_VIEW_INVESTOR,
    renderComponent<TReadyEtoView>(EtoViewInvestor)),
  branch<TEtoViewState>(({etoViewType}) => etoViewType === EEtoViewType.ETO_VIEW_NOMINEE,
    renderComponent<TReadyEtoView>(EtoViewInvestor)),
)(()=>null);
