import * as React from "react";
import { Col, Row } from "reactstrap";

interface IBreadCrumbProps {
  path?: string[] | React.ReactNode[];
  view: string | React.ReactNode;
}

export const BreadCrumb: React.FunctionComponent<IBreadCrumbProps &
  React.HTMLAttributes<HTMLDivElement>> = ({ path, view, ...props }) => (
  <Row {...props}>
    <Col>
      {path !== undefined && path.length > 0 && (
        <>
          <span className="font-weight-bold" data-test-id="breadcrumb-path-first">
            {path[0]}
          </span>
          {path.length > 1 && (
            <span data-test-id="breadcrumb-path-rest">
              {path.slice(1).map((pathEntry, index) => (
                <span key={index}> / {pathEntry}</span>
              ))}
            </span>
          )}
          <span className="font-weight-bold"> &gt; </span>
        </>
      )}
      <span data-test-id="breadcrumb-view-name" className="font-weight-bold">
        {view}
      </span>
    </Col>
  </Row>
);
