import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Form } from "../Form";
import { FormFieldDate } from "./FormFieldDate";

storiesOf("forms/fields/FieldDate", module).add("default", () => (
  <Form initialValues={{}} onSubmit={() => {}}>
    {() => <FormFieldDate label="Date of birth" name="dob" />}
  </Form>
));
