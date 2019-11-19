import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { OmitKeys } from "../../../types";
import { Button, EButtonLayout, EButtonWidth } from "./Button";

import * as closeIcon from "../../../assets/img/inline_icons/close.svg";

type TButtonProps = React.ComponentProps<typeof Button>;

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

export { ButtonClose };
