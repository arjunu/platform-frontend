import * as React from "react";

interface ISrcSet {
  "1x": string;
  "2x"?: string;
  "3x"?: string;
}

interface IHiResImageProps {
  srcSet: ISrcSet;
  className?: string;
  alt?: string;
  title?: string;
}

const srcSetToString = (srcSet: ISrcSet) =>
  `${srcSet["1x"]} 1x,
    ${srcSet["2x"] && srcSet["2x"] + " 2x"},
    ${srcSet["3x"] && srcSet["3x"] + " 3x"}`;

const HiResImage: React.FunctionComponent<IHiResImageProps> = ({
  srcSet,
  className,
  alt,
  title,
}) => (
  <img
    src={srcSet["1x"]}
    srcSet={srcSetToString(srcSet)}
    className={className}
    alt={alt}
    title={title}
  />
);

export { HiResImage, ISrcSet, srcSetToString };
