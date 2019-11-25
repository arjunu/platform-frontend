import * as cn from "classnames";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";

import { TTranslatedString } from "../../../../types";
import { FormError } from "../fields/FormFieldError";
import { applyCharactersLimit, withCountedCharacters } from "../fields/utils.unsafe";
import { FormLabel } from "./FormLabel";
import { InputLayout } from "./InputLayout";

import * as styles from "../fields/FormStyles.module.scss";

interface IExternalProps {
  label?: TTranslatedString;
  renderInput?: (props: TProps) => React.ReactNode;
}

type TProps = React.ComponentProps<typeof InputLayout> & IExternalProps;

// Omit `InputLayout` props as they are not supported yet.
// After migration to `InputLayout` component here should be fixes
const renderDefaultInputElement = ({ size, prefix, ...props }: TProps) => <Input {...props} />;

// TODO: This component should under the hood render `InputLayout` not reactstrap `Input`
const FormFieldLayout: React.FunctionComponent<TProps> = ({
  value,
  name,
  label,
  prefix,
  suffix,
  className,
  addonStyle,
  charactersLimit,
  errorMsg,
  renderInput,
  invalid,
  ...props
}) => {
  const computedValue = applyCharactersLimit(value, charactersLimit);
  const isInvalid = invalid || !!errorMsg;

  const inputProps = {
    name,
    id: name,
    className: cn(className, styles.inputField),
    value: computedValue,
    invalid: isInvalid,
    valid: !isInvalid,
    ...props,
  };

  const renderInputElement = renderInput ? renderInput : renderDefaultInputElement;

  return (
    <FormGroup>
      {label && <FormLabel for={name}>{label}</FormLabel>}
      <InputGroup className={cn(invalid && "is-invalid")}>
        {prefix && (
          <InputGroupAddon addonType="prepend" className={cn(styles.addon, addonStyle)}>
            {prefix}
          </InputGroupAddon>
        )}
        {renderInputElement(inputProps)}
        {suffix && (
          <InputGroupAddon addonType="append" className={cn(styles.addon, addonStyle)}>
            {suffix}
          </InputGroupAddon>
        )}
      </InputGroup>
      {errorMsg && <FormError name={name} message={errorMsg} />}
      {charactersLimit && <div>{withCountedCharacters(computedValue, charactersLimit)}</div>}
    </FormGroup>
  );
};

export { FormFieldLayout };
