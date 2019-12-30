import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { externalRoutes } from "../../../../config/externalRoutes";
import * as YupTS from "../../../../lib/yup-ts.unsafe";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { ButtonArrowRight, ButtonInline } from "../../../shared/buttons";
import { ECheckboxLayout, Form, FormFieldBoolean } from "../../../shared/forms/index";
import { Heading } from "../../../shared/Heading";
import { ExternalLink } from "../../../shared/links";

interface IDispatchProps {
  goToSummary: () => void;
  downloadNEurTokenAgreement: () => void;
}

type IProps = IDispatchProps;

const AgreementScheme = YupTS.object({
  quintessenceTosApproved: YupTS.onlyTrue(),
  nEurTosApproved: YupTS.onlyTrue(),
});

type TAgreementForm = YupTS.TypeOf<typeof AgreementScheme>;

const BankTransferVerifyAgreementLayout: React.FunctionComponent<IProps> = ({
  goToSummary,
  downloadNEurTokenAgreement,
}) => (
  <section className="text-center">
    <Heading
      level={3}
      className="mb-3"
      decorator={false}
      description={<ExternalLink href={externalRoutes.quintessenceLanding} />}
    >
      <FormattedMessage id="bank-verification.agreement.title" />
    </Heading>

    <p className="mb-3">
      <FormattedMessage id="bank-verification.agreement.text" />
    </p>

    <small className="d-inline-block mb-3 mx-4">
      <FormattedMessage id="bank-verification.agreement.note" />
    </small>

    <Form<TAgreementForm>
      className="d-inline-block"
      validationSchema={AgreementScheme.toYup()}
      initialValues={{ quintessenceTosApproved: false, nEurTosApproved: false }}
      onSubmit={goToSummary}
    >
      {({ isValid }) => (
        <>
          <FormFieldBoolean
            className="mb-3"
            layout={ECheckboxLayout.BLOCK}
            label={
              <>
                <FormattedMessage id="bank-verification.agreement.terms-and-conditions.label" />
                <br />
                <small>
                  <ExternalLink
                    onClick={e => {
                      // Stop propagation, otherwise checkbox is going to be automatically checked
                      e.stopPropagation();
                    }}
                    href={externalRoutes.quintessenseTermsOfUse}
                  >
                    <FormattedMessage id="bank-verification.agreement.terms-and-conditions.download" />
                  </ExternalLink>
                </small>
              </>
            }
            name="quintessenceTosApproved"
          />
          <FormFieldBoolean
            className="mb-3"
            layout={ECheckboxLayout.BLOCK}
            label={
              <>
                <FormattedMessage id="bank-verification.agreement.neur-purchase-agreement.label" />
                <br />
                <small>
                  <ButtonInline
                    onClick={e => {
                      // Stop propagation, otherwise checkbox is going to be automatically checked
                      e.stopPropagation();
                      downloadNEurTokenAgreement();
                    }}
                  >
                    <FormattedMessage id="bank-verification.agreement.neur-purchase-agreement.download" />
                  </ButtonInline>
                </small>
              </>
            }
            name="nEurTosApproved"
          />
          <ButtonArrowRight
            data-test-id="bank-verification.agree-with-tos"
            type="submit"
            disabled={!isValid}
          >
            <FormattedMessage id="bank-verification.agreement.continue" />
          </ButtonArrowRight>
        </>
      )}
    </Form>
  </section>
);

const BankTransferAgreement = compose<IProps, {}>(
  appConnect<{}, IDispatchProps>({
    dispatchToProps: dispatch => ({
      goToSummary: () => dispatch(actions.bankTransferFlow.continueProcessing()),
      downloadNEurTokenAgreement: () =>
        dispatch(actions.bankTransferFlow.downloadNEurTokenAgreement()),
    }),
  }),
)(BankTransferVerifyAgreementLayout);

export { BankTransferAgreement, BankTransferVerifyAgreementLayout };
