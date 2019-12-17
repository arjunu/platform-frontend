import { storiesOf } from "@storybook/react";
import * as React from "react";
import withFormik from "storybook-formik";

import { FormFieldCheckbox, FormFieldCheckboxGroup } from "./FormFieldCheckboxGroup";

storiesOf("forms/fields/FieldCheckboxGroup", module)
  .addDecorator(withFormik)
  .add(
    "with `dog` selected",
    () => (
      <FormFieldCheckboxGroup label="Checkbox group" name="animals">
        <FormFieldCheckbox value="dog" label="Dog" />
        <FormFieldCheckbox value="cat" label="Cat" />
      </FormFieldCheckboxGroup>
    ),
    {
      formik: {
        initialValues: { animals: ["dog"] },
      },
    },
  )
  .add(
    "without selected value",
    () => (
      <FormFieldCheckboxGroup label="Checkbox group" name="animals">
        <FormFieldCheckbox value="dog" label="Dog" />
        <FormFieldCheckbox value="cat" label="Cat" />
      </FormFieldCheckboxGroup>
    ),
    {
      formik: {
        initialValues: { animals: undefined },
      },
    },
  );
