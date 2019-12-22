import { Field, FieldProps } from "formik";
import * as React from "react";

import { OmitKeys, XOR } from "../../../../types";
import { ENumberInputFormat, ENumberOutputFormat, TValueFormat } from "../../formatters/utils";
import { MaskedNumberInputLayout } from "../layouts/MaskedNumberInputLayout";
import { isNonValid } from "./utils.unsafe";

interface ICommonProps {
  ignoreTouched?: boolean;
}

type TLayoutProps = OmitKeys<
  React.ComponentProps<typeof MaskedNumberInputLayout>,
  "onChangeFn" | "value" | "invalid"
>;

interface IFormMaskedNumberProps {
  storageFormat: ENumberInputFormat;
  outputFormat: ENumberOutputFormat;
}

interface IFormMaskedNumberMoneyProps {
  storageFormat: ENumberInputFormat;
  outputFormat: ENumberOutputFormat;
  valueType: TValueFormat;
  showUnits: boolean;
}

type TExternalProps = XOR<IFormMaskedNumberProps, IFormMaskedNumberMoneyProps>;

const FormMaskedNumberInput: React.FunctionComponent<
  ICommonProps & TExternalProps & TLayoutProps
> = ({ name, ignoreTouched, ...layoutProps }) => (
  <Field name={name}>
    {({ field, form }: FieldProps) => {
      const invalid = isNonValid(form.touched, form.errors, name, form.submitCount, ignoreTouched);

      return (
        <MaskedNumberInputLayout
          name={name}
          value={field.value}
          onChangeFn={value => {
            form.setFieldValue(name, value);
            form.setFieldTouched(name, true);
          }}
          invalid={invalid}
          {...layoutProps}
        />
      );
    }}
  </Field>
);

export { FormMaskedNumberInput };
