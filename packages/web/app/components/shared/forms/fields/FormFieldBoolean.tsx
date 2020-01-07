import { Field, FieldProps, getIn } from "formik";
import * as React from "react";

import { CheckboxLayout, ECheckboxLayout, RadioButtonLayout } from "../layouts/CheckboxLayout";
import { FormFieldError } from "./FormFieldError";

type LayoutProps = React.ComponentProps<typeof CheckboxLayout>;
type TProps = Omit<LayoutProps, "onChange">;

type TRadioButtonProps = {
  layout?: ECheckboxLayout;
  name: string;
  label?: string | React.ReactNode;
  value?: string | boolean;
  checked?: boolean;
  disabled?: boolean;
  inputRef?: (el: HTMLInputElement | null) => void;
};

/*
 * Conditional checkbox.
 * Use when there is a need to represent true/false value (checked === true).
 * If array of values is needed use FormFieldCheckboxGroup
 */
class FormFieldBoolean extends React.Component<TProps> {
  render(): React.ReactNode {
    const { name, checked, disabled, className, ...rest } = this.props;

    return (
      <Field
        name={name}
        render={({ field, form }: FieldProps) => (
          <div className={className}>
            <CheckboxLayout
              {...field}
              {...rest}
              name={name}
              disabled={disabled}
              checked={checked || getIn(form.values, name)}
              onChange={() => form.setFieldValue(name, !getIn(form.values, name))}
            />
            <FormFieldError name={name} className="text-left" />
          </div>
        )}
      />
    );
  }
}

class FormRadioButton extends React.Component<TRadioButtonProps> {
  render(): React.ReactNode {
    const { name, checked, disabled, value } = this.props;

    return (
      <Field
        name={name}
        render={({ field, form }: FieldProps) => (
          <RadioButtonLayout
            {...field}
            {...this.props}
            checked={checked || getIn(form.values, name) === value}
            onChange={() => form.setFieldValue(name, value)}
            disabled={disabled}
          />
        )}
      />
    );
  }
}

export { FormRadioButton, FormFieldBoolean };
