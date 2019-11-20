import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TDataTestId } from "../../types";

import * as styles from "./Container.module.scss";

export enum EContainerType {
  INHERIT_GRID = "inherit_grid",
  GRID = "grid",
  CONTAINER = "container",
}

export enum EColumnSpan {
  ONE_COL = 1,
  ONE_AND_HALF_COL,
  TWO_COL,
  THREE_COL,
}

export const resolveColumnSpan = (span: EColumnSpan = EColumnSpan.ONE_COL) => {
  switch (span) {
    case EColumnSpan.ONE_AND_HALF_COL:
      return styles.span3;
    case EColumnSpan.TWO_COL:
      return styles.span4;
    case EColumnSpan.THREE_COL:
      return styles.span6;
    case EColumnSpan.ONE_COL:
    default:
      return styles.span2;
  }
};

const resolveGrid = (columnSpan: EColumnSpan) => {
  switch (columnSpan) {
    case EColumnSpan.ONE_COL:
      return styles.grid2;

    case EColumnSpan.ONE_AND_HALF_COL:
      return styles.grid3;

    case EColumnSpan.TWO_COL:
      return styles.grid4;

    case EColumnSpan.THREE_COL:
    default:
      return styles.grid6;
  }
};

const resolveContainerType = (type: EContainerType, columnSpan: EColumnSpan) => {
  switch (type) {
    case EContainerType.INHERIT_GRID:
      return resolveGrid(columnSpan);
    case EContainerType.GRID:
      return styles.basicGrid;
    case EContainerType.CONTAINER:
    default:
      return null;
  }
};

export interface IContainerProps {
  columnSpan?: EColumnSpan;
  type?: EContainerType;
  id?: string;
}

const Container: React.FunctionComponent<IContainerProps & CommonHtmlProps & TDataTestId> = ({
  className,
  children,
  columnSpan = EColumnSpan.THREE_COL,
  type = EContainerType.GRID,
  "data-test-id": dataTestId,
  id,
}) => (
  <section
    className={cn(
      styles.container,
      resolveContainerType(type, columnSpan),
      resolveColumnSpan(columnSpan),
      className,
    )}
    data-test-id={dataTestId}
    id={id}
  >
    {children}
  </section>
);

export { Container };
