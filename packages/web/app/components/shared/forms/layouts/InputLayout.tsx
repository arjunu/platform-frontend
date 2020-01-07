import * as cn from "classnames";
import * as React from "react";
import { Input, InputGroup, InputGroupAddon, InputGroupText, InputProps } from "reactstrap";

import { CommonHtmlProps, TDataTestId, TTranslatedString } from "../../../../types";
import { FormFieldError, generateErrorId } from "../fields/FormFieldError";
import { withCountedCharacters } from "../fields/utils.unsafe";

import * as styles from "../fields/FormStyles.module.scss";

enum EInputSize {
  NORMAL = "",
  SMALL = "sm",
}

enum EInputTheme {
  BOTTOM_BORDER = styles.bottomBorder,
  BOX = styles.box,
}

interface IExternalProps {
  addonStyle?: string;
  charactersLimit?: number;
  errorMsg?: TTranslatedString;
  ignoreTouched?: boolean;
  invalid?: boolean;
  maxLength?: number;
  name: string;
  prefix?: TTranslatedString;
  size?: EInputSize;
  suffix?: TTranslatedString;
  theme?: EInputTheme;
  icon?: string;
  reverseMetaInfo?: boolean;
}

type TProps = IExternalProps &
  CommonHtmlProps &
  TDataTestId &
  Omit<InputProps, keyof IExternalProps>;

const InputLayout: React.FunctionComponent<TProps> = ({
  type,
  placeholder,
  name,
  prefix,
  suffix,
  className,
  addonStyle,
  charactersLimit,
  errorMsg,
  size,
  disabled,
  ignoreTouched,
  maxLength,
  onChange,
  value,
  invalid,
  onFocus,
  onBlur,
  ["data-test-id"]: dataTestId,
  theme,
  icon,
  reverseMetaInfo,
  ...props
}) => (
  <section>
    <InputGroup size={size}>
      {prefix && (
        <div
          className={cn(styles.addon, addonStyle, { "is-invalid": invalid }, "input-group-prepend")}
        >
          <span className="input-group-text">{prefix}</span>
        </div>
      )}
      <Input
        aria-describedby={generateErrorId(name)}
        aria-invalid={invalid}
        invalid={invalid}
        name={name}
        id={name}
        maxLength={maxLength}
        className={cn(className, styles.inputField, theme)}
        onChange={onChange}
        onBlur={e => {
          if (onBlur) {
            onBlur(e);
          }
        }}
        onFocus={e => {
          if (onFocus) {
            onFocus(e);
          }
        }}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        data-test-id={dataTestId}
        {...props}
      />
      {(suffix || icon) && (
        <InputGroupAddon addonType="append" className={cn(styles.addon, { "is-invalid": invalid })}>
          <InputGroupText>
            {suffix}
            {icon && (
              <img className={styles.icon} src={icon} alt="" data-test-id="input-layout.icon" />
            )}
          </InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
    {reverseMetaInfo ? (
      <div className={styles.inputMeta}>
        {charactersLimit && <div>{withCountedCharacters(value, charactersLimit)}</div>}
        <FormFieldError
          invalid={invalid}
          name={name}
          defaultMessage={errorMsg}
          ignoreTouched={ignoreTouched}
          alignLeft={true}
        />
      </div>
    ) : (
      <>
        <FormFieldError
          invalid={invalid}
          name={name}
          defaultMessage={errorMsg}
          ignoreTouched={ignoreTouched}
        />
        {charactersLimit && <div>{withCountedCharacters(value, charactersLimit)}</div>}
      </>
    )}
  </section>
);

InputLayout.defaultProps = {
  size: EInputSize.NORMAL,
  theme: EInputTheme.BOTTOM_BORDER,
};

export { InputLayout, EInputSize, EInputTheme };
