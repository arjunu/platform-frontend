import * as cn from "classnames";
import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import * as Yup from "yup";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { IIntlProps, injectIntlHelpers } from "@neufund/shared"
import { Button } from "../../../shared/buttons";
import { FormDeprecated, FormField } from "../../../shared/forms";
import { TMessage } from "../../../translatedMessages/utils";

import * as styles from "./RegisterLightWallet.module.scss";

const EMAIL = "email";
const PASSWORD = "password";
const REPEAT_PASSWORD = "repeatPassword";

export interface IFormValues {
  email: string;
  password: string;
  repeatPassword: string;
}

export interface IStateProps {
  isLoading?: boolean;
  errorMsg?: TMessage;
}

interface IDispatchProps {
  submitForm: (values: IFormValues) => void;
}

const validationSchema = Yup.object().shape({
  [EMAIL]: Yup.string()
    .required()
    .email(),
  [PASSWORD]: Yup.string()
    .required()
    .min(8),
  [REPEAT_PASSWORD]: Yup.string()
    .required()
    .oneOf(
      [Yup.ref(PASSWORD)],
      <FormattedMessage id="wallet-selector.neuwallet.passwords-do-not-match" />,
    ),
});

class RegisterLightWalletForm extends React.Component<
  FormikProps<IFormValues> & IStateProps & IIntlProps & { restore: boolean }
> {
  componentDidUpdate = (
    nextProps: FormikProps<IFormValues> & IStateProps & { restore: boolean },
  ) => {
    if (
      this.props.isLoading === true &&
      this.props.isSubmitting === true &&
      nextProps.isLoading === false &&
      nextProps.isSubmitting === true
    ) {
      this.props.setSubmitting(false);
    }
  };

  render = () => (
    <FormDeprecated className="my-3">
      <FormField
        placeholder={this.props.intl.formatIntlMessage("wallet-selector.register.email")}
        type="email"
        name={EMAIL}
        data-test-id="wallet-selector-register-email"
      />
      <FormField
        type="password"
        placeholder={this.props.intl.formatIntlMessage("wallet-selector.register.password")}
        name={PASSWORD}
        data-test-id="wallet-selector-register-password"
      />
      <FormField
        type="password"
        placeholder={this.props.intl.formatIntlMessage("wallet-selector.register.confirm-password")}
        name={REPEAT_PASSWORD}
        data-test-id="wallet-selector-register-confirm-password"
      />
      <div className="text-center my-4">
        <Button
          type="submit"
          isLoading={this.props.isSubmitting || this.props.isLoading}
          disabled={!this.props.isValid}
          data-test-id="wallet-selector-register-button"
        >
          {this.props.restore ? (
            <FormattedMessage id="wallet-selector.neuwallet.restore" />
          ) : (
            <FormattedMessage id="wallet-selector.neuwallet.register" />
          )}
        </Button>
      </div>
    </FormDeprecated>
  );
}

const RegisterEnhancedLightWalletForm: React.FunctionComponent = compose<any>(
  injectIntlHelpers,
  withFormik<IDispatchProps & IStateProps & { restore: boolean }, IFormValues>({
    validationSchema: validationSchema,
    mapPropsToValues: () => ({
      email: "",
      password: "",
      repeatPassword: "",
    }),
    handleSubmit: (values, props) => props.props.submitForm(values),
  }),
)(RegisterLightWalletForm);

export const RegisterWalletComponent: React.FunctionComponent<IDispatchProps &
  IStateProps & { restore: boolean }> = props => (
  <>
    {props.restore ? null : (
      <>
        <h2
          className={cn(styles.title, "text-center mb-4")}
          data-test-id="modals.wallet-selector.register-restore-light-wallet.title"
        >
          <FormattedMessage id="wallet-selector.neuwallet.register-prompt" />
        </h2>
        <p className={styles.explanation}>
          <FormattedMessage tagName="span" id="wallet-selector.neuwallet.explanation-1" />
        </p>
      </>
    )}
    <Row>
      <Col md={{ size: 8, offset: 2 }}>
        <RegisterEnhancedLightWalletForm {...props} />
      </Col>
    </Row>

    <p className={styles.note}>
      <FormattedHTMLMessage tagName="span" id="wallet-selector.neuwallet.explanation-2" />
    </p>
  </>
);

export const RegisterLightWallet = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps, { restore: boolean }>({
    stateToProps: state => ({
      errorMsg: state.lightWalletWizard.errorMsg as TMessage,
      isLoading: state.lightWalletWizard.isLoading,
    }),
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) =>
        dispatch(actions.walletSelector.lightWalletRegister(values.email, values.password)),
    }),
  }),
)(RegisterWalletComponent);
