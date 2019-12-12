// tslint:disable-next-line:import-blacklist
import { connect as formikConnect, Form as FormikForm } from "formik";
import * as React from "react";
import { compose, lifecycle } from "recompose";

import { symbols } from "../../../di/symbols";
import { ILogger } from "../../../lib/dependencies/logger";
import { TFormikConnect } from "../../../types";
import { omitProps } from "../../../utils/omitProps";
import { withDependencies } from "../hocs/withDependencies";

type TProps = React.ComponentProps<typeof FormikForm>;

type TDependenciesProps = { logger: ILogger | undefined };
/**
 * @deprecated Use `Form` component
 */
const FormDeprecated = compose<TProps, TProps>(
  formikConnect,
  withDependencies<TDependenciesProps>({ logger: symbols.logger }),
  lifecycle<TFormikConnect & TDependenciesProps, {}>({
    componentDidUpdate(prevProps: TFormikConnect): void {
      if (
        prevProps.formik.isSubmitting &&
        !this.props.formik.isSubmitting &&
        !this.props.formik.isValid
      ) {
        const selector = "[aria-invalid='true']";

        const invalidInput = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          selector,
        );

        if (invalidInput) {
          invalidInput.focus();
        } else {
          const errors = JSON.stringify(this.props.formik.errors);
          this.props.logger!.warn(
            `It's not possible to focus invalid field: ${selector}. Errors: ${errors}`,
          );
        }
      }
    },
  }),
  // Remove logger from props so it's not forwarded to the dom
  omitProps(["logger"]),
)(FormikForm);

export { FormDeprecated };
