import * as cn from "classnames";
import * as React from "react";

import { OmitKeys, PartialByKeys, TTranslatedString } from "../../../types";
import { InlineIcon } from "../icons";
import { ButtonBase, EButtonLayout, EButtonSize, EButtonWidth } from "./ButtonBase";

import * as closeIcon from "../../../assets/img/inline_icons/close.svg";
import * as styles from "./ButtonIcon.module.scss";

type ButtonBaseProps = React.ComponentProps<typeof ButtonBase>;

type TButtonIconProps = {
  svgIcon: string;
  alt?: TTranslatedString;
} & PartialByKeys<ButtonBaseProps, "layout" | "size" | "width">;

const ButtonIcon = React.forwardRef<HTMLButtonElement, TButtonIconProps>(
  (
    {
      layout = EButtonLayout.OUTLINE,
      size = EButtonSize.NORMAL,
      width = EButtonWidth.NORMAL,
      className,
      svgIcon,
      alt,
      ...props
    },
    ref,
  ) => (
    <ButtonBase
      ref={ref}
      layout={layout}
      size={size}
      width={width}
      className={cn(styles.buttonIcon, className)}
      {...props}
    >
      <InlineIcon svgIcon={svgIcon} alt={alt} />
    </ButtonBase>
  ),
);

// TODO: Add story
const ButtonIconPlaceholder: React.FunctionComponent = () => (
  <div className={styles.buttonIconPlaceholder} />
);

// TODO: Add story
const ButtonClose: React.FunctionComponent<OmitKeys<TButtonIconProps, "svgIcon">> = props => (
  <ButtonIcon {...props} svgIcon={closeIcon} />
);

export { ButtonIcon, ButtonIconPlaceholder, ButtonClose };
