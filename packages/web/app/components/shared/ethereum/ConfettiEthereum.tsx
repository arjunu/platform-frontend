import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { Confetti, EConfettiSize } from "../Confetti";
import { EEthereumIconSize, EthereumIcon } from "./EthereumIcon";

export const ConfettiEthereum: React.FunctionComponent<CommonHtmlProps &
  React.ComponentProps<typeof EthereumIcon>> = ({ className, style, ...props }) => (
  <Confetti
    className={className}
    style={style}
    size={props.size === EEthereumIconSize.SMALL ? EConfettiSize.SMALL : undefined}
  >
    <EthereumIcon {...props} />
  </Confetti>
);
