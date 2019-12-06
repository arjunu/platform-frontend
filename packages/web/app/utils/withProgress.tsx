import * as React from "react";
import { compose, nest, withProps } from "recompose";

import {
  calculateStepProgress,
  FullscreenProgressContext,
} from "../components/layouts/FullscreenProgressLayout";

type TWithProgressOptions = {
  step: number;
  allSteps: number;
};

type TComponentProps = {
  children: React.ReactElement;
};

const WithProgress: React.FunctionComponent<TWithProgressOptions & TComponentProps> = props => {
  const { setCurrentProgress } = React.useContext(FullscreenProgressContext);

  React.useEffect(() => {
    setCurrentProgress(calculateStepProgress(props.step, props.allSteps));
  }, [setCurrentProgress]);

  return props.children;
};

export const withProgress = <P extends {}>(fn: (props: P) => TWithProgressOptions) => (
  wrappedComponent: React.ComponentType<P & TWithProgressOptions>,
) =>
  compose<P & TWithProgressOptions, P>(withProps<TWithProgressOptions, P>(fn))(
    nest(WithProgress, wrappedComponent),
  );
