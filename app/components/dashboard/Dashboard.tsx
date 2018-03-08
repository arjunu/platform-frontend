import * as React from "react";
import { Col, Row } from "reactstrap";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { MessageSignModal } from "../modals/SignMessageModal";
import { MyPortfolio } from "./myPortfolio/MyPortoflioWidger";
import { NotificationWidget } from "./notification-widget/NotificationWidget";
import { UserInfo } from "./UserInfo";

export const Dashboard = () => (
  <LayoutAuthorized>
    <NotificationWidget />
    <MessageSignModal />
    <Row className="p-3">
      <Col md={9}>
        <MyPortfolio />
      </Col>
    </Row>
    <br />
    <br />
    <br />
    <br />
    <UserInfo />
  </LayoutAuthorized>
);
