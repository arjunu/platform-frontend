import * as React from "react";
import { branch, compose, renderNothing } from "recompose";

import { EKycInstantIdStatus, EKycRequestStatus } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import {
  selectBackupCodesVerified,
  selectIsUserEmailVerified,
} from "../../../modules/auth/selectors";
import {
  selectIsKycFlowBlockedByRegion,
  selectKycInstantIdStatus,
  selectKycIsInitialLoading,
  selectKycRequestStatus,
  selectWidgetError,
} from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { onLeaveAction } from "../../../utils/OnLeaveAction";

interface IStateProps {
  requestStatus: EKycRequestStatus | undefined;
  instantIdStatus: EKycInstantIdStatus | undefined;
  isUserEmailVerified: boolean;
  isLoading: boolean;
  isKycFlowBlockedByRegion: boolean;
  backupCodesVerified: boolean;
  error: string | undefined;
}

interface IDispatchProps {
  onGoToDashboard: () => void;
  onGoToKycHome: () => void;
  onStartIdNow: () => void;
}

const connectKycStatusWidget = () => (
  WrappedComponent: React.ComponentType<IStateProps & IDispatchProps>,
) =>
  compose<IStateProps & IDispatchProps, {}>(
    appConnect<IStateProps, IDispatchProps>({
      stateToProps: state => ({
        isUserEmailVerified: selectIsUserEmailVerified(state.auth),
        backupCodesVerified: selectBackupCodesVerified(state),
        requestStatus: selectKycRequestStatus(state),
        instantIdStatus: selectKycInstantIdStatus(state),
        isLoading: selectKycIsInitialLoading(state),
        isKycFlowBlockedByRegion: selectIsKycFlowBlockedByRegion(state),
        error: selectWidgetError(state.kyc),
      }),
      dispatchToProps: dispatch => ({
        onGoToDashboard: () => dispatch(actions.routing.goToDashboard()),
        onGoToKycHome: () => dispatch(actions.routing.goToKYCHome()),
        onStartIdNow: () => dispatch(actions.kyc.startIdNowRequest()),
      }),
    }),
    branch<IStateProps>(props => props.isLoading, renderNothing),
    onEnterAction({
      actionCreator: d => d(actions.kyc.kycStartWatching()),
    }),
    onLeaveAction({
      actionCreator: d => d(actions.kyc.kycStopWatching()),
    }),
  )(WrappedComponent);

export { connectKycStatusWidget };
