import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { tid } from "../../../../test/testUtils";
import { ENotificationText, ENotificationType } from "../../../modules/notifications/types";
import { Notification } from "./Notification";

describe("<Notification />", () => {
  it("should call correct click handler for notification content", () => {
    const props = {
      type: ENotificationType.WARNING,
      text: ENotificationText.COMPLETE_REQUEST_NOTIFICATION,
      onClick: spy(),
    };

    const component = shallow(<Notification {...props} />);

    component.find(tid("notification-button")).simulate("click");

    expect(props.onClick).to.be.calledOnce;
  });

  it("should call correct click handler for close button", () => {
    const props = {
      type: ENotificationType.INFO,
      text: ENotificationText.COMPLETE_UPDATE_ACCOUNT,
      onClick: spy(),
    };

    const component = shallow(<Notification {...props} />);

    component.find(tid("notification-close")).simulate("click");

    expect(props.onClick).to.be.calledOnce;
  });
});
