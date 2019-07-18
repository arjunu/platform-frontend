import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";

import { TDataTestId, TTranslatedString } from "../../types";
import { isExternalUrl } from "../../utils/StringUtils";
import { InlineIcon } from "./icons";
import { ExternalLink } from "./links/ExternalLink";

import * as styles from "./Tag.module.scss";

type TTheme = "dark" | "green" | "white" | "default" | "silver";
type TLayout = "ghost" | "ghost-bold" | "bold";

export enum ETagSize {
  SMALL = styles.small,
  TINY = styles.tiny,
}

export interface ITag {
  text: TTranslatedString;
  to?: string;
  layout?: TLayout;
  size?: ETagSize;
  theme?: TTheme;
  className?: string;
  onClick?: (e: any) => void;
  svgIcon?: string;
  placeSvgInEnd?: boolean;
  component?: React.ComponentType<any>;
  componentProps?: any;
  target?: string;
  dataTestId?: string;
}

interface ITagWithFallback {
  condition: any;
  to: string;
  textElement: TTranslatedString;
  innerClass?: string;
  onClick?: any;
  component?: React.ReactElement;
}

export const TagWithFallback = ({
  condition,
  to,
  textElement,
  innerClass,
  onClick,
  "data-test-id": dataTestId,
}: ITagWithFallback & TDataTestId) => {
  if (condition) {
    return (
      <Tag
        onClick={onClick}
        to={to}
        target="_blank"
        size={ETagSize.TINY}
        theme="green"
        layout="ghost"
        text={textElement}
        dataTestId={dataTestId}
        className={innerClass}
      />
    );
  } else {
    return (
      <Tag
        size={ETagSize.TINY}
        theme="silver"
        layout="ghost"
        text={textElement}
        className={innerClass}
      />
    );
  }
};

export const Tag: React.FunctionComponent<ITag> = ({
  text,
  to,
  layout,
  size,
  theme,
  className,
  onClick,
  svgIcon,
  placeSvgInEnd,
  component: Component,
  componentProps = {},
  target,
  dataTestId,
}) => {
  const classes = cn(styles.tag, layout, size, theme, className);

  const tagContent = (
    <>
      {!placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} />}
      {text}
      {placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} className="ml-2" />}
    </>
  );

  if (to) {
    return isExternalUrl(to) ? (
      <ExternalLink className={classes} href={to} data-test-id={dataTestId}>
        {tagContent}
      </ExternalLink>
    ) : (
      <Link to={to} className={classes} target={target} data-test-id={dataTestId}>
        {tagContent}
      </Link>
    );
  }

  if (Component) {
    return (
      <Component className={classes} {...componentProps}>
        {tagContent}
      </Component>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={cn(classes, styles.tagAsButton)}>
        {tagContent}
      </button>
    );
  }

  return <span className={classes}>{tagContent}</span>;
};
