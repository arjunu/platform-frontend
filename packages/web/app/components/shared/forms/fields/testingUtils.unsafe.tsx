import * as React from "react";

import { Form } from "../Form";

/**
 * Use only for testing.
 */
export const formWrapper = (formState: any, onSubmit: (values: any) => any = () => {}) => (
  Component: React.FunctionComponent,
) => () => (
  <Form initialValues={formState} onSubmit={async values => await onSubmit(values)}>
    {({ submitForm, values, submitCount, isSubmitting }) => {
      if (process.env.STORYBOOK_RUN === "1") {
        // tslint:disable-next-line
        console.log(JSON.stringify(values));
      }

      return (
        <>
          <Component />

          {onSubmit && (
            <button type="submit" data-test-id="test-form-submit" onClick={submitForm}>
              Submit
            </button>
          )}

          {
            <>
              Submit count: <span data-test-id="test-form-submit-count">{submitCount}</span>
              Is submitting:{" "}
              <span data-test-id="test-form-is-submitting">{isSubmitting.toString()}</span>
            </>
          }
        </>
      );
    }}
  </Form>
);
