import * as React from "react";
import { FormGroup } from "reactstrap";

import { TTranslatedString } from "../../../../types";
import { FormError } from "../fields/FormFieldError";
import { FormFieldLabelLayout } from "../fields/FormFieldLabel";
import { withCountedCharacters } from "../fields/utils.unsafe";

import * as styles from "../fields/FormStyles.module.scss";

type TBareFormFieldExternalProps = {
  wrapperClassName?: string;
  label?: TTranslatedString;
  reverseMetaInfo?: boolean;
  charactersLimit?: number;
  errorMsg?: TTranslatedString;
};

type TInputComponentRequiredProps = {
  name: string;
  invalid: boolean;
  value: string | undefined | number;
};

export const withBareFormField = <T extends TInputComponentRequiredProps>(
  InputComponent: React.ComponentType<T>,
): React.FunctionComponent<TBareFormFieldExternalProps & T> => ({
  wrapperClassName,
  label,
  reverseMetaInfo,
  charactersLimit,
  errorMsg,
  ...inputProps
}) => (
  <FormGroup className={wrapperClassName}>
    {label && <FormFieldLabelLayout name={inputProps.name}>{label}</FormFieldLabelLayout>}

    <InputComponent {...inputProps as T} />

    {reverseMetaInfo ? (
      <div className={styles.inputMeta}>
        {charactersLimit && <div>{withCountedCharacters(inputProps.value, charactersLimit)}</div>}
        {inputProps.invalid && errorMsg && (
          <FormError name={inputProps.name} message={errorMsg} alignLeft={true} />
        )}
      </div>
    ) : (
      <>
        {inputProps.invalid && errorMsg && <FormError name={inputProps.name} message={errorMsg} />}
        {charactersLimit && <div>{withCountedCharacters(inputProps.value, charactersLimit)}</div>}
      </>
    )}
  </FormGroup>
);
