import * as React from "react";
import { branch, compose, renderNothing } from "recompose";

import { selectFullPageLoadingIsOpen } from "../../../modules/full-page-loading/selectors";
import { appConnect } from "../../../store";
import {
  ELoadingIndicator,
  LoadingIndicator,
} from "../../shared/loading-indicator/LoadingIndicator";

import * as styles from "./FullPageLoading.module.scss";

type TStateProps = {
  isOpen: boolean;
};

const FullPageLoadingLayout: React.FunctionComponent = () => {
  React.useEffect(() => {
    document.body.classList.add(styles.body);

    return () => {
      document.body.classList.remove(styles.body);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.backDrop} />
      <LoadingIndicator type={ELoadingIndicator.PULSE_WHITE} />
    </div>
  );
};

const FullPageLoading = compose<{}, {}>(
  appConnect<TStateProps>({
    stateToProps: s => ({
      isOpen: selectFullPageLoadingIsOpen(s),
    }),
  }),
  branch<TStateProps>(props => !props.isOpen, renderNothing),
)(FullPageLoadingLayout);

export { FullPageLoading, FullPageLoadingLayout };
