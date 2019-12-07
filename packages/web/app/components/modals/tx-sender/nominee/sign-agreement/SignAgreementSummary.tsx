import { Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, withProps } from "recompose";

import { IEtoDocument } from "../../../../../lib/api/eto/EtoFileApi.interfaces";
import { IImmutableFileId } from "../../../../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import * as YupTS from "../../../../../lib/yup-ts.unsafe";
import { actions } from "../../../../../modules/actions";
import { TEtoWithCompanyAndContractReadonly } from "../../../../../modules/eto/types";
import { selectActiveNomineeEto } from "../../../../../modules/nominee-flow/selectors";
import { selectTxType } from "../../../../../modules/tx/sender/selectors";
import { ETxSenderType } from "../../../../../modules/tx/types";
import { appConnect } from "../../../../../store";
import { RequiredByKeys } from "../../../../../types";
import { Button, EButtonLayout } from "../../../../shared/buttons/Button";
import { DocumentButton } from "../../../../shared/DocumentLink";
import { FormFieldBoolean } from "../../../../shared/forms/fields/FormFieldBoolean";
import { FormDeprecated } from "../../../../shared/forms/FormDeprecated";
import { EHeadingSize, Heading } from "../../../../shared/Heading";
import { InlineIcon } from "../../../../shared/icons/InlineIcon";
import { isRAASign, selectDocument } from "./utils";

import * as link from "../../../../../assets/img/inline_icons/download.svg";

interface IStateProps {
  nomineeEto?: TEtoWithCompanyAndContractReadonly;
  txType?: ETxSenderType;
}

interface IDispatchProps {
  downloadImmutableFile: (fileId: IImmutableFileId, name: string) => void;
  onAccept: () => void;
}

interface IFormikProps {
  acceptAgreement: boolean;
}

interface IAdditionalProps {
  document: IEtoDocument;
}

type TRequiredState = RequiredByKeys<IStateProps, "nomineeEto">;

type TComponentProps = TRequiredState & IDispatchProps & IAdditionalProps;

const SignFormSchema = YupTS.object({
  acceptAgreement: YupTS.onlyTrue(),
});

const SignNomineeAgreementSummaryLayout: React.FunctionComponent<TComponentProps> = ({
  downloadImmutableFile,
  onAccept,
  document,
  txType,
}) => (
  <section
    className="text-center"
    data-test-id={isRAASign(txType) ? "nominee-sign-raaa-modal" : "nominee-sign-tha-modal"}
  >
    <Heading decorator={false} level={2} size={EHeadingSize.HUGE}>
      {isRAASign(txType) ? (
        <FormattedMessage id="nominee.sign-raaa.title" />
      ) : (
        <FormattedMessage id="nominee.sign-tha.title" />
      )}
    </Heading>
    <p className="my-4">
      {isRAASign(txType) ? (
        <FormattedMessage id="nominee.sign-raaa.text" />
      ) : (
        <FormattedMessage id="nominee.sign-tha.text" />
      )}
    </p>
    <DocumentButton
      layout={EButtonLayout.OUTLINE}
      onClick={() =>
        downloadImmutableFile(
          {
            ...{
              ipfsHash: document.ipfsHash,
              mimeType: document.mimeType,
            },
            asPdf: true,
          },
          document.documentType,
        )
      }
      title={
        isRAASign(txType) ? (
          <FormattedMessage id="nominee.sign-raaa.download-raaa" />
        ) : (
          <FormattedMessage id="nominee.sign-tha.download-tha" />
        )
      }
      altIcon={<InlineIcon svgIcon={link} />}
    />

    <Formik<IFormikProps>
      initialValues={{ acceptAgreement: false }}
      onSubmit={onAccept}
      validationSchema={SignFormSchema.toYup()}
    >
      {({ isValid }) => (
        <FormDeprecated>
          <FormFieldBoolean
            className="my-4"
            label={
              isRAASign(txType) ? (
                <FormattedMessage id="nominee.sign-raaa.accept" />
              ) : (
                <FormattedMessage id="nominee.sign-tha.accept" />
              )
            }
            name="acceptAgreement"
            data-test-id="nominee-sign-agreement-accept"
          />

          <Button
            disabled={!isValid}
            type="submit"
            layout={EButtonLayout.PRIMARY}
            data-test-id="nominee-sign-agreement-sign"
          >
            <FormattedMessage id="nominee.sign-agreement.sign" />
          </Button>
        </FormDeprecated>
      )}
    </Formik>
  </section>
);

const SignNomineeAgreementSummary = compose<TComponentProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      nomineeEto: selectActiveNomineeEto(state),
      txType: selectTxType(state),
    }),
    dispatchToProps: dispatch => ({
      downloadImmutableFile: (fileId, name) =>
        dispatch(actions.immutableStorage.downloadImmutableFile(fileId, name)),
      onAccept: () => dispatch(actions.txSender.txSenderAccept()),
    }),
  }),
  branch<IStateProps>(
    state => !state.nomineeEto || !state.txType,
    () => {
      throw new Error("Nominee ETO or Transaction type cannot be empty");
    },
  ),
  withProps<IAdditionalProps, TRequiredState>(props => ({
    document: selectDocument(props.txType, props.nomineeEto),
  })),
)(SignNomineeAgreementSummaryLayout);

export { SignNomineeAgreementSummaryLayout, SignNomineeAgreementSummary };
