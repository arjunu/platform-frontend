import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { FormDeprecated } from "../FormDeprecated";
import { FormFieldColorful } from "./FormFieldColorful";

storiesOf("forms/fields/FormFieldColorful", module)
  .add("default", () => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {() => (
        <FormDeprecated>
          <FormFieldColorful placeholder="Form field colorful" name="value" />
        </FormDeprecated>
      )}
    </Formik>
  ))
  .add("with Avatar", () => (
    <Formik
      initialValues={{
        value: "Lorem ipsum",
      }}
      onSubmit={() => {}}
    >
      {() => (
        <FormDeprecated>
          <FormFieldColorful placeholder="Form field colorful" name="value" showAvatar={true} />
        </FormDeprecated>
      )}
    </Formik>
  ));
