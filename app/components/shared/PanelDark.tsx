import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import * as styles from "./PanelDark.module.scss";

interface IPanelDarkProps {
  headerText: string;
  rightComponent?: React.ReactNode;
}

export const PanelDark: React.SFC<IPanelDarkProps & React.HTMLAttributes<HTMLDivElement>> = ({
  headerText,
  rightComponent,
  className,
  children,
  ...props
}) => (
  <Row {...props} className={cn(styles.panel, className)}>
    <Col>
      <Row>
        <Col
          className={cn(
            styles.header,
            "d-flex flex-wrap justify-content-between align-items-center",
          )}
        >
          <span className={styles.headerText} data-test-id="panelDark-header-text">
            {headerText}
          </span>
          {rightComponent}
        </Col>
      </Row>
      <Row>
        <Col>{children}</Col>
      </Row>
    </Col>
  </Row>
);
