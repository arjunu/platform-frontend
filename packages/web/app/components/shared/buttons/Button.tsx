import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, OmitKeys, TDataTestId } from "../../../types";
import { InlineIcon } from "../icons";
import { LoadingIndicator } from "../loading-indicator";
import { ButtonBase } from "./ButtonBase";

import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./Button.module.scss";

export enum EIconPosition {
  ICON_BEFORE = "icon-before",
  ICON_AFTER = "icon-after",
}

export enum EButtonLayout {
  PRIMARY = styles.buttonPrimary,
  OUTLINE = styles.buttonOutline,
  SECONDARY = styles.buttonSecondary,
  GHOST = styles.buttonGhost,
}

export enum EButtonSize {
  NORMAL,
  SMALL = styles.buttonSmall,
  HUGE = styles.buttonHuge,
}

export enum EButtonWidth {
  NORMAL = "",
  BLOCK = "block",
  NO_PADDING = "no-padding",
}

export type TGeneralButton = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface IButtonProps extends TGeneralButton, CommonHtmlProps {
  layout?: EButtonLayout;
  svgIcon?: string;
  iconPosition?: EIconPosition;
  iconProps?: OmitKeys<React.ComponentProps<typeof InlineIcon>, "svgIcon">;
  size?: EButtonSize;
  width?: EButtonWidth;
  isLoading?: boolean;
  isActive?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps & TDataTestId>(
  (
    {
      children,
      className,
      layout,
      disabled,
      svgIcon,
      iconPosition,
      iconProps = {},
      size,
      width,
      isLoading,
      type,
      isActive,
      onClick,
      "data-test-id": dataTestId,
      ...props
    },
    ref,
  ) => (
    <ButtonBase
      ref={ref}
      data-test-id={dataTestId}
      className={cn(
        styles.button,
        className,
        layout,
        iconPosition,
        {
          [styles.isActive]: isActive,
        },
        size,
        width,
      )}
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          {/*
              &nbsp; makes button the same in height as normal button
              (avoids height dumping after switching to loading state)
            */}
          &nbsp;
          <LoadingIndicator light />
          &nbsp;
        </>
      ) : (
        <>
          {svgIcon && iconPosition === EIconPosition.ICON_BEFORE && (
            <InlineIcon {...iconProps} svgIcon={svgIcon} />
          )}
          {children}
          {svgIcon && iconPosition === EIconPosition.ICON_AFTER && (
            <InlineIcon {...iconProps} svgIcon={svgIcon} />
          )}
        </>
      )}
    </ButtonBase>
  ),
);

Button.defaultProps = {
  layout: EButtonLayout.OUTLINE,
  type: "button",
  disabled: false,
  size: EButtonSize.NORMAL,
  width: EButtonWidth.NORMAL,
};

const ButtonArrowRight: React.FunctionComponent<IButtonProps> = props => (
  <Button
    {...props}
    layout={EButtonLayout.GHOST}
    iconPosition={EIconPosition.ICON_AFTER}
    svgIcon={arrowRight}
  />
);

const ButtonArrowLeft: React.FunctionComponent<IButtonProps> = props => (
  <Button
    {...props}
    layout={EButtonLayout.GHOST}
    iconPosition={EIconPosition.ICON_BEFORE}
    svgIcon={arrowLeft}
  />
);

export { ButtonArrowRight, ButtonArrowLeft, Button };
