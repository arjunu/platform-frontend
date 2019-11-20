import * as cn from "classnames";
import { connect } from "formik";
import * as React from "react";
import { compose, shouldUpdate } from "recompose";

import { CommonHtmlProps, TFormikConnect } from "../../../../types";
import { isFieldRequired } from "./utils.unsafe";

import * as styles from "./FormFieldLabel.module.scss";

export type FormLabelExternalProps = {
  for: string;
  inheritFont?: boolean;
};

export type FormFieldLabelExternalProps = {
  name: string;
  inheritFont?: boolean;
};

const generateLabelId = (name: string) => `${name}-label`;

const FormLabel: React.FunctionComponent<FormLabelExternalProps & CommonHtmlProps> = ({
  for: htmlFor,
  children,
  className,
  inheritFont,
}) => (
  <label
    htmlFor={htmlFor}
    id={generateLabelId(htmlFor)}
    className={cn(styles.formLabel, className, { [styles.inheritFont]: inheritFont })}
  >
    {children}
  </label>
);

const FormFieldLabelLayout: React.FunctionComponent<CommonHtmlProps &
  FormFieldLabelExternalProps &
  TFormikConnect> = ({ children, name, formik, inheritFont, ...rawProps }) => {
  if (formik.validationSchema) {
    return (
      <FormLabel for={name} inheritFont={inheritFont} {...rawProps}>
        {children}
        {isFieldRequired(formik.validationSchema, name, formik) && (
          <span aria-hidden="true"> *</span>
        )}
      </FormLabel>
    );
  }

  return (
    <FormLabel for={name} {...rawProps}>
      {children}
    </FormLabel>
  );
};

const FormFieldLabel = compose<
  CommonHtmlProps & FormFieldLabelExternalProps & TFormikConnect,
  FormFieldLabelExternalProps & CommonHtmlProps
>(
  connect,
  // Do not rerender until either name or schema changes
  shouldUpdate<FormFieldLabelExternalProps & TFormikConnect>(
    (props, nextProps) =>
      props.name !== nextProps.name ||
      props.formik.validationSchema !== nextProps.formik.validationSchema,
  ),
)(FormFieldLabelLayout);

export { FormFieldLabel, FormLabel, generateLabelId };
