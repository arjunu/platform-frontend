import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import * as Yup from "yup";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { FormDeprecated, FormField } from "../../../shared/forms";
import { FormConstantField } from "../../../shared/forms/fields/FormConstantField";
import { WarningAlert } from "../../../shared/WarningAlert";
import { getMessageTranslation } from "../../../translatedMessages/messages";
import { TMessage } from "../../../translatedMessages/utils";

import * as styles from "../WalletLight.module.scss";

const PASSWORD = "password";

const emailValidator = Yup.string().email();

export const LoginValidator = Yup.object().shape({
  password: Yup.string().required(
    <FormattedMessage id="wallet-selector.neuwallet.password-is-mandatory" />,
  ),
  email: emailValidator,
});

export interface IFormValues {
  password: string;
}

interface IDispatchProps {
  submitForm: (values: IFormValues) => void;
}

interface IStateProps {
  isLoading: boolean;
  errorMsg?: TMessage;
}

interface IOwnProps {
  email: string;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

const LoginLightWalletForm: React.FunctionComponent<TProps & FormikProps<IFormValues>> = props => (
  <FormDeprecated>
    <FormField
      type="password"
      placeholder="Password"
      name={PASSWORD}
      data-test-id="light-wallet-login-with-email-password-field"
    />
    <div className="text-center">
      <Button
        type="submit"
        disabled={!props.isValid}
        isLoading={props.isLoading}
        data-test-id="wallet-selector-nuewallet.login-button"
      >
        Login
      </Button>
    </div>
  </FormDeprecated>
);

const LoginEnhancedLightWalletForm = withFormik<TProps, IFormValues>({
  handleSubmit: (values, props) => props.props.submitForm(values),
  validationSchema: LoginValidator,
})(LoginLightWalletForm);

export const LoginWithEmailLightWalletComponent: React.FunctionComponent<IDispatchProps &
  IStateProps &
  IOwnProps> = props => (
  <>
    <Row>
      <p className={styles.prompt}>
        <FormattedMessage id="wallet-selector.neuwallet.login.prompt" />
      </p>
    </Row>
    <Row>
      <Col md={{ offset: 2, size: 8 }}>
        <FormConstantField
          value={props.email}
          className="mb-2"
          data-test-id="light-wallet-login-with-email-email-field"
          errorMessage={
            emailValidator.isValidSync(props.email) ? (
              undefined
            ) : (
              <FormattedMessage id="wallet-selector.neuwallet.email-error" />
            )
          }
        />
        <LoginEnhancedLightWalletForm {...props} />
        {props.errorMsg && (
          <WarningAlert className="mt-3">{getMessageTranslation(props.errorMsg)}</WarningAlert>
        )}
      </Col>
    </Row>
  </>
);

export const LoginWithEmailLightWallet = compose<React.FunctionComponent<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: state => ({
      errorMsg: state.lightWalletWizard.errorMsg as TMessage,
      isLoading: state.lightWalletWizard.isLoading,
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      submitForm: (values: IFormValues) => {
        dispatch(actions.walletSelector.lightWalletLogin(ownProps.email, values.password));
      },
    }),
  }),
)(LoginWithEmailLightWalletComponent);
