import { connect } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TFormikConnect } from "../../../../../types";
import { FormFieldError } from "../../../../shared/forms/fields/FormFieldError";
import { FormFieldLabel, FormLabel } from "../../../../shared/forms/fields/FormFieldLabel";
import { FormTextArea } from "../../../../shared/forms/fields/FormTextArea";
import { RadioButtonLayout } from "../../../../shared/forms/layouts/CheckboxLayout";

import * as styles from "../../Shared.module.scss";

interface IAdvisoryBoardProps {
  readonly: boolean;
}

interface IAdvisoryBoardState {
  textFieldIsEnabled: boolean;
}

class AdvisoryBoardBase extends React.Component<
  IAdvisoryBoardProps & TFormikConnect,
  IAdvisoryBoardState
> {
  name = "advisoryBoard";

  state = {
    textFieldIsEnabled:
      this.props.formik.values[this.name] && !!this.props.formik.values[this.name],
  };

  enableTextField = () => {
    this.props.formik.setFieldValue(this.name, "", false);
    this.props.formik.setFieldValue("advisoryBoardSelector", true, false);
    this.props.formik.setFieldError("advisoryBoardSelector", undefined!);
    this.props.formik.setFieldError(this.name, undefined!);

    this.setState({
      textFieldIsEnabled: true,
    });
  };

  disableTextField = () => {
    this.props.formik.setFieldValue(this.name, undefined);
    this.props.formik.setFieldValue("advisoryBoardSelector", false, false);
    this.props.formik.setFieldError("advisoryBoardSelector", undefined!);

    this.setState({
      textFieldIsEnabled: false,
    });
  };

  render(): React.ReactNode {
    const { readonly } = this.props;
    return (
      <>
        <div className="form-group">
          <FormLabel for="advisoryBoard">
            <FormattedMessage id="eto.form.section.token-holders-rights.advisory-board" />
          </FormLabel>
          <div className={styles.radioButtonGroup}>
            <RadioButtonLayout
              name="advisoryBoardSelector"
              checked={
                this.state.textFieldIsEnabled === undefined ? false : this.state.textFieldIsEnabled
              }
              value="true"
              onChange={this.enableTextField}
              label={<FormattedMessage id="form.select.yes" />}
              disabled={readonly}
            />
            <RadioButtonLayout
              name="advisoryBoardSelector"
              checked={
                this.state.textFieldIsEnabled === undefined ? true : !this.state.textFieldIsEnabled
              }
              value="false"
              onChange={this.disableTextField}
              label={<FormattedMessage id="form.select.no" />}
              disabled={readonly}
            />
            <FormFieldError name="advisoryBoardSelector" />
          </div>
        </div>
        {this.state.textFieldIsEnabled && (
          <div className="form-group">
            <FormFieldLabel name={this.name}>
              <FormattedMessage id="eto.form.section.token-holders-rights.advisory-board-description" />
            </FormFieldLabel>
            <FormTextArea name={this.name} disabled={readonly || !this.state.textFieldIsEnabled} />
          </div>
        )}
      </>
    );
  }
}

const AdvisoryBoard = connect<IAdvisoryBoardProps>(AdvisoryBoardBase);

export { AdvisoryBoard };
