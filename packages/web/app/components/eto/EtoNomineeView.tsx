import * as React from "react";
import { branch, compose, renderComponent, withProps } from "recompose";

import { actions } from "../../modules/actions";
import { selectIsUserFullyVerified } from "../../modules/auth/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../modules/eto/types";
import { selectNomineeEtoWithCompanyAndContract } from "../../modules/nominee-flow/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer.unsafe";
import { Layout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoView } from "./shared/EtoView";

type TStateProps = {
  eto: TEtoWithCompanyAndContractReadonly | undefined;
  isUserFullyVerified: boolean;
};

type TViewProps = {
  eto: TEtoWithCompanyAndContractReadonly;
  publicView: boolean;
  isUserFullyVerified: boolean;
};

type TLinkedNomineeComponentProps = {
  eto: TEtoWithCompanyAndContractReadonly;
};

export const connectToNomineeEto = <T extends {}>(
  WrappedComponent: React.ComponentType<TLinkedNomineeComponentProps & T>,
) =>
  compose<TLinkedNomineeComponentProps & T, T>(
    createErrorBoundary(ErrorBoundaryLayout),
    appConnect<TStateProps, {}, T>({
      stateToProps: state => ({
        eto: selectNomineeEtoWithCompanyAndContract(state),
        isUserFullyVerified: selectIsUserFullyVerified(state),
      }),
    }),
    onEnterAction({
      actionCreator: dispatch => dispatch(actions.nomineeFlow.loadNomineeEtos()),
    }),
  )(WrappedComponent);

export const EtoNomineeView = compose<TViewProps, TLinkedNomineeComponentProps>(
  connectToNomineeEto,
  withProps<{ publicView: boolean }, TStateProps>({ publicView: false }),
  withContainer(Layout),
  branch<TStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
)(EtoView);
