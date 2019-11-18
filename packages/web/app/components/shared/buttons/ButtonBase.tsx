import * as cn from "classnames";
import * as React from "react";

import { TDataTestId } from "../../../types";
import { LoadingIndicator } from "../loading-indicator/LoadingIndicator";
import { ButtonReset } from "./ButtonReset";

import * as styles from "./ButtonBase.module.scss";

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

export { ButtonBase, EButtonWidth, EButtonSize, EButtonLayout };
