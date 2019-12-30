import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Form } from "../Form";
import { FormField } from "./index";

storiesOf("forms/fields/Field", module)
  .add("default", () => (
    <Form initialValues={{}} onSubmit={() => {}}>
      {() => <FormField label="Form field" name="value" />}
    </Form>
  ))
  .add("with suffix", () => (
    <Form initialValues={{}} onSubmit={() => {}}>
      {() => <FormField label="Form field" name="value" suffix="%" />}
    </Form>
  ))
  .add("with prefix", () => (
    <Form initialValues={{}} onSubmit={() => {}}>
      {() => <FormField label="Form field" name="value" prefix="@" />}
    </Form>
  ))
  .add("disabled", () => (
    <Form initialValues={{}} onSubmit={() => {}}>
      {() => <FormField label="Form field" name="value" disabled={true} />}
    </Form>
  ));
