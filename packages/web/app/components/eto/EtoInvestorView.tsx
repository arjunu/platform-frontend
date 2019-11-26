import { branch, compose, renderComponent } from "recompose";
import { appConnect } from "../../store";
import { withContainer } from "../../utils/withContainer.unsafe";
import { Layout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../shared/loading-indicator";
// import { withJurisdictionDisclaimer } from "./shared/routing/withJurisdictionDisclaimer";
// import { withJurisdictionRoute } from "./shared/routing/withJurisdictionRoute";
import { selectEtoViewData } from "../../modules/eto-view/selectors";
import { EProcessState } from "../../utils/enums/processStates";
import { TEtoViewState, TReadyEtoView } from "../../modules/eto-view/reducer";
import { withMetaTags } from "../../utils/withMetaTags.unsafe";
import { EtoViewInvestorLayout } from "./shared/EtoInvestorViewLayout";

// interface IRouterParams {
//   previewCode: string;
//   jurisdiction: string;
// }

export const EtoInvestorView = compose<TReadyEtoView, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  appConnect<TEtoViewState, {}, {}>({
    stateToProps: (state) => ({
    ...selectEtoViewData(state)
    }),
  }),
  branch<TEtoViewState>(({processState}) => processState !== EProcessState.SUCCESS, renderComponent(LoadingIndicator)), //fixme add error state
  // withJurisdictionDisclaimer<TProps>(props => props.eto.previewCode),
  // withJurisdictionRoute<TProps & IRouterParams>(props => ({
  //   previewCode: props.eto.previewCode,
  //   jurisdiction: props.jurisdiction,
  // })),
  withMetaTags<TReadyEtoView>(({eto}) => ({
      title: `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`
    })),
)(EtoViewInvestorLayout);
