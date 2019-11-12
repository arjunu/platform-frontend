import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { Message } from "../../modals/Message";
import { Button, EButtonLayout, EButtonTheme } from "../../shared/buttons";

import * as tosImg from "../../../assets/img/tos.jpg";
import * as styles from "./DocumentConfidentialityAgreementModal.module.scss";

interface IExternalProps {
  closeModal: () => void;
  companyName: TTranslatedString;
  documentTitle: TTranslatedString;
}

interface IDispatchProps {
  confirm: () => void;
}

const DocumentConfidentialityAgreementModalLayout: React.FunctionComponent<
  IExternalProps & IDispatchProps
> = ({ closeModal, confirm, companyName, documentTitle }) => (
  <Message
    data-test-id="eto.document-confidentiality-agreement-modal"
    image={<img src={tosImg} className={styles.image} alt="" />}
    title={<FormattedMessage id="eto.document-confidentiality-agreement-modal.title" />}
    text={
      <FormattedMessage
        id="eto.document-confidentiality-agreement-modal.text"
        values={{
          companyName: <strong>{companyName}</strong>,
          documentTitle: <strong>{documentTitle}</strong>,
        }}
      />
    }
  >
    <div className={styles.buttonBlock}>
      <Button
        onClick={closeModal}
        layout={EButtonLayout.PRIMARY}
        data-test-id="eto.document-confidentiality-agreement-modal.deny"
      >
        <FormattedMessage id="eto.document-confidentiality-agreement-modal.deny" />
      </Button>
      <Button
        onClick={confirm}
        layout={EButtonLayout.PRIMARY}
        theme={EButtonTheme.BRAND}
        data-test-id="eto.document-confidentiality-agreement-modal.confirm"
      >
        <FormattedMessage id="eto.document-confidentiality-agreement-modal.confirm" />
      </Button>
    </div>
  </Message>
);

const DocumentConfidentialityAgreementModal = appConnect<{}, IDispatchProps, IExternalProps>({
  dispatchToProps: dispatch => ({
    confirm: () => dispatch(actions.eto.confirmConfidentialityAgreement()),
  }),
})(DocumentConfidentialityAgreementModalLayout);

export { DocumentConfidentialityAgreementModal, DocumentConfidentialityAgreementModalLayout };
