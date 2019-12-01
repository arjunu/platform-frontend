import * as React from "react";

import { TDataTestId } from "../../types";
import { Content } from "./Content";
import { HeaderFullscreen, THeaderFullscreenProps } from "./header/HeaderFullscreen";
import { TContentExternalProps } from "./Layout";
import { LayoutWrapper } from "./LayoutWrapper";

const FullscreenLayout: React.FunctionComponent<TDataTestId &
  TContentExternalProps &
  THeaderFullscreenProps> = ({
  children,
  "data-test-id": dataTestId,
  title,
  action,
  ...contentProps
}) => (
  <LayoutWrapper data-test-id={dataTestId}>
    <HeaderFullscreen action={action} title={title} />
    <Content {...contentProps}>{children}</Content>
  </LayoutWrapper>
);

export { FullscreenLayout };
