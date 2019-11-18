import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../../types";

import * as styles from "./InlineIcon.module.scss";

export enum EInlineIconFill {
  FILL_OUTLINE = styles.inlineIconFillOutline,
  FILL_SHAPE = styles.inlineIconFillShape,
}

interface IProps {
  svgIcon: string;
  fill?: EInlineIconFill;
  width?: string;
  height?: string;
  className?: string;
  onClick?: () => void;
  alt?: TTranslatedString;
}

export const InlineIcon: React.FunctionComponent<IProps> = ({
  fill = EInlineIconFill.FILL_SHAPE,
  className = cn("inline-icon", styles.inlineIcon, fill),
  svgIcon,
  width,
  height,
  alt,
  ...props
}) => (
  <>
    <span
      className={className}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: svgIcon }}
      {...props}
    />
    {alt && <span className="sr-only">{alt}</span>}
  </>
);
