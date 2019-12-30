import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Form } from "../Form";
import { FormFieldColorful } from "./FormFieldColorful";

storiesOf("forms/fields/FormFieldColorful", module)
  .add("default", () => (
    <Form initialValues={{}} onSubmit={() => {}}>
      {() => <FormFieldColorful placeholder="Form field colorful" name="value" />}
    </Form>
  ))
  .add("with Avatar", () => (
    <Form
      initialValues={{
        value: "Lorem ipsum",
      }}
      onSubmit={() => {}}
    >
      {() => <FormFieldColorful placeholder="Form field colorful" name="value" showAvatar={true} />}
    </Form>
  ));
