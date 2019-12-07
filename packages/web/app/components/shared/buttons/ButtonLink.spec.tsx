import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { withMockStore } from "../../../utils/storeDecorator.unsafe";
import { Button, EButtonLayout } from "./Button";
import { ButtonLink } from "./ButtonLink";

describe("<ButtonLink />", () => {
  it("should pass isActive prop as true to Button when path matches", () => {
    const path = "/register";

    const { node } = withMockStore({
      router: {
        location: {
          pathname: path,
        },
      },
    })(<ButtonLink to={path} />);

    const layout = mount(node);
    const button = layout.find(Button);

    expect(button.prop("isActive")).to.be.true;
  });

  it("should pass isActive prop as false to Button when custom logic is used", () => {
    const path = "/register";

    const { node } = withMockStore({
      router: {
        location: {
          pathname: path,
        },
      },
    })(<ButtonLink to={path} isActive={false} />);

    const layout = mount(node);
    const button = layout.find(Button);

    expect(button.prop("isActive")).to.be.false;
  });

  it("should pass isActive prop as false to Button when path doesn't math", () => {
    const { node } = withMockStore({
      router: {
        location: {
          pathname: "/register",
        },
      },
    })(<ButtonLink to={"/login"} />);

    const layout = mount(node);
    const button = layout.find(Button);

    expect(button.prop("isActive")).to.be.false;
  });

  it("should pass props trough to Button", () => {
    const { node } = withMockStore({
      router: {
        location: {},
      },
    })(<ButtonLink to={"/login"} disabled={true} layout={EButtonLayout.PRIMARY} />);

    const layout = mount(node);
    const button = layout.find(Button);

    // should not pass "to" to underling component
    // as it can generate DOM errors
    expect(button.prop("to")).to.be.undefined;
    expect(button.prop("disabled")).to.be.true;
    expect(button.prop("layout")).to.equal(EButtonLayout.PRIMARY);
  });

  it("should open external url in new tab", () => {
    const { node, store } = withMockStore({
      router: {
        location: {
          pathname: "/register",
        },
      },
    })(<ButtonLink to={"https://neufund.org"} />);

    const button = mount(node);

    button.simulate("click");

    expect(store.getActions()).to.have.lengthOf(1);
    expect(store.getActions()).to.deep.include({
      type: "OPEN_IN_NEW_WINDOW",
      payload: { path: "https://neufund.org" },
    });
  });

  it("should open url in new tab when target is provided", () => {
    const { node, store } = withMockStore({
      router: {
        location: {
          pathname: "/register",
        },
      },
    })(<ButtonLink to={"/register"} target="_blank" />);

    const button = mount(node);

    button.simulate("click");

    expect(store.getActions()).to.have.lengthOf(1);
    expect(store.getActions()).to.deep.include({
      type: "OPEN_IN_NEW_WINDOW",
      payload: { path: "/register" },
    });
  });
});
