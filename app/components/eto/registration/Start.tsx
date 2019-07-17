import * as React from "react";
import { branch, renderComponent } from "recompose";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { withContainer } from "../../../utils/withContainer.unsafe";
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
  onEnterAction({ actionCreator: d => d(actions.etoFlow.loadIssuerEto()) }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isLoading: s.etoFlow.loading,
    }),
  }),
  branch<IStateProps>(props => props.isLoading, renderComponent(LoadingIndicator)),
  withContainer(Layout),
)(EtoRegistrationPanel);
