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
      { checkboxes: ["a"] },
      submitFormHandler,
    )(() => (
      <FormFieldCheckboxGroup name="checkboxes">
        <FormFieldCheckbox label="A" value="a" data-test-id="a" />
        <FormFieldCheckbox label="B" value="b" data-test-id="b" />
      </FormFieldCheckboxGroup>
    ));

    const component = mount(<Component />);

    const changeAndSubmit = async (id: string, value: boolean) => {
      const element = component.find(tid(id)).find("input");

      element.simulate("change", {
        target: Object.assign(element.getDOMNode(), { checked: value }),
      });

      await submit(component);
    };

    await submit(component);

    expect(submitFormHandler).to.be.calledOnceWith({ checkboxes: ["a"] });

    submitFormHandler.resetHistory();

    await changeAndSubmit("b", true);
    expect(submitFormHandler).to.be.calledOnceWith({ checkboxes: ["a", "b"] });

    submitFormHandler.resetHistory();

    await changeAndSubmit("a", false);
    expect(submitFormHandler).to.be.calledOnceWith({ checkboxes: ["b"] });
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

    expect(submitFormHandler).to.be.calledOnceWith({ checkboxes: [] });
  });
});
