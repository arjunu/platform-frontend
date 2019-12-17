import { FormikConsumer } from "formik";
import * as React from "react";
import { FormGroup } from "reactstrap";

import { TTranslatedString, XOR } from "../../../../types";
import { ENumberInputFormat, ENumberOutputFormat, TValueFormat } from "../../formatters/utils";
import { MaskedNumberInputLayout } from "../layouts/MaskedNumberInputLayout";
import { FormFieldLabel } from "./FormFieldLabel";

interface ICommonProps {
  name: string;
  label?: TTranslatedString;
  placeholder?: string;
  disabled?: boolean;
  prefix?: TTranslatedString;
  suffix?: TTranslatedString;
}

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

export const FormMaskedNumberInput: React.FunctionComponent<ICommonProps & TExternalProps> = ({
  label,
  name,
  disabled,
  placeholder,
  storageFormat,
  outputFormat,
  valueType,
  showUnits,
  prefix,
  suffix,
}) => (
  <FormGroup>
    {label && <FormFieldLabel name={name}>{label}</FormFieldLabel>}
    <FormikConsumer>
      {({ values, setFieldValue, setFieldTouched }) => (
        <MaskedNumberInputLayout
          outputFormat={outputFormat}
          storageFormat={storageFormat}
          name={name}
          value={values[name]}
          onChangeFn={value => {
            setFieldValue(name, value);
            setFieldTouched(name, true);
          }}
          returnInvalidValues={true}
          valueType={valueType}
          showUnits={showUnits}
          disabled={disabled}
          placeholder={placeholder}
          prefix={prefix}
          suffix={suffix}
        />
      )}
    </FormikConsumer>
  </FormGroup>
);
