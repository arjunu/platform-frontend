import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TDataTestId } from "../../../types";
import { InlineIcon } from "../icons";
import { LoadingIndicator } from "../loading-indicator";

import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./Button.module.scss";

export enum EButtonTheme {
  DARK_NO_BORDER = styles.buttonDarkNoBorder,
  DARK = styles.buttonDark,
  WHITE = styles.buttonWhite,
  BRAND = styles.buttonBrand,
  SILVER = styles.buttonSilver,
  GRAPHITE = styles.buttonGraphite,
  NEON = styles.buttonNeon,
  GREEN = styles.buttonGreen,
  BLUE = styles.buttonBlue,
}

export enum EIconPosition {
  ICON_BEFORE = "icon-before",
  ICON_AFTER = "icon-after",
}

export enum EButtonLayout {
  PRIMARY = styles.buttonPrimary,
  SECONDARY = styles.buttonSecondary,
  INLINE = styles.buttonInline,
  SIMPLE = styles.buttonSimple,
}

export enum ButtonSize {
  NORMAL,
  SMALL = styles.buttonSmall,
  HUGE = styles.buttonHuge,
}

export enum ButtonWidth {
  NORMAL = "",
  WIDE = "wide",
  BLOCK = "block",
  NO_PADDING = "no-padding",
}

export enum ButtonTextPosition {
  LEFT = "text-left",
  RIGHT = "text-right",
}

export type TGeneralButton = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface IButtonProps extends TGeneralButton, CommonHtmlProps {
  layout?: EButtonLayout;
  theme?: EButtonTheme;
  svgIcon?: string;
  iconPosition?: EIconPosition;
  size?: ButtonSize;
  width?: ButtonWidth;
  isLoading?: boolean;
  isActive?: boolean;
  innerClassName?: string;
  textPosition?: ButtonTextPosition;
  iconStyle?: string;
}

const Button: React.ForwardRefExoticComponent<
  { children?: React.ReactNode } & IButtonProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, IButtonProps & TDataTestId>(
  (
    {
      children,
      className,
      layout,
      theme,
      disabled,
      svgIcon,
      innerClassName,
      iconPosition,
      size,
      width,
      isLoading,
      type,
      textPosition,
      isActive,
      onClick,
      "data-test-id": dataTestId,
      iconStyle,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      data-test-id={dataTestId}
      className={cn(
        styles.button,
        className,
        layout,
        iconPosition,
        {
          [theme!]: layout !== EButtonLayout.INLINE,
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
      <div className={cn(styles.content, innerClassName, textPosition)} tabIndex={-1}>
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
            {iconPosition === EIconPosition.ICON_BEFORE && (
              <InlineIcon className={iconStyle} svgIcon={svgIcon || ""} />
            )}
            {children}
            {iconPosition === EIconPosition.ICON_AFTER && (
              <InlineIcon className={iconStyle} svgIcon={svgIcon || ""} />
            )}
          </>
        )}
      </div>
    </button>
  ),
);

Button.defaultProps = {
  layout: EButtonLayout.PRIMARY,
  theme: EButtonTheme.DARK,
  type: "button",
  disabled: false,
  size: ButtonSize.NORMAL,
  width: ButtonWidth.NORMAL,
};

const ButtonArrowRight: React.FunctionComponent<IButtonProps> = props => (
  <Button
    {...props}
    layout={EButtonLayout.SECONDARY}
    iconPosition={EIconPosition.ICON_AFTER}
    svgIcon={arrowRight}
  />
);

const ButtonArrowLeft: React.FunctionComponent<IButtonProps> = props => (
  <Button
    {...props}
    layout={EButtonLayout.SECONDARY}
    iconPosition={EIconPosition.ICON_BEFORE}
    svgIcon={arrowLeft}
  />
);

export { ButtonArrowRight, ButtonArrowLeft, Button };
