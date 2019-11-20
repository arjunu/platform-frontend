import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Row } from "reactstrap";
import { compose, setDisplayName, withHandlers } from "recompose";

import { actions } from "../../../modules/actions";
import { IGenericModal } from "../../../modules/generic-modal/reducer";
import {
  selectGenericModalComponent,
  selectGenericModalComponentProps,
  selectGenericModalIsOpen,
  selectGenericModalObj,
} from "../../../modules/generic-modal/selectors";
import { appConnect, AppDispatch } from "../../../store";
import { DeepReadonly } from "../../../types";
import { Button } from "../../shared/buttons";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { Modal } from "../Modal";

import * as successIcon from "../../../assets/img/notifications/success.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./GenericModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  genericModalObj?: DeepReadonly<IGenericModal>;
  component?: React.ComponentType<{ closeModal: () => void }>;
  componentProps?: object;
}

interface IHandlersProps {
  closeModal: () => void;
  onClick?: () => void;
}

interface IReduxProps {
  dispatch: AppDispatch;
}

export const genericModalIcons = {
  check: <img src={successIcon} className={styles.icon} alt="" />,
  exclamation: <img src={warningIcon} className={styles.icon} alt="" />,
};

const GenericModalLayout: React.FunctionComponent<IStateProps & IHandlersProps> = ({
  onClick,
  closeModal,
  isOpen,
  genericModalObj,
  component: Component,
  componentProps = {},
}) => (
  <Modal isOpen={isOpen} onClose={closeModal}>
    {Component ? (
      <Component closeModal={closeModal} {...componentProps} />
    ) : (
      <>
        <Row className="mt-5 justify-content-center">
          <h5 data-test-id="components.modals.generic-modal.title">
            {genericModalObj && getMessageTranslation(genericModalObj.title)}
          </h5>
        </Row>

        <Row className="mb-5 justify-content-center">
          <div className={styles.content}>
            {genericModalObj && genericModalObj.icon && genericModalIcons[genericModalObj.icon]}{" "}
            {genericModalObj &&
              genericModalObj.description &&
              getMessageTranslation(genericModalObj.description)}
          </div>
        </Row>

        <Row className="mb-5 justify-content-center">
          <Button onClick={onClick} data-test-id="generic-modal-dismiss-button">
            {genericModalObj && genericModalObj.actionLinkText ? (
              getMessageTranslation(genericModalObj.actionLinkText)
            ) : (
              <FormattedMessage id="modal.generic.button.dismiss" />
            )}
          </Button>
        </Row>
      </>
    )}
  </Modal>
);

const GenericModal = compose<IStateProps & IHandlersProps, {}>(
  setDisplayName("GenericModal"),
  appConnect<IStateProps>({
    stateToProps: state => ({
      isOpen: selectGenericModalIsOpen(state),
      genericModalObj: selectGenericModalObj(state),
      component: selectGenericModalComponent(state),
      componentProps: selectGenericModalComponentProps(state),
    }),
  }),
  withHandlers<IStateProps & IReduxProps, IHandlersProps>({
    closeModal: ({ dispatch }) => () => dispatch(actions.genericModal.hideGenericModal()),
    onClick: ({ genericModalObj, dispatch }) => () => {
      dispatch(actions.genericModal.hideGenericModal());

      if (genericModalObj && genericModalObj.onClickAction) {
        dispatch(genericModalObj.onClickAction);
      }
    },
  }),
)(GenericModalLayout);

export { GenericModal, GenericModalLayout };
