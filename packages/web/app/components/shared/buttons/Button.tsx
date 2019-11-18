import * as cn from "classnames";
import * as React from "react";

import { OmitKeys, PartialByKeys } from "../../../types";
import { InlineIcon } from "../icons";
import { ButtonBase, EButtonLayout, EButtonSize, EButtonWidth } from "./ButtonBase";

import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./Button.module.scss";

export enum EIconPosition {
  ICON_BEFORE = "icon-before",
  ICON_AFTER = "icon-after",
}

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
      children,
      svgIcon,
      iconPosition,
      iconProps = {},
      ...props
    },
    ref,
  ) => (
    <ButtonBase ref={ref} layout={layout} size={size} width={width} {...props}>
      {svgIcon && iconPosition === EIconPosition.ICON_BEFORE && (
        <InlineIcon
          {...iconProps}
          className={cn(styles.icon, styles.iconBefore, iconProps.className)}
          svgIcon={svgIcon}
        />
      )}

      {children}

      {svgIcon && iconPosition === EIconPosition.ICON_AFTER && (
        <InlineIcon
          {...iconProps}
          className={cn(styles.icon, styles.iconAfter, iconProps.className)}
          svgIcon={svgIcon}
        />
      )}
    </ButtonBase>
  ),
);

// TODO: Narrow props to remove svgIcon and iconPosition

const ButtonArrowRight: React.FunctionComponent<React.ComponentProps<typeof Button>> = props => (
  <Button
    {...props}
    layout={EButtonLayout.GHOST}
    iconPosition={EIconPosition.ICON_AFTER}
    svgIcon={arrowRight}
  />
);

const ButtonArrowLeft: React.FunctionComponent<React.ComponentProps<typeof Button>> = props => (
  <Button
    {...props}
    layout={EButtonLayout.GHOST}
    iconPosition={EIconPosition.ICON_BEFORE}
    svgIcon={arrowLeft}
  />
);

export { ButtonArrowRight, ButtonArrowLeft, Button, EButtonLayout, EButtonSize, EButtonWidth };
