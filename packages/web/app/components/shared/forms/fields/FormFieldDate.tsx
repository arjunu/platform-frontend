import { Field, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";

import { TDataTestId, TTranslatedString } from "../../../../types";
import { FormFieldError, generateErrorId } from "./FormFieldError";
import { FormFieldLabel } from "./FormFieldLabel";
import { isNonValid } from "./utils.unsafe";

import * as styles from "./FormFieldDate.module.scss";

interface IProps {
  disabled?: boolean;
  label: TTranslatedString;
  name: string;
}

const positionMap = {
  year: 0,
  month: 1,
  day: 2,
};

enum EFieldDateType {
  YEAR = "year",
  MONTH = "month",
  DAY = "day",
}

class FormFieldDate extends React.Component<IProps & TDataTestId> {
  cache = {
    day: "",
    month: "",
    year: "",
  };

  monthInput = React.createRef<HTMLInputElement>();

  yearInput = React.createRef<HTMLInputElement>();

  onChange = (
    type: EFieldDateType,
    e: React.FormEvent<HTMLInputElement>,
    handler: (e: React.FormEvent<HTMLInputElement>) => void,
  ) => {
    this.cache[type] = e.currentTarget.value;
    e.currentTarget.value = `${this.cache.year}-${this.cache.month}-${this.cache.day}`;

    handler(e);
  };

  fromValue = (type: EFieldDateType, value: string = ""): string => {
    const items = value.split("-");
    this.cache[type] = items.length === 3 ? items[positionMap[type]] : "";
    return this.cache[type];
  };

  render(): React.ReactNode {
    const { name, label, "data-test-id": dataTestId, disabled } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors, submitCount }) => {
          const invalid = isNonValid(touched, errors, name, submitCount, undefined);

          return (
            <FormGroup data-test-id={dataTestId}>
              <div className={styles.dateField}>
                <FormFieldLabel className={styles.label} name={name}>
                  {label}
                </FormFieldLabel>
                <div className={styles.inputsWrapper}>
                  <Field name={name}>
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        data-test-id="form-field-date-day"
                        aria-describedby={generateErrorId(name)}
                        aria-invalid={invalid}
                        className={styles.input}
                        invalid={invalid}
                        disabled={disabled}
                        onChange={e => {
                          this.onChange(EFieldDateType.DAY, e, field.onChange);
                          // auto advance to next field
                          const realValue = this.fromValue(EFieldDateType.DAY, e.target.value);
                          if (realValue.length === 2) {
                            this.monthInput.current!.focus();
                          }
                        }}
                        value={this.fromValue(EFieldDateType.DAY, field.value)}
                        placeholder="DD"
                        maxLength={2}
                      />
                    )}
                  </Field>
                  {"/"}
                  <Field name={this.props.name}>
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        data-test-id="form-field-date-month"
                        aria-describedby={generateErrorId(name)}
                        aria-invalid={invalid}
                        className={styles.input}
                        invalid={invalid}
                        disabled={disabled}
                        onChange={e => {
                          this.onChange(EFieldDateType.MONTH, e, field.onChange);

                          // auto advance to next field
                          const realValue = this.fromValue(EFieldDateType.MONTH, e.target.value);
                          if (realValue.length === 2) {
                            this.yearInput.current!.focus();
                          }
                        }}
                        value={this.fromValue(EFieldDateType.MONTH, field.value)}
                        placeholder="MM"
                        maxLength={2}
                        innerRef={this.monthInput}
                      />
                    )}
                  </Field>
                  {"/"}
                  <Field name={this.props.name}>
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        data-test-id="form-field-date-year"
                        aria-describedby={generateErrorId(name)}
                        aria-invalid={invalid}
                        className={styles.input}
                        invalid={invalid}
                        disabled={disabled}
                        onChange={e => this.onChange(EFieldDateType.YEAR, e, field.onChange)}
                        value={this.fromValue(EFieldDateType.YEAR, field.value)}
                        placeholder="YYYY"
                        maxLength={4}
                        innerRef={this.yearInput}
                      />
                    )}
                  </Field>
                </div>
              </div>
              <FormFieldError name={name} />
            </FormGroup>
          );
        }}
      </FormikConsumer>
    );
  }
}

export { FormFieldDate };
