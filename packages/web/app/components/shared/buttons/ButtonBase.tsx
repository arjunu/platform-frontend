import * as cn from "classnames";
import * as React from "react";

import * as styles from "./ButtonBase.module.scss";

// TODO: Add focus visible
const ButtonBase = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>(({ className, ...rest }, ref) => (
  <button ref={ref} className={cn(styles.buttonBase, className)} {...rest} />
));

export { ButtonBase };
