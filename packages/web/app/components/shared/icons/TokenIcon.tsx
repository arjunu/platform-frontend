import * as cn from "classnames";
import * as React from "react";

import { HiResImage } from "../HiResImage";

import * as styles from "./TokenIcon.module.scss";

const TokenIcon: React.FunctionComponent<React.ComponentProps<typeof HiResImage>> = ({
  className,
  ...props
}) => <HiResImage {...props} className={cn(styles.tokenIcon, className)} />;

export { TokenIcon };
