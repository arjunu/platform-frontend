import { withContainer } from "@neufund/shared";
import * as React from "react";
import { branch, renderComponent } from "recompose";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { selectIssuerEtoLoading } from "../../../modules/eto-flow/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { Layout } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../../shared/loading-indicator";

const EtoRegistrationPanel = React.lazy(() =>
  import("./EtoRegistrationPanel").then(imp => ({ default: imp.EtoRegistrationPanel })),
);

interface IStateProps {
  isLoading: boolean;
}

export const EtoRegister = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  onEnterAction({ actionCreator: d => d(actions.etoFlow.loadIssuerEto()) }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isLoading: selectIssuerEtoLoading(s),
    }),
  }),
  branch<IStateProps>(props => props.isLoading, renderComponent(LoadingIndicator)),
)(EtoRegistrationPanel);
