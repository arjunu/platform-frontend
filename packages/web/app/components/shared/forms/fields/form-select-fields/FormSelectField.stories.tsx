import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "../testingUtils.unsafe";
import { FormSelectField } from "./FormSelectField";

const defaultValues = {
  foo: "Foo",
  bar: "Bar",
};
storiesOf("forms/fields/SelectField", module)
  .add(
    "default",
    formWrapper({ name: "foo " })(() => <FormSelectField name="name" values={defaultValues} />),
  )
  .add(
    "disabled",
    formWrapper({ name: "foo " })(() => (
      <FormSelectField name="name" values={defaultValues} disabled={true} />
    )),
  )
  .add(
    "with custom options",
    formWrapper({ name: 1.5 })(() => (
      <FormSelectField
        name="name"
        customOptions={[0, 0.5, 1, 1.5].map(n => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      />
    )),
  );
