import * as cn from "classnames";
import * as React from "react";

import { ButtonIcon } from "./ButtonIcon";
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

const CircleButtonIcon: React.FunctionComponent<
  React.ComponentProps<typeof ButtonIcon>
> = props => <ButtonIcon className={cn(props.className, styles.buttonIcon)} {...props} />;

export { CircleButton, CircleButtonIcon, CircleButtonWarning };
