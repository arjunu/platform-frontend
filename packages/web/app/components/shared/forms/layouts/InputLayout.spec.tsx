import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { Input } from "reactstrap";
import { spy } from "sinon";

import { InputLayout } from "./InputLayout";

describe("FormFieldRaw TextInput", () => {
  it("should show value", () => {
    const component = shallow(
      <InputLayout
        name="foo"
        type="text"
        placeholder="test_placeholder"
        value="test_value"
        onChange={() => {}}
      />,
    );
    expect(component.find(Input).prop("value")).to.contain("test_value");
  });

  it("should show placeholder", () => {
    const component = shallow(
      <InputLayout name="foo" type="text" placeholder="test_placeholder" onChange={() => {}} />,
    );
    expect(component.find(Input).prop("placeholder")).to.contain("test_placeholder");
  });

  it("should run onFocus", () => {
    const focusSpy = spy();

    const component = shallow(
      <InputLayout name="foo" type="text" onFocus={focusSpy} onChange={() => {}} />,
    );

    component.find(Input).simulate("focus");

    expect(focusSpy).to.have.been.called;
  });

  it("should run onBlur", () => {
    const blurSpy = spy();

    const component = shallow(
      <InputLayout name="foo" type="text" onBlur={blurSpy} onChange={() => {}} />,
    );

    component.find(Input).simulate("blur");

    expect(blurSpy).to.have.been.called;
  });
});
