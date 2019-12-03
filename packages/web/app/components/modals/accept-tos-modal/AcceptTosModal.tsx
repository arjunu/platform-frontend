import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../config/externalRoutes";
import { actions } from "../../../modules/actions";
import { selectIsAgreementAccepted } from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { Button, EButtonLayout } from "../../shared/buttons/index";
import { ExternalLink } from "../../shared/links/ExternalLink";
import { Message } from "../message/Message";
import { Modal } from "../Modal";

import * as tosImg from "../../../assets/img/tos.jpg";
import * as styles from "./AcceptTosModal.module.scss";

interface IStateProps {
  isOpen: boolean;
}

interface IDispatchProps {
  onAccept: () => void;
  onLogout: () => void;
}

export const AcceptTosModalComponent: React.FunctionComponent<IStateProps & IDispatchProps> = ({
  onLogout,
  onAccept,
  isOpen,
}) => (
  <Modal isOpen={isOpen}>
    <Message
      data-test-id="modals.accept-tos"
      image={<img src={tosImg} className={styles.image} alt="" />}
      title={<FormattedMessage id="settings.modal.accept-tos.title" />}
      text={<FormattedMessage id="settings.modal.accept-tos.text" />}
    >
      <ExternalLink href={externalRoutes.tos} className={styles.tosLink}>
        <FormattedMessage id="common.links.terms-of-use" values={{ href: externalRoutes.tos }} />
      </ExternalLink>
      <div className={styles.buttonBlock}>
        <Button onClick={onLogout} layout={EButtonLayout.OUTLINE}>
          <FormattedMessage id="settings.modal.accept-tos.logout-button" />
        </Button>
        <Button
          onClick={onAccept}
          layout={EButtonLayout.PRIMARY}
          data-test-id="modals.accept-tos.accept-button"
        >
          <FormattedMessage id="settings.modal.accept-tos.accept-button" />
        </Button>
      </div>
    </Message>
  </Modal>
);

export const AcceptTosModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: !selectIsAgreementAccepted(s),
  }),
  dispatchToProps: dispatch => ({
    onAccept: () => dispatch(actions.tosModal.acceptCurrentTos()),
    onLogout: () => dispatch(actions.auth.logout()),
  }),
})(AcceptTosModalComponent);
