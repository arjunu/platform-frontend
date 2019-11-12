import * as cn from "classnames";
import { connect as formikConnect, Field, FieldProps } from "formik";
import * as React from "react";
import { Input } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { CommonHtmlProps, TFormikConnect } from "../../../../types";
import { invariant } from "../../../../utils/invariant";
import { FormFieldError, generateErrorId } from "./FormFieldError";
import {
  applyCharactersLimit,
  IFormField,
  isNonValid,
  isWysiwyg,
  withCountedCharacters,
  withFormField,
} from "./utils.unsafe";

import * as styles from "./FormStyles.module.scss";

interface IFieldGroup {
  name: string;
  disabled?: boolean;
  placeholder?: string;
  /**
   * @deprecated Use `Yup` max validation to keep schema related validation in one place
   */
  charactersLimit?: number;
  isWysiwyg?: boolean;
}

type TFieldGroupProps = IFieldGroup & CommonHtmlProps;

const RichTextAreaLayout = React.lazy(() =>
  import("../layouts/RichTextAreaLayout").then(imp => ({ default: imp.RichTextAreaLayout })),
);

const RichTextArea: React.FunctionComponent<TFieldGroupProps & TFormikConnect> = ({
  disabled,
  placeholder,
  name,
  className,
  charactersLimit,
  formik,
}) => {
  if (process.env.NODE_ENV === "development") {
    invariant(
      charactersLimit === undefined,
      "`charactersLimit` prop is deprecated and should not be used anymore for rich text editor",
    );
  }

  const { touched, errors, submitCount, setFieldTouched, setFieldValue } = formik;

  const invalid = isNonValid(touched, errors, name, submitCount);

  return (
    <Field
      name={name}
      render={({ field }: FieldProps) => (
        <>
          <RichTextAreaLayout
            invalid={invalid}
            name={name}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
            value={field.value}
            onChange={value => {
              setFieldTouched(name);
              setFieldValue(name, value);
            }}
          />
          <FormFieldError name={name} />
        </>
      )}
    />
  );
};

const TextArea: React.FunctionComponent<TFieldGroupProps & TFormikConnect> = ({
  disabled,
  placeholder,
  name,
  className,
  charactersLimit,
  formik,
}) => {
  const { touched, errors, submitCount, setFieldTouched, setFieldValue } = formik;

  const invalid = isNonValid(touched, errors, name, submitCount);

  return (
    <Field
      name={name}
      render={({ field }: FieldProps) => (
        <>
          <Input
            {...field}
            type="textarea"
            aria-describedby={generateErrorId(name)}
            aria-invalid={invalid}
            invalid={invalid}
            disabled={disabled}
            value={field.value === undefined ? "" : field.value}
            placeholder={placeholder}
            className={cn(className, styles.inputField)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFieldTouched(name);
              setFieldValue(name, applyCharactersLimit(e.target.value, charactersLimit));
            }}
          />
          <FormFieldError name={name} />
          {charactersLimit && withCountedCharacters(field.value, charactersLimit)}
        </>
      )}
    />
  );
};

export const FormTextArea = compose<
  TFieldGroupProps & TFormikConnect,
  TFieldGroupProps & IFormField
>(
  withFormField,
  formikConnect,
  branch<IFieldGroup & TFormikConnect>(
    props => !!props.isWysiwyg || isWysiwyg(props.formik.validationSchema, props.name),
    renderComponent(RichTextArea),
  ),
)(TextArea);
