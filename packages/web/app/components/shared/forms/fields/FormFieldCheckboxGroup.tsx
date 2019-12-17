import { connect as formikConnect, Field, FieldProps, getIn } from "formik";
import * as React from "react";
import { compose } from "recompose";

import { TFormikConnect } from "../../../../types";
import { CheckboxLayout } from "../layouts/CheckboxLayout";
import { IFormField, withFormField } from "./utils.unsafe";

interface IFormFieldCheckboxGroupProps {
  name: string;
}

interface IFormFieldCheckboxProps {
  value: string;
  label: string;
  disabled?: boolean;
}

const FormFieldNameContext = React.createContext("FORM FIELD UNKNOWN");

const FormFieldCheckbox: React.FunctionComponent<IFormFieldCheckboxProps> = ({
  value,
  label,
  disabled,
  ...restProps
}) => {
  const fieldName = React.useContext(FormFieldNameContext);

  return (
    <Field type="checkbox" name={fieldName} value={value}>
      {({ field }: FieldProps) => (
        <CheckboxLayout
          {...restProps}
          {...field}
          name={fieldName}
          disabled={disabled}
          label={label}
          value={value}
        />
      )}
    </Field>
  );
};

const FormFieldCheckboxGroupLayout: React.FunctionComponent<IFormFieldCheckboxGroupProps &
  TFormikConnect> = ({ name, formik, children }) => {
  // set default value to empty array if `undefined`
  React.useEffect(() => {
    const { setFieldValue, values } = formik;
    const value = getIn(values, name);

    if (value === undefined) {
      setFieldValue(name, []);
    }
  }, []);

  return (
    <FormFieldNameContext.Provider value={name}>
      <div>{children}</div>
    </FormFieldNameContext.Provider>
  );
};

// TODO: Fix accessibility
const FormFieldCheckboxGroup = compose<IFormFieldCheckboxGroupProps & TFormikConnect, IFormField>(
  withFormField,
  formikConnect,
)(FormFieldCheckboxGroupLayout);

export { FormFieldCheckbox, FormFieldCheckboxGroup };
