import * as cn from "classnames";
import * as React from "react";

import { Image } from "../Image";

import * as styles from "./TokenIcon.module.scss";

const TokenIcon: React.FunctionComponent<React.ComponentProps<typeof Image>> = ({
  className,
  ...props
}) => <Image {...props} className={cn(styles.tokenIcon, className)} />;

export { TokenIcon };
