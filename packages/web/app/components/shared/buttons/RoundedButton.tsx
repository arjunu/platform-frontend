import * as cn from "classnames";
import * as React from "react";

import { TDataTestId } from "../../../types";
import { Button, EButtonLayout, EButtonTheme, EIconPosition, IButtonProps } from "./Button";
import { ButtonIcon } from "./ButtonIcon";

import * as upload from "../../../assets/img/inline_icons/cloud.svg";
import * as styles from "./RoundedButton.module.scss";

interface IUploadButton extends TDataTestId {
  isDisabled?: boolean;
}

const RoundedButton: React.ForwardRefExoticComponent<
  { children?: React.ReactNode } & IButtonProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, IButtonProps & TDataTestId>((props, ref) => (
  <Button {...props} ref={ref} className={cn(props.className, styles.rounded)}>
    {props.children}
  </Button>
));

const CircleButton: React.FunctionComponent<React.ComponentProps<typeof RoundedButton>> = ({
  children,
  className,
  ...props
}) => (
  <RoundedButton
    className={cn(className, styles.circleButton)}
    {...props}
    layout={EButtonLayout.SECONDARY}
  >
    {children}
  </RoundedButton>
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

const UploadButton: React.FunctionComponent<IUploadButton> = ({
  isDisabled,
  children,
  "data-test-id": dataTestId,
}) => (
  <RoundedButton
    disabled={isDisabled}
    layout={EButtonLayout.SECONDARY}
    theme={EButtonTheme.NEON}
    data-test-id={dataTestId}
    iconPosition={EIconPosition.ICON_BEFORE}
    svgIcon={upload}
    iconStyle={cn("inline-icon", styles.uploadIcon)}
  >
    {children}
  </RoundedButton>
);

export { RoundedButton, CircleButton, CircleButtonIcon, CircleButtonWarning, UploadButton };
