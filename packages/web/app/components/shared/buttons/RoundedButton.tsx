import * as cn from "classnames";
import * as React from "react";

import { ButtonReset } from "./ButtonReset";

import * as styles from "./RoundedButton.module.scss";

const CircleButton: React.FunctionComponent<React.ComponentProps<typeof ButtonReset>> = ({
  children,
  className,
  ...props
}) => (
  <ButtonReset className={cn(className, styles.circleButton)} {...props}>
    {children}
  </ButtonReset>
);

const CircleButtonWarning: React.FunctionComponent<React.ComponentProps<typeof CircleButton>> = ({
  children,
  ...props
}) => (
  <CircleButton className={styles.buttonWarning} {...props}>
    {children}
  </CircleButton>
);

// tslint:disable-next-line:no-any-on-steroid
const CircleButtonIcon: React.FunctionComponent<any> = props => (
  <CircleButton className={cn(props.className, styles.buttonIcon)} {...props} />
);

export { CircleButton, CircleButtonIcon, CircleButtonWarning };
