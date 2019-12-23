import * as cn from "classnames";
import { connect, Field, FieldProps, getIn } from "formik";
import * as React from "react";

import { TFormikConnect } from "../../../../types";

import * as styles from "./FormToggle.module.scss";

interface IProps {
  disabledLabel: string | React.ReactNode;
  enabledLabel: string | React.ReactNode;
  name: string;
  disabled?: boolean;
  trueValue?: string | boolean;
  falseValue?: string | boolean;
  "data-test-id"?: string;
}

interface IInternalProps {
  value: boolean;
  onChange: (a: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ToggleComponent: React.FunctionComponent<IProps & IInternalProps> = ({
  disabledLabel,
  enabledLabel,
  onChange,
  value,
  name,
  disabled,
  "data-test-id": dataTestId,
}) => (
  <div className={styles.toggle}>
    <div>{disabledLabel}</div>
    <label className={styles.toggleWrapper}>
      <input
        type="checkbox"
        className={styles.input}
        name={name}
        onChange={onChange}
        checked={value}
        disabled={disabled}
        data-test-id={dataTestId}
      />
      <div className={cn(styles.track)}>
        <div className={styles.indicator} />
      </div>
    </label>
    <div>{enabledLabel}</div>
  </div>
);

class FormToggleLayout extends React.Component<IProps & TFormikConnect> {
  static defaultProps = {
    trueValue: true,
    falseValue: false,
  };

  constructor(props: IProps & TFormikConnect) {
    super(props);
    this.setDefaultValueIfNeeded();
  }

  setDefaultValueIfNeeded(): void {
    const { name, falseValue, formik } = this.props;
    const { values, setFieldValue } = formik;

    const value = getIn(values, name);

    if (value === undefined) {
      setFieldValue(this.props.name, falseValue);
    }
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { trueValue, falseValue, formik } = this.props;
    const { setFieldValue } = formik;

    const isChecked = e.target.checked;

    const finalValue = isChecked ? trueValue : falseValue;

    setFieldValue(this.props.name, finalValue);
  };

  render(): React.ReactNode {
    const { name, trueValue } = this.props;

    return (
      <Field name={name}>
        {({ field }: FieldProps) => (
          <ToggleComponent
            {...this.props}
            {...field}
            value={field.value === trueValue}
            onChange={this.onChange}
          />
        )}
      </Field>
    );
  }
}

export const FormToggle = connect<IProps, unknown>(FormToggleLayout);
