import * as React from "react";
import { compose, nest, withProps } from "recompose";

import { FullscreenButtonContext } from "../../components/layouts/FullscreenProgressLayout";
import { TTranslatedString } from "../../types";

type TWithHeaderButtonOptions = {
  buttonAction?: () => void;
  buttonText?: TTranslatedString;
};

type TComponentProps = {
  children: React.ReactElement;
};

const WithHeaderButton: React.FunctionComponent<TWithHeaderButtonOptions &
  TComponentProps> = props => {
  const { setCurrentButtonProps } = React.useContext(FullscreenButtonContext);

  React.useEffect(() => {
    setCurrentButtonProps(props.buttonText, props.buttonAction);
  }, [setCurrentButtonProps, props.buttonAction]);

  return props.children;
};

export const withHeaderButton = <P extends {}>(fn: (props: P) => TWithHeaderButtonOptions) => (
  wrappedComponent: React.ComponentType<P & TWithHeaderButtonOptions>,
) =>
  compose<P & TWithHeaderButtonOptions, P>(withProps<TWithHeaderButtonOptions, P>(fn))(
    nest(WithHeaderButton, wrappedComponent),
  );
