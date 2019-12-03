import * as cn from "classnames";
import * as React from "react";

import { ButtonBase } from "./ButtonBase";

import * as styles from "./ButtonInline.module.scss";

/**
 * An inline version of button used to replaced `a` tags in case we want to have `onClick` handler over `href`
 */
const ButtonInline = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof ButtonBase>>(
  ({ className, ...rest }, ref) => (
    <ButtonBase ref={ref} className={cn(styles.buttonInline, className)} {...rest} />
  ),
);

export { ButtonInline };
