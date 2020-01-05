import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { actions } from "../../../modules/actions";
import {
  selectFileUploadAction,
  selectIsIpfsModalOpen,
} from "../../../modules/eto-documents/selectors";
import { appConnect } from "../../../store";
import { Modal } from "../../modals/Modal";
import { ButtonArrowRight } from "../../shared/buttons/index";
import { ResponsiveImage } from "../../shared/ResponsiveImage";

import ipfsImage from "../../../assets/img/ipfs.png";
import * as styles from "./EtoFileIpfsModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  onContinue?: () => void;
}

interface IDispatchProps {
  onDismiss: () => void;
}

export const EtoFileIpfsModalComponent: React.FunctionComponent<IStateProps & IDispatchProps> = ({
  onDismiss,
  isOpen,
  onContinue,
}) => (
  <Modal isOpen={isOpen} onClose={onDismiss}>
    <Row className="mb-5 justify-content-center">
      <Col xs={11} className="d-flex justify-content-center">
        <ResponsiveImage
          srcSet={{ "1x": ipfsImage }}
          alt="ipfs Image"
          theme="light"
          width={375}
          height={208}
        />
      </Col>
    </Row>
    <Row className="mb-3 justify-content-center">
      <Col xs={11} className={styles.content}>
        <FormattedMessage id="modal.ipfs-eto.description" />
      </Col>
    </Row>
    <Row className="mb-3 justify-content-center">
      <ButtonArrowRight onClick={onContinue} data-test-id="documents-ipfs-modal-continue">
        <FormattedMessage id="modal.ipfs-eto.button.continue" />
      </ButtonArrowRight>
    </Row>
  </Modal>
);

export const EtoFileIpfsModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: selectIsIpfsModalOpen(s.etoDocuments),
    onContinue: selectFileUploadAction(s.etoDocuments),
  }),
  dispatchToProps: dispatch => ({
    onDismiss: () => dispatch(actions.etoDocuments.hideIpfsModal()),
  }),
})(EtoFileIpfsModalComponent);
