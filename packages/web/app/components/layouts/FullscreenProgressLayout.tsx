import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../types";
import { ProgressBarSimple } from "../shared/ProgressBarSimple";
import { Content } from "./Content";
import { HeaderFullscreen, THeaderFullscreenProps } from "./header/HeaderFullscreen";
import { TContentExternalProps } from "./Layout";
import { LayoutWrapper } from "./LayoutWrapper";

import * as styles from "./FullscreenProgressLayout.module.scss";

type TInitialProps = {
  progress?: number;
  buttonProps?: TButtonProps;
};

type TButtonProps = {
  buttonText: TTranslatedString | undefined;
  buttonAction: (() => void) | undefined;
};

type TProgressContext = {
  progress: number;
  setCurrentProgress: (value: number) => void;
};

type TButtonContext = {
  buttonProps: TButtonProps | undefined;
  setCurrentButtonProps: (
    text: TTranslatedString | undefined,
    action: (() => void) | undefined,
  ) => void;
};

const calculateStepProgress = (step: number, allSteps: number) =>
  Math.ceil((step / allSteps) * 100);

const FullscreenProgressContext = React.createContext<TProgressContext>({
  progress: 0,
  setCurrentProgress: () => {},
});

const FullscreenButtonContext = React.createContext<TButtonContext>({
  buttonProps: undefined,
  setCurrentButtonProps: () => {},
});

const useProgress = (initialValue = 0): TProgressContext => {
  const [progress, setProgress] = React.useState(initialValue);

  const setCurrentProgress = React.useCallback((currentProgress: number) => {
    setProgress(currentProgress);
  }, []);

  return { progress, setCurrentProgress };
};

const useActionButton = (initialProps?: TButtonProps): TButtonContext => {
  const [buttonProps, setButtonProps] = React.useState<TButtonProps | undefined>(initialProps);

  const setCurrentButtonProps = React.useCallback(
    (buttonText: TTranslatedString | undefined, buttonAction: (() => void) | undefined) => {
      setButtonProps({ buttonText, buttonAction });
    },
    [],
  );

  return { buttonProps, setCurrentButtonProps };
};

const FullscreenProgressLayout: React.FunctionComponent<TDataTestId &
  TContentExternalProps &
  THeaderFullscreenProps &
  TInitialProps> = ({
  children,
  "data-test-id": dataTestId,
  progress = 0,
  buttonProps,
  ...contentProps
}) => {
  const progressCtx = useProgress(progress);
  const buttonCtx = useActionButton(buttonProps);

  return (
    <LayoutWrapper data-test-id={dataTestId}>
      <FullscreenProgressContext.Provider value={progressCtx}>
        <FullscreenButtonContext.Provider value={buttonCtx}>
          <HeaderFullscreen
            buttonAction={buttonCtx.buttonProps && buttonCtx.buttonProps.buttonAction}
            buttonText={buttonCtx.buttonProps && buttonCtx.buttonProps.buttonText}
          />
          <ProgressBarSimple className={styles.progress} progress={progressCtx.progress} />
          <Content {...contentProps}>{children}</Content>
        </FullscreenButtonContext.Provider>
      </FullscreenProgressContext.Provider>
    </LayoutWrapper>
  );
};

export {
  FullscreenProgressLayout,
  FullscreenProgressContext,
  calculateStepProgress,
  FullscreenButtonContext,
};
