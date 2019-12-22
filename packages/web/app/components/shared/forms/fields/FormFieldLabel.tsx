import { connect } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, shouldUpdate } from "recompose";

import { CommonHtmlProps, TFormikConnect } from "../../../../types";
import { FormLabel } from "../layouts/FormLabel";
import { isFieldRequired } from "./utils.unsafe";

import * as styles from "./FormFieldLabel.module.scss";

type FormFieldLabelExternalProps = {
  name: string;
  inheritFont?: boolean;
};

const FormFieldLabelLayout: React.FunctionComponent<CommonHtmlProps &
  FormFieldLabelExternalProps &
  TFormikConnect> = ({ children, name, formik, inheritFont, ...rawProps }) => {
  if (formik.validationSchema) {
    return (
      <FormLabel for={name} inheritFont={inheritFont} {...rawProps}>
        {children}
        {!isFieldRequired(formik.validationSchema, name, formik) && (
          <span className={styles.optionalField}>
            {" "}
            (<FormattedMessage id="form.label.optional" />)
          </span>
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

export { FormFieldLabel, FormFieldLabelLayout };
