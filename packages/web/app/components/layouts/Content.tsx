import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";
import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";

import * as styles from "./Content.module.scss";

enum EContentWidth {
  FULL = "fullWidth",
  CONSTRAINED = "constrainedWidth",
  SMALL = "smallWidth",
}

type TExternalProps = {
  width?: EContentWidth;
};

const widthToClassName: Record<EContentWidth, string | undefined> = {
  [EContentWidth.FULL]: undefined,
  [EContentWidth.CONSTRAINED]: styles.constrainedWidth,
  [EContentWidth.SMALL]: styles.smallWidth,
};

const Content: React.FunctionComponent<CommonHtmlProps & TExternalProps> = ({
  children,
  className,
  width = EContentWidth.CONSTRAINED,
}) => (
  <div className={cn(styles.content, widthToClassName[width], className)}>
    <React.Suspense fallback={<LoadingIndicator />}>{children}</React.Suspense>
  </div>
);

export { Content, EContentWidth };
