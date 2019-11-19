import * as React from "react";
import { branch, compose, renderComponent, withProps } from "recompose";

import { selectIsUserFullyVerified } from "../../modules/auth/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../modules/eto/types";
import {
  selectActiveNomineeEto,
  selectNomineeFlowHasError,
} from "../../modules/nominee-flow/selectors";
import { appConnect } from "../../store";
import { withContainer } from "../../utils/withContainer.unsafe";
import { Layout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import {
  ErrorBoundaryComponent,
  ErrorBoundaryLayout,
} from "../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoView } from "./shared/EtoView";

type TStateProps = {
  eto: TEtoWithCompanyAndContractReadonly | undefined;
  isUserFullyVerified: boolean;
  hasError: boolean;
};

export type TViewProps = {
  eto: TEtoWithCompanyAndContractReadonly;
  publicView: boolean;
  isUserFullyVerified: boolean;
};

export type TLinkedNomineeComponentProps = {
  eto: TEtoWithCompanyAndContractReadonly;
};

export const connectToNomineeEto = <T extends {}>(
  WrappedComponent: React.ComponentType<TLinkedNomineeComponentProps & T>,
) =>
  compose<TLinkedNomineeComponentProps & T, T>(
    createErrorBoundary(ErrorBoundaryLayout),
    appConnect<TStateProps, {}, T>({
      stateToProps: state => ({
        eto: selectActiveNomineeEto(state),
        isUserFullyVerified: selectIsUserFullyVerified(state),
        hasError: selectNomineeFlowHasError(state),
      }),
    }),
  )(WrappedComponent);

export const EtoNomineeView = compose<TViewProps, TLinkedNomineeComponentProps>(
  connectToNomineeEto,
  withProps<{ publicView: boolean }, TStateProps>({ publicView: false }),
  withContainer(Layout),
  branch<TStateProps>(props => props.hasError, renderComponent(ErrorBoundaryComponent)),
  branch<TStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
)(EtoView);
