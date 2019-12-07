import * as cn from "classnames";
import * as React from "react";

import * as styles from "./ButtonBase.module.scss";

/**
 * A base building block for all kind of buttons. Contains some styles reset and some default :focus-visible implementation
 */
const ButtonBase = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>(({ className, type = "button", ...rest }, ref) => (
  <button type={type} ref={ref} className={cn(styles.buttonBase, className)} {...rest} />
));

export { ButtonBase };
