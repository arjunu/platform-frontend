import * as cn from "classnames";
import { Field, FieldProps, FormikConsumer } from "formik";
import { map } from "lodash";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";

import { Dictionary, TDataTestId, TTranslatedString } from "../../../../../types";
import { FormFieldError, generateErrorId } from "../FormFieldError";
import { FormFieldLabel } from "../FormFieldLabel";
import { isNonValid } from "../utils.unsafe";

import * as sharedStyles from "../FormStyles.module.scss";
import * as styles from "./FormSelectField.module.scss";

export const NONE_KEY = "";
export const BOOL_TRUE_KEY = "true";
export const BOOL_FALSE_KEY = "false";

const boolifySingle = (value: string): boolean | string => {
  if (value === BOOL_TRUE_KEY) return true;

  if (value === BOOL_FALSE_KEY) return false;

  return value;
};

interface IOwnProps {
  extraMessage?: TTranslatedString;
}
interface IFieldGroup {
  name: string;
  disabled?: boolean;
  label?: TTranslatedString;
  values?: Dictionary<TTranslatedString>;
  customOptions?: React.ReactNode[];
  disabledValues?: Dictionary<boolean>;
}

export class FormSelectField extends React.Component<IFieldGroup & IOwnProps & TDataTestId> {
  renderOptions = () =>
    this.props.customOptions
      ? this.props.customOptions
      : map(this.props.values, (value, key) => {
          if (typeof value === "string") {
            return (
              <option
                key={key}
                value={key}
                disabled={this.props.disabledValues && this.props.disabledValues[key]}
              >
                {value}
              </option>
            );
          } else {
            // If it's an intl 'FormattedMessage' clone it with function as a child
            // otherwise React will render '[Object object]' as on 'option' value
            // see https://github.com/facebook/react/issues/13586
            return React.cloneElement(value, { key }, (message: string) => (
              <option
                value={key}
                disabled={this.props.disabledValues && this.props.disabledValues[key]}
              >
                {message}
              </option>
            ));
          }
        });

  render(): React.ReactNode {
    const { label, name, extraMessage, "data-test-id": dataTestId, disabled } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors, setFieldValue, submitCount }) => {
          const invalid = isNonValid(touched, errors, name, submitCount);

          // TODO: move label and error message to withFormField
          return (
            <FormGroup>
              {label && <FormFieldLabel name={name}>{label}</FormFieldLabel>}
              <div className={cn(styles.customSelect, { [styles.disabled]: disabled })}>
                {/* TODO: Check if we can pass type `select` and multiple prop here to reduce boilerplate */}
                <Field name={name}>
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      data-test-id={dataTestId}
                      aria-describedby={`${generateErrorId(name)} ${name}-extra-message`}
                      aria-invalid={invalid}
                      invalid={invalid}
                      disabled={disabled}
                      type="select"
                      value={field.value}
                      onChange={event => {
                        const value = event.target.value;

                        // provide a proper boolean value for
                        // BOOL_TRUE_KEY and BOOL_FALSE_KEY
                        setFieldValue(name, boolifySingle(value));
                      }}
                    >
                      {this.renderOptions()}
                    </Input>
                  )}
                </Field>
              </div>
              <FormFieldError name={name} />

              {extraMessage && (
                <div id={`${name}-extra-message`} className={sharedStyles.noteLabel}>
                  {extraMessage}
                </div>
              )}
            </FormGroup>
          );
        }}
      </FormikConsumer>
    );
  }
}
