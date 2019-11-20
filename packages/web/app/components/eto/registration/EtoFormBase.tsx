import { connect } from "formik";
import * as React from "react";
import { compose } from "recompose";
import * as Yup from "yup";

import {
  getFormFractionDoneCalculator,
  IProgressOptions,
  ProgressCalculator,
} from "../../../modules/eto-flow/utils";
import { TDataTestId, TFormikConnect, TTranslatedString } from "../../../types";
import { pickSchemaValues } from "../../../utils/yupUtils";
import { Form, TFormProps } from "../../shared/forms/index";
import { PercentageIndicatorBar } from "../../shared/PercentageIndicatorBar";
import { Section } from "./Shared";

import * as styles from "./EtoFormBase.module.scss";

interface IProps {
  title: TTranslatedString;
}

type TFormPercentageDoneProps = {
  validationSchema: Yup.Schema<unknown>;
  progressOptions?: IProgressOptions;
};

type TValidatorProps<Values> = {
  validate?: (x: Values, y: unknown) => void;
};

type TProps = TFormPercentageDoneProps & TFormikConnect;

class PercentageFormDoneLayout extends React.Component<TProps> {
  calculate: ProgressCalculator = getFormFractionDoneCalculator(
    this.props.validationSchema,
    this.props.progressOptions,
  );

  shouldComponentUpdate(nextProps: Readonly<TProps>): boolean {
    // Only rerender when errors number differs
    return (
      Object.keys(this.props.formik.errors).length !== Object.keys(nextProps.formik.errors).length
    );
  }

  render(): React.ReactNode {
    const calculatedFraction = this.calculate(this.props.formik.values);

    return (
      <PercentageIndicatorBar className={styles.progressBar} percent={calculatedFraction * 100} />
    );
  }
}

const PercentageFormDone = compose<TProps, TFormPercentageDoneProps>(connect)(
  PercentageFormDoneLayout,
);

type TExternalProps<Values extends {}> = IProps &
  TDataTestId &
  TFormPercentageDoneProps &
  TFormProps<Values> &
  TValidatorProps<Values>;

export const EtoFormBase = <Values extends {}>({
  children,
  title,
  progressOptions,
  initialValues,
  validationSchema,
  validate,
  ...formProps
}: TExternalProps<Values>) => {
  // Filter to contain only known schema values
  const values: Values = React.useMemo(() => pickSchemaValues(validationSchema, initialValues), [
    validationSchema,
    initialValues,
  ]);

  return (
    <Form<Values>
      className={styles.form}
      initialValues={values}
      validationSchema={validationSchema}
      validate={validate}
      {...formProps}
    >
      <h4 className={styles.header}>{title}</h4>

      <Section>
        <PercentageFormDone validationSchema={validationSchema} progressOptions={progressOptions} />
      </Section>

      {children}
    </Form>
  );
};
