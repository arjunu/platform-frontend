import * as cn from "classnames";
import * as React from "react";

import { HiResImage, ISrcSet } from "./HiResImage";
import { Proportion } from "./Proportion";

import * as styles from "./ResponsiveImage.module.scss";

type TTheme = "light" | "dark" | "transparent";

export enum EImageFit {
  COVER = styles.fitCover,
  CONTAIN = styles.fitContain,
}

interface IResponsiveImage {
  srcSet: ISrcSet;
  alt: string;
  theme?: TTheme;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  fit?: EImageFit;
}

const ResponsiveImage: React.FunctionComponent<IResponsiveImage> = ({
  alt,
  className,
  srcSet,
  height,
  width,
  theme,
  onClick,
  fit,
}) => (
  <Proportion
    width={width}
    height={height}
    className={cn(styles.responsiveImage, className, theme)}
    onClick={onClick}
  >
    {srcSet["1x"] && <HiResImage alt={alt} srcSet={srcSet} className={cn(styles.image, fit)} />}
  </Proportion>
);

ResponsiveImage.defaultProps = {
  theme: "dark",
  fit: EImageFit.CONTAIN,
};

export { ResponsiveImage, IResponsiveImage };
