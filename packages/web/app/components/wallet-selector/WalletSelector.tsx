import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { branch, compose, renderComponent, withStateHandlers } from "recompose";

import { actions } from "../../modules/actions";
import { selectIsAuthorized } from "../../modules/auth/selectors";
import { ELogoutReason } from "../../modules/auth/types";
import { TLoginRouterState } from "../../modules/routing/types";
import {
  selectIsLoginRoute,
  selectIsMessageSigning,
  selectOppositeRootPath,
  selectRootPath,
  selectUrlUserType,
} from "../../modules/wallet-selector/selectors";
import { appConnect } from "../../store";
import { withContainer } from "../../utils/withContainer.unsafe";
import { TransitionalLayout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { ICBMWalletHelpTextModal } from "./ICBMWalletHelpTextModal";
import { resetWalletOnLeave } from "./resetWallet";
import { WalletMessageSigner } from "./WalletMessageSigner";
import { WalletSelectorLayout } from "./WalletSelectorLayout";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

type TExternalProps = {
  isSecretProtected: boolean;
} & TRouteLoginProps;

interface IStateProps {
  isAuthorized: boolean;
  isMessageSigning: boolean;
  rootPath: string;
  isLoginRoute: boolean;
  oppositeRoute: string;
  userType: string;
}

interface IDispatchProps {
  openICBMModal: () => void;
}

type TLocalStateProps = {
  logoutReason: ELogoutReason | undefined;
};

type TLocalStateHandlersProps = {
  hideLogoutReason: () => Partial<TLocalStateProps> | undefined;
};

export const WalletSelector = compose<
  TExternalProps & IStateProps & IDispatchProps & TLocalStateHandlersProps & TLocalStateProps,
  {}
>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      isAuthorized: selectIsAuthorized(s.auth),
      isMessageSigning: selectIsMessageSigning(s),
      rootPath: selectRootPath(s.router),
      isLoginRoute: selectIsLoginRoute(s.router),
      userType: selectUrlUserType(s.router),
      oppositeRoute: selectOppositeRootPath(s.router),
    }),
    dispatchToProps: dispatch => ({
      openICBMModal: () => dispatch(actions.genericModal.showModal(ICBMWalletHelpTextModal)),
    }),
  }),
  resetWalletOnLeave(),
  withContainer(TransitionalLayout),
  branch<IStateProps & IDispatchProps>(
    props => props.isMessageSigning,
    renderComponent(WalletMessageSigner),
  ),
  withStateHandlers<TLocalStateProps, TLocalStateHandlersProps, TExternalProps>(
    ({ location }) => ({
      logoutReason: location.state && location.state.logoutReason,
    }),
    {
      hideLogoutReason: () => () => ({
        logoutReason: undefined,
      }),
    },
  ),
)(WalletSelectorLayout);
