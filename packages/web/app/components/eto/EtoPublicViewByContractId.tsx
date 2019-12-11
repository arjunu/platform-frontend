import { withContainer } from "@neufund/shared";
import { branch, compose, renderComponent, withProps } from "recompose";

import { actions } from "../../modules/actions";
import { selectIsUserFullyVerified } from "../../modules/auth/selectors";
import { selectEtoWithCompanyAndContractById } from "../../modules/eto/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../modules/eto/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/react-connected-components/OnEnterAction";
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
  etoId: string;
  jurisdiction: string;
}

interface IDispatchProps {
  loadEto: () => void;
}

type TProps = {
  eto: TEtoWithCompanyAndContractReadonly;
  publicView: boolean;
  isUserFullyVerified: boolean;
};

export const EtoPublicViewByContractId = compose<TProps, IRouterParams>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps, IDispatchProps, IRouterParams>({
    stateToProps: (state, props) => ({
      eto: selectEtoWithCompanyAndContractById(state, props.etoId),
      isUserFullyVerified: selectIsUserFullyVerified(state),
    }),
  }),
  onEnterAction<IRouterParams>({
    actionCreator: (dispatch, props) => {
      dispatch(actions.eto.loadEto(props.etoId));
    },
  }),
  withProps<{ publicView: boolean }, IStateProps & IDispatchProps & IRouterParams>(() => ({
    publicView: true,
  })),
  withContainer(Layout),
  branch<IStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
  withJurisdictionDisclaimer<TProps>(props => props.eto.previewCode),
  withJurisdictionRoute<TProps & IRouterParams>(props => ({
    previewCode: props.eto.previewCode,
    jurisdiction: props.jurisdiction,
  })),
)(EtoView);
