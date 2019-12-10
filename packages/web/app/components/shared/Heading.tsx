import { invariant } from "@neufund/shared"
import * as cn from "classnames";
import { isString } from "lodash";
import * as React from "react";

import { CommonHtmlProps, TDataTestId, TTranslatedString } from "../../types";

import * as styles from "./Heading.module.scss";

export enum EHeadingSize {
  SMALL = styles.sizeSmall,
  MEDIUM = styles.sizeMedium,
  HUGE = styles.sizeHuge,
}

interface IProps {
  id?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  titleClassName?: string;
  description?: TTranslatedString;
  decorator?: boolean | string;
  size?: EHeadingSize;
  disableTransform?: boolean;
  inheritFont?: boolean;
}

export const Heading: React.FunctionComponent<IProps & TDataTestId & CommonHtmlProps> = ({
  id,
  level,
  children,
  className,
  titleClassName,
  decorator,
  description,
  size,
  "data-test-id": dataTestId,
  disableTransform,
  inheritFont,
}) => {
  invariant(
    !isString(decorator) || !description,
    "Svg icon and description at the same time are not supported",
  );
  return (
    <header
      id={id}
      data-test-id={dataTestId}
      className={cn(styles.headingWrapper, size, className, {
        [styles.hasDecorator]: decorator === true,
      })}
    >
      {/* To dynamically create heading tag need to manually use `React.createElement` */}
      {React.createElement(
        `h${level}`,
        {
          className: cn(styles.heading, titleClassName, {
            [styles.hasIcon]: isString(decorator),
            [styles.disableTransform]: disableTransform,
            [styles.inheritFont]: inheritFont,
          }),
        },
        isString(decorator) &&
          React.createElement("img", {
            className: styles.icon,
            src: decorator,
            alt: "",
          }),
        children,
      )}
      {description && <p className={cn(styles.description)}>{description}</p>}
    </header>
  );
};

Heading.defaultProps = {
  decorator: true,
};
