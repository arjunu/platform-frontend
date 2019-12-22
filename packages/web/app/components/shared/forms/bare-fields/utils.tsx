import * as React from "react";
import { FormGroup } from "reactstrap";

import { TTranslatedString } from "../../../../types";
import { FormError } from "../fields/FormFieldError";
import { applyCharactersLimit, withCountedCharacters } from "../fields/utils.unsafe";
import { FormLabel } from "../layouts/FormLabel";

import * as styles from "../fields/FormStyles.module.scss";

type TBareFormFieldExternalProps = {
  wrapperClassName?: string;
  labelClassName?: string;
  label?: TTranslatedString;
  reverseMetaInfo?: boolean;
  charactersLimit?: number;
  errorMsg?: TTranslatedString;
};

type TInputComponentRequiredProps = {
  name: string;
  invalid?: boolean;
  value?: string | string[] | number;
};

export const withBareFormField = <T extends TInputComponentRequiredProps>(
  InputComponent: React.ComponentType<T>,
): React.FunctionComponent<TBareFormFieldExternalProps & T> => ({
  wrapperClassName,
  labelClassName,
  label,
  reverseMetaInfo,
  charactersLimit,
  errorMsg,
  ...inputProps
}) => {
  const computedValue = applyCharactersLimit(inputProps.value, charactersLimit);

  return (
    <FormGroup className={wrapperClassName}>
      {label && (
        <FormLabel for={inputProps.name} className={labelClassName}>
          {label}
        </FormLabel>
      )}

      <InputComponent value={computedValue} {...(inputProps as T)} />

      {reverseMetaInfo ? (
        <div className={styles.inputMeta}>
          {charactersLimit && <div>{withCountedCharacters(computedValue, charactersLimit)}</div>}
          {inputProps.invalid && errorMsg && (
            <FormError name={inputProps.name} message={errorMsg} alignLeft={true} />
          )}
        </div>
      ) : (
        <>
          {inputProps.invalid && errorMsg && (
            <FormError name={inputProps.name} message={errorMsg} />
          )}
          {charactersLimit && <div>{withCountedCharacters(computedValue, charactersLimit)}</div>}
        </>
      )}
    </FormGroup>
  );
};
