import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { FormDeprecated } from "../FormDeprecated";
import { FormField } from "./index";

storiesOf("forms/fields/Field", module)
  .add("default", () => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {() => (
        <FormDeprecated>
          <FormField label="Form field" name="value" />
        </FormDeprecated>
      )}
    </Formik>
  ))
  .add("with suffix", () => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {() => (
        <FormDeprecated>
          <FormField label="Form field" name="value" suffix="%" />
        </FormDeprecated>
      )}
    </Formik>
  ))
  .add("with prefix", () => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {() => (
        <FormDeprecated>
          <FormField label="Form field" name="value" prefix="@" />
        </FormDeprecated>
      )}
    </Formik>
  ))
  .add("disabled", () => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {() => (
        <FormDeprecated>
          <FormField label="Form field" name="value" disabled={true} />
        </FormDeprecated>
      )}
    </Formik>
  ));
