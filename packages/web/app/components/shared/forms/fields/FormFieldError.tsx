import * as cn from "classnames";
import { FormikConsumer, getIn } from "formik";
import * as React from "react";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { isNonValid } from "./utils.unsafe";

import * as styles from "./FormFieldError.module.scss";

export interface IFormErrorExternalProps {
  name?: string;
  message: TTranslatedString;
  alignLeft?: boolean;
}

export interface IProps {
  name: string;
  defaultMessage?: TTranslatedString;
  ignoreTouched?: boolean;
  className?: string;
  alignLeft?: boolean;
  invalid?: boolean;
}

const generateErrorId = (name: string) => `${name}-error-message`;

const FormError: React.FunctionComponent<IFormErrorExternalProps & CommonHtmlProps> = ({
  message,
  name,
  className,
  alignLeft,
}) => (
  <div
    data-test-id={name && `form.${name}.error-message`}
    id={name && generateErrorId(name)}
    role="alert"
    className={cn(styles.errorLabel, { [styles.errorLabelAlignLeft]: alignLeft }, className)}
  >
    {message}
  </div>
);

const FormFieldError: React.FunctionComponent<IProps> = ({
  name,
  defaultMessage,
  ignoreTouched,
  className,
  alignLeft,
  invalid,
}) => (
  <FormikConsumer>
    {({ touched, errors, submitCount }) => {
      const error = getIn(errors, name);
      // 1. this component is sometimes used not in the formik context to just show an error passed as
      // `defaultMessage` and `invalid`. I allow this by `!error`. TODO: All those cases must be refactored to use FormError directly
      // 2. when going through multiple validation steps on different levels of data it is possible that a key in the errors dictionary
      // resolves to an error message OR to a dictionary of children that are error messages. I can only show a valid React element or a string,
      // if it's a dictionary it should be ignored and those errors should be shown by respective components
      // see https://github.com/Neufund/platform-frontend/pull/3501/files#r327009024
      if (!error || typeof error === "string" || React.isValidElement(error)) {
        return (
          (isNonValid(touched, errors, name, submitCount, ignoreTouched) || invalid) && (
            <FormError
              name={name}
              message={getIn(errors, name) || defaultMessage}
              className={className}
              alignLeft={alignLeft}
            />
          )
        );
      } else {
        return null;
      }
    }}
  </FormikConsumer>
);

export { FormFieldError, FormError, generateErrorId };
