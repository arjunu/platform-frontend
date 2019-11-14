import * as React from "react";
import { Redirect } from "react-router";
import { branch, compose, renderComponent } from "recompose";

import { EKycRequestStatus, EKycRequestType } from "../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../modules/actions";
import { selectIsUserEmailVerified } from "../../modules/auth/selectors";
import {
  selectIsKycFlowBlockedByRegion,
  selectKycOutSourcedURL,
  selectKycRequestStatus,
  selectPendingKycRequestType,
} from "../../modules/kyc/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer.unsafe";
import { appRoutes } from "../appRoutes";
import { Layout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";

const KycLayout = React.lazy(() => import("./KycLayout").then(imp => ({ default: imp.KycLayout })));

interface IStateProps {
  requestLoading?: boolean;
  requestStatus?: EKycRequestStatus;
  redirectUrl: string;
  pendingRequestType: EKycRequestType | undefined;
  hasVerifiedEmail: boolean;
  isKycFlowBlockedByRegion: boolean;
}

interface IDispatchProps {
  reopenRequest: () => void;
  goToProfile: () => void;
  goToDashboard: () => void;
}

const Kyc = compose<IStateProps & IDispatchProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      requestLoading:
        state.kyc.individualRequestStateLoading || state.kyc.businessRequestStateLoading,
      requestStatus: selectKycRequestStatus(state),
      redirectUrl: selectKycOutSourcedURL(state.kyc),
      pendingRequestType: selectPendingKycRequestType(state.kyc),
      hasVerifiedEmail: selectIsUserEmailVerified(state.auth),
      isKycFlowBlockedByRegion: selectIsKycFlowBlockedByRegion(state),
    }),
    dispatchToProps: dispatch => ({
      reopenRequest: () => {},
      goToProfile: () => dispatch(actions.routing.goToProfile()),
      goToDashboard: () => dispatch(actions.routing.goToDashboard()),
    }),
    options: { pure: false },
  }),
  branch(
    (props: IStateProps) => !props.hasVerifiedEmail || props.isKycFlowBlockedByRegion,
    renderComponent(() => <Redirect to={appRoutes.profile} />),
  ),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadIndividualRequest());
      dispatch(actions.kyc.kycLoadBusinessRequest());
    },
  }),
  withContainer(Layout),
)(KycLayout);

export { Kyc };
