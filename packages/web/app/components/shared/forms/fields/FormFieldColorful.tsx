import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { FormGroup, Input, InputProps } from "reactstrap";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { Avatar } from "../../Avatar";
import { FormFieldError, generateErrorId } from "./FormFieldError";
import { FormFieldLabel } from "./FormFieldLabel";
import { isNonValid } from "./utils.unsafe";

import * as styles from "./FormFieldColorful.module.scss";

interface IFieldGroup {
  label?: string;
  placeholder?: string;
  type?: InputProps["type"];
  maxLength?: string;
  showAvatar?: boolean;
  errorMessage?: TTranslatedString;
}
// TODO: Bootstrap and formik typings are not in sync. Remove `any` after we bootstrap update
// tslint:disable-next-line:no-any-on-steroid
type FieldGroupProps = IFieldGroup & FieldAttributes<any> & CommonHtmlProps;

// TODO: Wrap `withFormField`
export class FormFieldColorful extends React.Component<FieldGroupProps> {
  render(): React.ReactNode {
    const { label, type, placeholder, name, className, showAvatar, ...props } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors, submitCount }) => (
          <FormGroup>
            {label && <FormFieldLabel name={name}>{label}</FormFieldLabel>}

            <Field name={name}>
              {({ field }: FieldProps) => {
                const validClass = () => {
                  if (field.value) {
                    return errors[name] !== undefined ? "is-invalid" : "is-valid";
                  }

                  return "";
                };

                const invalid = isNonValid(touched, errors, name, submitCount);

                return (
                  <>
                    <div className={cn(styles.inputWrapper, validClass())}>
                      <Input
                        {...field}
                        aria-describedby={generateErrorId(name)}
                        aria-invalid={invalid}
                        invalid={invalid}
                        className={cn(styles.input, className)}
                        type={type}
                        value={field.value}
                        placeholder={placeholder || label}
                        {...props}
                      />
                      {showAvatar && (
                        <div className={styles.addon}>
                          <Avatar seed={field.value || ""} />
                        </div>
                      )}
                    </div>
                    <FormFieldError name={name} />
                  </>
                );
              }}
            </Field>
          </FormGroup>
        )}
      </FormikConsumer>
    );
  }
}
