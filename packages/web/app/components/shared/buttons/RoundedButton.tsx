import * as cn from "classnames";
import * as React from "react";

import { ButtonBase } from "./ButtonBase";
import { ButtonIcon } from "./ButtonIcon";

import * as styles from "./RoundedButton.module.scss";

const CircleButton: React.FunctionComponent<React.ComponentProps<typeof ButtonBase>> = ({
  children,
  className,
  ...props
}) => (
  <ButtonBase className={cn(className, styles.circleButton)} {...props}>
    {children}
  </ButtonBase>
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
