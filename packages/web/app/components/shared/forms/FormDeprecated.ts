// tslint:disable-next-line:import-blacklist
import { connect as formikConnect, Form as FormikForm } from "formik";
import * as React from "react";
import { compose, fromRenderProps, lifecycle } from "recompose";

import { symbols } from "../../../di/symbols";
import { ILogger } from "../../../lib/dependencies/logger";
import { TFormikConnect } from "../../../types";
import { ContainerContext, TContainerContext } from "../../../utils/InversifyProvider";
import { omitProps } from "../../../utils/omitProps";

type TProps = React.ComponentProps<typeof FormikForm>;

/**
 * @deprecated Use `Form` component
 */
const FormDeprecated = compose<TProps, TProps>(
  formikConnect,
  fromRenderProps<{ logger: ILogger | undefined }, any, TContainerContext>(
    ContainerContext.Consumer,
    container => ({ logger: container && container.get<ILogger>(symbols.logger) }),
  ),
  lifecycle<TFormikConnect & { logger: ILogger | undefined }, {}>({
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
