import { ContainerContext, withRootMetaTag } from "@neufund/shared";
import { Container } from "inversify";
import * as React from "react";
import { hot } from "react-hot-loader/root";
import IdleTimer from "react-idle-timer";
import { branch, compose, renderComponent } from "recompose";

import { symbols } from "../di/symbols";
import { ILogger } from "../lib/dependencies/logger";
import { actions } from "../modules/actions";
import { INACTIVITY_THROTTLE_THRESHOLD } from "../modules/auth/constants";
import { EInitType } from "../modules/init/reducer";
import { selectInitError, selectIsInitInProgress } from "../modules/init/selectors";
import { appConnect } from "../store";
import { onEnterAction } from "../utils/react-connected-components/OnEnterAction";
import { ScrollToTop } from "../utils/react-connected-components/ScrollToTop";
import { AppRouter } from "./AppRouter";
import { CriticalError } from "./layouts/CriticalError";
import { FullPageLoading } from "./modals/full-page-loading/FullPageLoading";
import { GenericModal } from "./modals/generic-modal/GenericModal";
import { VideoModal } from "./modals/video-modal/VideoModal";
import { AccessWalletModal } from "./modals/wallet-access/AccessWalletModal";
import { LoadingIndicator } from "./shared/loading-indicator/LoadingIndicator";
import { ToastContainer } from "./shared/Toast";

interface IState {
  renderingError: Error | null;
}

interface IStateProps {
  inProgress: boolean;
  error?: string;
}

interface IDispatchProps {
  userActive: () => void;
}

class AppComponent extends React.Component<IStateProps & IDispatchProps, IState> {
  static contextType = ContainerContext;

  logger: ILogger;

  constructor(props: IStateProps & IDispatchProps, container: Container) {
    super(props);

    this.state = { renderingError: null };

    this.logger = container.get<ILogger>(symbols.logger);
  }

  componentDidCatch(error: Error, errorInfo: object): void {
    this.setState({ renderingError: error });

    this.logger.fatal("Fatal app error", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.renderingError) {
      return <CriticalError message={this.state.renderingError.message} />;
    }

    return (
      <>
        <IdleTimer
          element={document}
          onAction={() => {
            // Only use on action to control when the other tabs are idle
            // @SEE https://github.com/SupremeTechnopriest/react-idle-timer/issues/89
            this.props.userActive();
          }}
          throttle={INACTIVITY_THROTTLE_THRESHOLD}
        />
        <ScrollToTop>
          <AppRouter />
        </ScrollToTop>
        <AccessWalletModal />
        <ToastContainer />
        <GenericModal />
        <FullPageLoading />
        <VideoModal />
      </>
    );
  }
}

const App = compose<IStateProps & IDispatchProps, {}>(
  withRootMetaTag(),
  onEnterAction({
    actionCreator: d => d(actions.init.start(EInitType.APP_INIT)),
  }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      inProgress: selectIsInitInProgress(s.init),
      error: selectInitError(s.init),
    }),
    dispatchToProps: d => ({ userActive: () => d(actions.auth.userActive()) }),
  }),
  branch<IStateProps>(state => !!state.error, renderComponent(CriticalError)),
  branch<IStateProps>(state => state.inProgress, renderComponent(LoadingIndicator)),
)(AppComponent);

const AppHot = hot(App);

export { AppHot as App };
