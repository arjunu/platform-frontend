import { Field, FieldProps, FormikConsumer } from "formik";
import * as React from "react";

import { InputLayout } from "../layouts/InputLayout";
import { applyCharactersLimit, isNonValid } from "./utils.unsafe";

type TExternalProps = {
  customValidation?: (value: string | undefined) => string | Function | Promise<void> | undefined;
  charactersLimit?: number;
  ignoreTouched?: boolean;
};

export type FormInputProps = React.ComponentProps<typeof InputLayout>;

const transform = (value: string) => (value !== undefined ? value : "");

const transformBack = (value: number | string, charactersLimit?: number) => {
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return value.trim().length > 0 ? applyCharactersLimit(value, charactersLimit) : undefined;
  } else {
    return undefined;
  }
};

/**
 * Formik connected form input without FormGroup and FormFieldLabel.
 */
export const FormInput: React.FunctionComponent<TExternalProps & FormInputProps> = ({
  type,
  placeholder,
  name,
  prefix,
  suffix,
  className,
  addonStyle,
  size,
  disabled,
  customValidation,
  onBlur,
  icon,
  theme,
  maxLength,
  charactersLimit,
  ignoreTouched,
  ...props
}) => (
  <FormikConsumer>
    {({ touched, errors, setFieldTouched, setFieldValue, submitCount }) => {
      const invalid = isNonValid(touched, errors, name, submitCount, ignoreTouched);

      return (
        <Field name={name} validate={customValidation}>
          {({ field }: FieldProps) => {
            const val = transform(field.value);
            return (
              <InputLayout
                name={name}
                type={type}
                placeholder={placeholder}
                className={className}
                addonStyle={addonStyle}
                prefix={prefix}
                suffix={suffix}
                size={size}
                value={val}
                disabled={disabled}
                maxLength={maxLength}
                onBlur={onBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // do not run validation twice here, just only when changing the value
                  // also it's important to do touch field before changing the value
                  // as otherwise validation gonna be called with previous value
                  setFieldTouched(name, true, false);
                  setFieldValue(
                    name,
                    transformBack(
                      type === "number" && e.target.value !== ""
                        ? e.target.valueAsNumber
                        : e.target.value,
                      charactersLimit,
                    ),
                  );
                }}
                theme={theme}
                invalid={invalid}
                icon={icon}
                {...props}
              />
            );
          }}
        </Field>
      );
    }}
  </FormikConsumer>
);
