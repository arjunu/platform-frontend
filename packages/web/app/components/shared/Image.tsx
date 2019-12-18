import * as cn from "classnames";
import * as React from "react";

import * as styles from "./Image.module.scss";

interface ISrcSet {
  "1x": string;
  "2x"?: string;
  "3x"?: string;
}

interface IHiResImageProps {
  alt: string;
  className?: string;
  height?: number;
  srcSet: ISrcSet;
  title?: string;
  width?: number;
}

const srcSetToString = (srcSet: ISrcSet) =>
  `${srcSet["1x"]} 1x,
    ${srcSet["2x"] && srcSet["2x"] + " 2x"},
    ${srcSet["3x"] && srcSet["3x"] + " 3x"}`;

/**
 * `img` wrapper with some useful defaults
 *  - alt is required
 *  - src is set automatically from `srcSet["1x"]
 *  - jank-free image loading when width and height are set with proper aspect ratio
 */
const Image: React.FunctionComponent<IHiResImageProps> = ({ srcSet, className, ...rest }) => (
  <img
    src={srcSet["1x"]}
    srcSet={srcSetToString(srcSet)}
    className={cn(className, styles.image)}
    {...rest}
  />
);

export { Image, ISrcSet };
