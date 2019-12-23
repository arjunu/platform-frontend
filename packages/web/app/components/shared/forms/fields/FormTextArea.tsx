import * as cn from "classnames";
import { connect as formikConnect, Field, FieldProps } from "formik";
import * as React from "react";
import { Input } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { CommonHtmlProps, TFormikConnect, THocOuterProps, THocProps } from "../../../../types";
import { invariant } from "../../../../utils/invariant";
import { generateErrorId } from "./FormFieldError";
import { applyCharactersLimit, isNonValid, isWysiwyg, withFormField } from "./utils.unsafe";

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
    <Field name={name}>
      {({ field }: FieldProps) => (
        <RichTextAreaLayout
          invalid={invalid}
          name={name}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
          value={field.value}
          onChange={value => {
            // do not run validation twice here, just only when changing the value
            // also it's important to do touch field before changing the value
            // as otherwise validation gonna be called with previous value
            setFieldTouched(name, true, false);
            setFieldValue(name, value);
          }}
        />
      )}
    </Field>
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
    <Field name={name}>
      {({ field }: FieldProps) => (
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
            // do not run validation twice here, just only when changing the value
            // also it's important to do touch field before changing the value
            // as otherwise validation gonna be called with previous value
            setFieldTouched(name, true, false);
            setFieldValue(name, applyCharactersLimit(e.target.value, charactersLimit));
          }}
        />
      )}
    </Field>
  );
};

export const FormTextArea = compose<
  TFieldGroupProps & TFormikConnect & THocProps<typeof withFormField>,
  TFieldGroupProps & THocOuterProps<typeof withFormField>
>(
  withFormField(),
  formikConnect,
  branch<IFieldGroup & TFormikConnect>(
    props => !!props.isWysiwyg || isWysiwyg(props.formik.validationSchema, props.name),
    renderComponent(RichTextArea),
  ),
)(TextArea);
