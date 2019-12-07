import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import { selectNomineeStateIsLoading } from "../../../modules/nominee-flow/selectors";
import { appConnect } from "../../../store";
import { TDataTestId } from "../../../types";
import { EKeys } from "../../../utils/enums/keysEnum";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers.unsafe";
import { Button, EButtonLayout } from "../../shared/buttons/Button";
import { FormError } from "../../shared/forms/fields/FormFieldError";
import { EMaskedFormError, getMessageTranslation } from "../../translatedMessages/messages";
import { createMessage } from "../../translatedMessages/utils";
import { validateEthAddress, validateEthInput } from "./utils";

import * as styles from "./LinkToIssuer.module.scss";

interface IDispatchProps {
  createNomineeRequest: (issuerId: string) => void;
}

interface IStateProps {
  isLoading: boolean;
}

interface IProps {
  createNomineeRequest: (issuerId: string) => void;
  isLoading: boolean;
}

interface IMaskedFormState {
  value: string | undefined;
  error: EMaskedFormError | undefined;
  isValid: boolean;
}

export class NomineeLinkRequestFormBase extends React.Component<
  IIntlProps & IProps & TDataTestId,
  IMaskedFormState
> {
  state = {
    value: "",
    error: undefined, //this is to indicate illegal chars etc during input. A value can have no errors but be invalid because user is still typing
    isValid: false, // this is to indicate if the value is a valid Eth address that can be submitted
  };

  onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.onChange(e.clipboardData.getData("text"));
  };

  onChange = (value: string | undefined) => {
    if (value === "" || value === undefined) {
      this.setState({
        value: undefined,
        error: undefined,
        isValid: false,
      });
    } else {
      const error = validateEthInput(value);
      const isValid = validateEthAddress(value);
      this.setState({ value, error, isValid });
    }
  };

  onBlur = (value: string | undefined) => {
    const trimmedValue = value && value.trim();
    const isValid = validateEthAddress(trimmedValue);
    if (!isValid) {
      this.setState({ error: EMaskedFormError.GENERIC_ERROR, isValid, value: trimmedValue });
    }
  };

  onFocus = () => {
    this.setState({
      error: undefined,
    });
  };

  onSubmit = () => this.state.isValid && this.props.createNomineeRequest(this.state.value);

  onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === EKeys.ENTER) {
      event.preventDefault();
      if (this.state.isValid) {
        this.onSubmit();
      }
    }
  };

  render(): React.ReactNode {
    const name = "issuerId";
    return (
      <form className={styles.form}>
        <input
          className={styles.input}
          value={this.state.value}
          name={name}
          data-test-id="nominee-flow.link-with-issuer-input"
          placeholder={this.props.intl.formatIntlMessage(
            "nominee-flow.link-with-issuer.placeholder",
          )}
          onKeyDown={this.onKeyDown}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChange(e.target.value)}
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) => this.onBlur(e.target.value)}
          onFocus={this.onFocus}
          onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => this.onPaste(e)}
        />
        {this.state.error !== undefined ? (
          <FormError
            name={name}
            message={getMessageTranslation(createMessage(this.state.error!))}
            className={styles.formError}
          />
        ) : (
          <div className={styles.formError} />
        )}
        <Button
          layout={EButtonLayout.PRIMARY}
          onClick={this.onSubmit}
          disabled={!this.state.isValid || this.props.isLoading}
          data-test-id="nominee-flow.link-with-issuer-submit"
        >
          <FormattedMessage id="nominee-flow.link-with-issuer.send-request" />
        </Button>
      </form>
    );
  }
}

export const NomineeLinkRequestForm = compose<IIntlProps & IStateProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      isLoading: selectNomineeStateIsLoading(state),
    }),
    dispatchToProps: dispatch => ({
      createNomineeRequest: issuerId => {
        dispatch(actions.nomineeFlow.createNomineeRequest(issuerId));
      },
    }),
  }),
  injectIntlHelpers,
)(NomineeLinkRequestFormBase);
