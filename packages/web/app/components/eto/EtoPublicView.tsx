import { branch, compose, renderComponent, withProps } from "recompose";

import { actions } from "../../modules/actions";
import { selectIsUserFullyVerified } from "../../modules/auth/selectors";
import { selectEtoWithCompanyAndContract } from "../../modules/eto/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../modules/eto/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer.unsafe";
import { Layout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoView } from "./shared/EtoView";
import { withJurisdictionDisclaimer } from "./shared/routing/withJurisdictionDisclaimer";
import { withJurisdictionRoute } from "./shared/routing/withJurisdictionRoute";

interface IStateProps {
  eto?: TEtoWithCompanyAndContractReadonly;
  isUserFullyVerified: boolean;
}

interface IRouterParams {
  previewCode: string;
  jurisdiction: string;
}

type TProps = {
  eto: TEtoWithCompanyAndContractReadonly;
  publicView: boolean;
  isUserFullyVerified: boolean;
};

export const EtoPublicView = compose<TProps, IRouterParams>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps, {}, IRouterParams>({
    stateToProps: (state, props) => ({
      eto: selectEtoWithCompanyAndContract(state, props.previewCode),
      isUserFullyVerified: selectIsUserFullyVerified(state),
    }),
  }),
  onEnterAction<IRouterParams>({
    actionCreator: (dispatch, props) => {
      dispatch(actions.eto.loadEtoPreview(props.previewCode));
    },
  }),
  withProps<{ publicView: boolean }, IStateProps>(() => ({ publicView: true })),
  withContainer(Layout),
  branch<IStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
  withJurisdictionDisclaimer<TProps>(props => props.eto.previewCode),
  withJurisdictionRoute<TProps & IRouterParams>(props => ({
    previewCode: props.eto.previewCode,
    jurisdiction: props.jurisdiction,
  })),
)(EtoView);
