import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../../../types";

import * as styles from "./Info.module.scss";

type TExternalProps = {
  upperText: TTranslatedString;
  lowerText: TTranslatedString;
};

const Info: React.FunctionComponent = ({ children }) => <p className={styles.info}>{children}</p>;

const GreenInfo: React.FunctionComponent<TExternalProps> = ({ upperText, lowerText }) => (
  <div className={styles.greenInfo}>
    <p className={cn(styles.greenInfoText)}>{upperText}</p>
    <p className="mb-0">{lowerText}</p>
  </div>
);

const GreyInfo: React.FunctionComponent<TExternalProps> = ({ upperText, lowerText }) => (
  <div className={styles.greyInfo}>
    <p className={cn(styles.greyInfoText)}>{upperText}</p>
    <p className="mb-0">{lowerText}</p>
  </div>
);

export { GreenInfo, GreyInfo, Info };
