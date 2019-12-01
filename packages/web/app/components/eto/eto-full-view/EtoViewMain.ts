import { branch, compose, renderComponent } from "recompose";

import { selectEtoViewData } from "../../../modules/eto-view/shared/selectors";
import {
  EEtoViewType,
  TEtoViewState,
  TInvestorEtoViewData,
  TIssuerEtoViewData,
  TIssuerPreviewEtoViewData,
  TNomineeEtoViewData,
  TNotAuthorizedEtoViewData,
} from "../../../modules/eto-view/shared/types";
import { appConnect } from "../../../store";
import { EProcessState } from "../../../utils/enums/processStates";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { EtoViewInvestor } from "./investor/EtoViewInvestor";
import { EtoViewIssuer } from "./issuer/EtoViewIssuer";
import { EtoViewIssuerPreview } from "./issuer/EtoViewIssuerPreview";
import { EtoViewNominee } from "./nominee/EtoViewNominee";
import { EtoViewNonAuthorized } from "./notAuth/EtoViewNonAuthorized";

export const EtoViewMain = compose<{}, {}>(
  appConnect<TEtoViewState, {}, {}>({
    stateToProps: state => ({
      ...selectEtoViewData(state),
    }),
  }),
  branch<TEtoViewState>(
    ({ processState }) => processState !== EProcessState.SUCCESS,
    renderComponent(LoadingIndicator),
  ), //todo add error state

  branch<TEtoViewState>(
    ({ etoViewType }) => etoViewType === EEtoViewType.ETO_VIEW_NOT_AUTHORIZED,
    renderComponent<TNotAuthorizedEtoViewData>(EtoViewNonAuthorized),
  ),
  branch<TEtoViewState>(
    ({ etoViewType }) => etoViewType === EEtoViewType.ETO_VIEW_INVESTOR,
    renderComponent<TInvestorEtoViewData>(EtoViewInvestor),
  ),
  branch<TEtoViewState>(
    ({ etoViewType }) => etoViewType === EEtoViewType.ETO_VIEW_ISSUER,
    renderComponent<TIssuerEtoViewData>(EtoViewIssuer),
  ),
  branch<TEtoViewState>(
    ({ etoViewType }) => etoViewType === EEtoViewType.ETO_VIEW_ISSUER_PREVIEW,
    renderComponent<TIssuerPreviewEtoViewData>(EtoViewIssuerPreview),
  ),
  branch<TEtoViewState>(
    ({ etoViewType }) => etoViewType === EEtoViewType.ETO_VIEW_NOMINEE,
    renderComponent<TNomineeEtoViewData>(EtoViewNominee),
  ),
)(() => null);
