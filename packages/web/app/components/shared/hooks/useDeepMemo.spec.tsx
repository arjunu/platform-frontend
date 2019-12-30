import { expect } from "chai";
import { mount } from "enzyme";
import { cloneDeep } from "lodash";
import * as React from "react";

import { useDeepMemo } from "./useDeepMemo";

type TExternalProps = {
  value: any;
};

const TestComponent: React.FunctionComponent<TExternalProps> = ({ value }) => {
  const valueMemoized = useDeepMemo(() => value, [value]);

  if (valueMemoized === value) {
    return <>equal by reference</>;
  }

  return <>not equal by reference</>;
};

describe("useDeepMemo", () => {
  it("should keep previous reference when value is deep equal", async () => {
    const value = { foo: "bar", baz: ["quiz"] };

    const wrapper = mount(<TestComponent value={value} />);

    expect(wrapper.text()).to.equal("equal by reference");

    wrapper.setProps({ value: cloneDeep(value) });

    expect(wrapper.text()).to.equal("not equal by reference");
  });
});
