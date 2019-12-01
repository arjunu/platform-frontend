import * as React from "react";

import { TDataTestId } from "../../types";
import { ProgressBarSimple } from "../shared/ProgressBarSimple";
import { Content } from "./Content";
import { HeaderFullscreen, THeaderFullscreenProps } from "./header/HeaderFullscreen";
import { TContentExternalProps } from "./Layout";
import { LayoutWrapper } from "./LayoutWrapper";

import * as styles from "./FullscreenProgressLayout.module.scss";

type TProgressProps = {
  progress?: number;
};

type TProgressContext = {
  progress: number;
  setCurrentProgress: (value: number) => void;
};

const calculateStepProgress = (step: number, allSteps: number) =>
  Math.ceil((step / allSteps) * 100);

const FullscreenProgressContext = React.createContext<TProgressContext>({
  progress: 0,
  setCurrentProgress: () => {},
});

const useProgress = (initialValue = 0): TProgressContext => {
  const [progress, setProgress] = React.useState(initialValue);

  const setCurrentProgress = React.useCallback((currentProgress: number) => {
    setProgress(currentProgress);
  }, []);

  return { progress, setCurrentProgress };
};

const FullscreenProgressLayout: React.FunctionComponent<TDataTestId &
  TContentExternalProps &
  THeaderFullscreenProps &
  TProgressProps> = ({
  children,
  "data-test-id": dataTestId,
  title,
  action,
  progress = 0,
  ...contentProps
}) => {
  const progressVal = useProgress(progress);

  return (
    <LayoutWrapper data-test-id={dataTestId}>
      <FullscreenProgressContext.Provider value={progressVal}>
        <HeaderFullscreen action={action} title={title} />
        <ProgressBarSimple className={styles.progress} progress={progressVal.progress} />
        <Content {...contentProps}>{children}</Content>
      </FullscreenProgressContext.Provider>
    </LayoutWrapper>
  );
};

export { FullscreenProgressLayout, useProgress, FullscreenProgressContext, calculateStepProgress };
