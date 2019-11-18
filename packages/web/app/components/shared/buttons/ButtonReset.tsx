import * as cn from "classnames";
import * as React from "react";

import * as styles from "./ButtonReset.module.scss";

// TODO: Add focus visible
/**
 * A base building block for all kind of buttons. Contains some styles reset and some default :focus-visible implementation
 */
const ButtonReset = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>(({ className, ...rest }, ref) => (
  <button ref={ref} className={cn(styles.buttonBase, className)} {...rest} />
));

export { ButtonReset };
