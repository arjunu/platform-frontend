import * as cn from "classnames";
import * as React from "react";

import { OmitKeys, PartialByKeys, TDataTestId } from "../../../types";
import { invariant } from "../../../utils/invariant";
import { InlineIcon } from "../icons";
import { LoadingIndicator } from "../loading-indicator/LoadingIndicator";
import { ButtonReset } from "./ButtonReset";

import * as styles from "./Button.module.scss";

enum EIconPosition {
  ICON_BEFORE = "icon-before",
  ICON_AFTER = "icon-after",
}

enum EButtonLayout {
  PRIMARY = styles.buttonPrimary,
  OUTLINE = styles.buttonOutline,
  SECONDARY = styles.buttonSecondary,
  GHOST = styles.buttonGhost,
}

enum EButtonSize {
  NORMAL,
  SMALL = styles.buttonSmall,
  HUGE = styles.buttonHuge,
}

enum EButtonWidth {
  NORMAL = "",
  BLOCK = "block",
  // TODO: Remove no-padding
  NO_PADDING = "no-padding",
}

type TButtonLayout = {
  layout: EButtonLayout;
  size: EButtonSize;
  width: EButtonWidth;
  isLoading?: boolean;
  isActive?: boolean;
};

const ButtonBase = React.forwardRef<
  HTMLButtonElement,
  TButtonLayout & React.ComponentProps<typeof ButtonReset> & TDataTestId
>(
  (
    {
      children,
      className,
      layout,
      disabled,
      size,
      width,
      isLoading,
      type = "button",
      isActive,
      ...props
    },
    ref,
  ) => (
    <ButtonReset
      ref={ref}
      className={cn(
        styles.button,
        className,
        layout,
        {
          [styles.isActive]: isActive,
        },
        size,
        width,
      )}
      disabled={disabled || isLoading}
      type={type}
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
        children
      )}
    </ButtonReset>
  ),
);

type ButtonBaseProps = React.ComponentProps<typeof ButtonBase>;

type TButtonProps = {
  svgIcon?: string;
  iconPosition?: EIconPosition;
  iconProps?: OmitKeys<React.ComponentProps<typeof InlineIcon>, "svgIcon">;
} & PartialByKeys<ButtonBaseProps, "layout" | "size" | "width">;

const Button = React.forwardRef<HTMLButtonElement, TButtonProps>(
  (
    {
      layout = EButtonLayout.OUTLINE,
      size = EButtonSize.NORMAL,
      width = EButtonWidth.NORMAL,
      className,
      children,
      svgIcon,
      iconPosition,
      iconProps = {},
      ...props
    },
    ref,
  ) => {
    const withIconOnly = children === undefined;

    if (process.env.NODE_ENV === "development") {
      invariant(
        !(svgIcon === undefined && withIconOnly),
        "Either `svgIcon` or `children` should be provided to a button",
      );
      invariant(
        !(withIconOnly && iconProps.alt === undefined),
        "For proper accessibility in case button contains only icon `iconProps.alt` should be provided",
      );
    }

    return (
      <ButtonBase
        ref={ref}
        layout={layout}
        size={size}
        width={width}
        className={cn(className, { [styles.buttonOnlyIcon]: withIconOnly })}
        {...props}
      >
        {!withIconOnly && svgIcon && iconPosition === EIconPosition.ICON_BEFORE && (
          <InlineIcon
            {...iconProps}
            className={cn(styles.buttonIcon, styles.buttonIconBefore, iconProps.className)}
            svgIcon={svgIcon}
          />
        )}

        {withIconOnly && svgIcon ? (
          <>
            {/*
                &nbsp; makes button the same in height as normal button
                (avoids height dumping after switching to loading state)
              */}
            &nbsp;
            <InlineIcon
              {...iconProps}
              className={cn(styles.buttonIcon, iconProps.className)}
              svgIcon={svgIcon}
            />
            &nbsp;
          </>
        ) : (
          children
        )}

        {!withIconOnly && svgIcon && iconPosition === EIconPosition.ICON_AFTER && (
          <InlineIcon
            {...iconProps}
            className={cn(styles.buttonIcon, styles.buttonIconAfter, iconProps.className)}
            svgIcon={svgIcon}
          />
        )}
      </ButtonBase>
    );
  },
);

export { Button, EButtonLayout, EButtonSize, EButtonWidth, EIconPosition };
