import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { submit } from "../../../../../test/integrationTestUtils.unsafe";
import { tid } from "../../../../../test/testUtils";
import { FormFieldCheckbox, FormFieldCheckboxGroup } from "./FormFieldCheckboxGroup";
import { formWrapper } from "./testingUtils.unsafe";

describe("FormFieldCheckboxGroup", () => {
  it("should work", async () => {
    const submitFormHandler = spy();

    const Component = formWrapper(
      {},
      submitFormHandler,
    )(() => (
      <FormFieldCheckboxGroup name="checkboxes">
        <FormFieldCheckbox label="A" value="a" data-test-id="a" />
        <FormFieldCheckbox label="B" value="b" data-test-id="b" />
      </FormFieldCheckboxGroup>
    ));
    const component = mount(<Component />);

    const changeAndSubmit = async (id: string, value: boolean) => {
      component
        .find(tid(id))
        .last()
        .simulate("change", { target: { checked: value } });

      await submit(component);
    };

    await changeAndSubmit("a", true);

    expect(submitFormHandler).to.be.calledOnce;
    expect(submitFormHandler).to.be.calledWith({ checkboxes: ["a"] });

    await changeAndSubmit("b", true);
    expect(submitFormHandler).to.be.calledTwice;
    expect(submitFormHandler).to.be.calledWith({ checkboxes: ["a", "b"] });

    await changeAndSubmit("a", true);
    expect(submitFormHandler).to.be.calledThrice;
    expect(submitFormHandler).to.be.calledWith({ checkboxes: ["b"] });
  });

  it("should set default value", async () => {
    const submitFormHandler = spy();

    const Component = formWrapper(
      {},
      submitFormHandler,
    )(() => (
      <FormFieldCheckboxGroup name="checkboxes">
        <FormFieldCheckbox label="A" value="a" data-test-id="a" />
        <FormFieldCheckbox label="B" value="b" data-test-id="b" />
      </FormFieldCheckboxGroup>
    ));
    const component = mount(<Component />);

    await submit(component);

    expect(submitFormHandler).to.be.calledOnce;
    expect(submitFormHandler).to.be.calledWith({ checkboxes: [] });
  });
});
