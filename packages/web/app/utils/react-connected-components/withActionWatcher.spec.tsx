import { safeDelay, setupFakeClock } from "@neufund/shared";
import { expect } from "chai";
import * as React from "react";
import { spy } from "sinon";

import { createMount } from "../../../test/createMount";
import { wrapWithProviders } from "../../../test/integrationTestUtils.unsafe";
import { withActionWatcher } from "./withActionWatcher.unsafe";

describe("withActionWatcher", () => {
  const SomeComponent = () => <h1>SOME COMPONENT</h1>;
  const clock = setupFakeClock();

  it("should render child component", () => {
    const WatchComponent = withActionWatcher({
      actionCreator: (dispatch: any) => dispatch({ type: "ACTION" }),
      interval: 1000,
    })(SomeComponent);

    const mountComponent = createMount(wrapWithProviders(WatchComponent));

    expect(mountComponent.contains(<SomeComponent />)).to.be.true;
  });

  it("should call action on initial render", () => {
    const actionCreator = spy((dispatch: any) => dispatch({ type: "ACTION" }));
    const WatchComponent = withActionWatcher({
      actionCreator,
      interval: 1000,
    })(SomeComponent);

    createMount(wrapWithProviders(WatchComponent));

    expect(actionCreator).to.be.calledOnce;
  });

  it("should call action again every interval", () => {
    const actionCreator = spy((dispatch: any) => dispatch({ type: "ACTION" }));
    const WatchComponent = withActionWatcher({
      actionCreator,
      interval: 1000,
    })(SomeComponent);

    createMount(wrapWithProviders(WatchComponent));

    expect(actionCreator).to.be.calledOnce;
    clock.fakeClock.tick(1000);
    expect(actionCreator).to.be.calledTwice;
    clock.fakeClock.tick(1000);
    expect(actionCreator).to.be.calledThrice;
  });

  it("should not call action again before it finished", async () => {
    const asyncActionCreator = spy(() => safeDelay(1000));
    const WatchComponent = withActionWatcher({
      actionCreator: asyncActionCreator,
      interval: 1000,
    })(SomeComponent);

    createMount(wrapWithProviders(WatchComponent));

    expect(asyncActionCreator).to.be.calledOnce;
    await clock.fakeClock.tickAsync(1000);
    expect(asyncActionCreator).to.be.calledTwice;

    // still called just twice
    await clock.fakeClock.tickAsync(1500);
    expect(asyncActionCreator).to.be.calledTwice;
  });

  it("should not call action when was unmounted", () => {
    const actionCreator = spy((dispatch: any) => dispatch({ type: "ACTION" }));
    const WatchComponent = withActionWatcher({
      actionCreator,
      interval: 1000,
    })(SomeComponent);

    const mountComponent = createMount(wrapWithProviders(WatchComponent));

    expect(actionCreator).to.be.calledOnce;
    mountComponent.unmount();
    clock.fakeClock.tick(1000);
    expect(actionCreator).to.be.calledOnce;
  });
});
