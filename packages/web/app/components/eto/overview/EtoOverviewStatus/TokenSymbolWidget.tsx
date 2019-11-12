import * as React from "react";

import { ISrcSet } from "../../../shared/HiResImage";
import { TokenIcon } from "../../../shared/icons/TokenIcon";

import * as styles from "./TokenSymbolWidget.module.scss";

export interface ITokenSymbolWidgetProps {
  tokenImage: {
    srcSet: ISrcSet;
    alt: string;
  };
  brandName?: string;
  tokenName?: string;
  tokenSymbol?: string;
}

const TokenSymbolWidget: React.FunctionComponent<ITokenSymbolWidgetProps> = ({
  tokenSymbol,
  tokenName,
  tokenImage,
}) => (
  <div className={styles.tokenSymbolWidget}>
    <div className={styles.tokenImageWrapper}>
      <TokenIcon {...tokenImage} className={styles.tokenImage} />
    </div>
    <div>
      <h3 className={styles.tokenName}>
        {tokenName}
        {tokenSymbol && ` (${tokenSymbol})`}
      </h3>
    </div>
  </div>
);

export { TokenSymbolWidget };
