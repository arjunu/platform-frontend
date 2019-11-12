import * as cn from "classnames";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../../../types";

import * as styles from "./Point.module.scss";

interface IDatePointProps {
  start?: number;
  date?: number | string;
  text?: TTranslatedString;
}

interface IPointerProps {
  position?: number;
}

const DatePoint: React.FunctionComponent<IDatePointProps> = ({ date, text }) => (
  <g transform="translate(-33 -9)">
    {date && (
      <text className={cn(date > Date.now() && styles.datePast, styles.date)}>
        <tspan x="12" y="50">
          <FormattedDate value={date} />
        </tspan>
      </text>
    )}
    {text && (
      <text className={styles.pointerLabel}>
        <tspan x="33" y="-2" textAnchor="middle">
          {text}
        </tspan>
      </text>
    )}
    <rect className={text ? styles.datePoint : styles.datePointShort} />
  </g>
);

const Pointer: React.FunctionComponent<IPointerProps> = ({ position }) => (
  <g transform={`translate(${position})`}>
    <path
      className={styles.pointer}
      d={`M26.5,25 C28.1568543,25 29.5,23.6568543 29.5,22 C29.5,20.3431457 28.1568543,19 26.5,19 C24.8431457,19 23.5,20.3431457 23.5,22 C23.5,23.6568543 24.8431457,25 26.5,25 Z M26,25.9690531 C24.0268442,25.7230041 22.5,24.0398088 22.5,22 C22.5,19.790861 24.290861,18 26.5,18 C28.709139,18 30.5,19.790861 30.5,22 C30.5,24.0398088 28.9731558,25.7230041 27,25.9690531 L27,79 L26,79 L26,25.9690531 Z`}
    />
    <text className={styles.pointerLabel}>
      <tspan x="14" y="12">
        <FormattedMessage id="shared-component.eto-timeline.now" />
      </tspan>
    </text>
  </g>
);

export { Pointer, DatePoint };
