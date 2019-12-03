import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { OmitKeys } from "../../../types";
import { Button, EButtonLayout, EButtonWidth, EIconPosition } from "./Button";

import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as closeIcon from "../../../assets/img/inline_icons/close.svg";

type TButtonProps = React.ComponentProps<typeof Button>;

type TButtonArrowProps = OmitKeys<TButtonProps, "svgIcon" | "iconPosition">;

const ButtonArrowRight: React.FunctionComponent<TButtonArrowProps> = props => (
  <Button
    {...props}
    layout={EButtonLayout.GHOST}
    iconPosition={EIconPosition.ICON_AFTER}
    svgIcon={arrowRight}
  />
);

const ButtonArrowLeft: React.FunctionComponent<TButtonArrowProps> = props => (
  <Button
    {...props}
    layout={EButtonLayout.GHOST}
    iconPosition={EIconPosition.ICON_BEFORE}
    svgIcon={arrowLeft}
  />
);

const ButtonClose: React.FunctionComponent<OmitKeys<TButtonProps, "svgIcon">> = ({
  iconProps = {},
  ...props
}) => (
  <Button
    layout={EButtonLayout.GHOST}
    width={EButtonWidth.NO_PADDING}
    svgIcon={closeIcon}
    iconProps={{ alt: <FormattedMessage id="common.close" />, ...iconProps }}
    {...props}
  />
);

export { ButtonClose, ButtonArrowRight, ButtonArrowLeft };
