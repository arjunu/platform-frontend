import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";

import * as styles from "./List.module.scss";

type TProps = {
  items: React.ReactNodeArray;
};

// TODO: Refactor to general list component as now it only supports success mark
export const List: React.FunctionComponent<TProps & CommonHtmlProps> = ({ items, className }) => (
  <ul className={cn(styles.list, className)}>
    {items.map((item, i) => (
      <li key={i} className={cn(styles.item, styles.itemSuccess)}>
        {item}
      </li>
    ))}
  </ul>
);
