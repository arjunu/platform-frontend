import { expect } from "chai";
import * as React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { spy } from "sinon";

import { createMount } from "../../../test/createMount";
import { createDummyStore } from "../../../test/fixtures";
import { onEnterAction } from "./OnEnterAction";

describe("onEnterAction", () => {
  const textNode = "SOME COMPONENT";
  const SomeComponent = () => <h1>{textNode}</h1>;

  it("should render child component", () => {
    const OnMountActionComponent = onEnterAction({ actionCreator: () => {} })(SomeComponent);

    const mountComponent = createMount(
      <ReduxProvider store={createDummyStore()}>
        <OnMountActionComponent />
      </ReduxProvider>,
    );

    expect(mountComponent.contains(textNode)).to.be.true;
  });

  it("should call action creator when mounted", () => {
    const store = createDummyStore();
    const props = { foo: "bar" };
    const actionCreator = spy();

    const OnMountActionComponent = onEnterAction({ actionCreator })(SomeComponent);

    createMount(
      <ReduxProvider store={store}>
        <OnMountActionComponent {...props} />
      </ReduxProvider>,
    );

    expect(actionCreator).to.be.calledWithExactly(store.dispatch, props);
  });
});
