import * as React from "react";
import { Modal } from "reactstrap";

import { actions } from "../../../modules/actions";
import {
  IVideoModal,
  selectVideoModalIsOpen,
  selectVideoModalObj,
} from "../../../modules/video-modal/reducer";
import { appConnect } from "../../../store";
import { Proportion } from "../../shared/Proportion";

interface IStateProps {
  isOpen: boolean;
  videoModalObj?: IVideoModal;
}

interface IDispatchProps {
  onDismiss: () => void;
}

const VideoModalComponent: React.FunctionComponent<IStateProps & IDispatchProps> = ({
  onDismiss,
  isOpen,
  videoModalObj,
}) => (
  <Modal isOpen={isOpen} toggle={onDismiss} centered>
    {videoModalObj && videoModalObj.youTubeUrl && (
      <Proportion width={720} height={405}>
        <iframe src={videoModalObj.youTubeUrl} allowFullScreen />
      </Proportion>
    )}
  </Modal>
);

export const VideoModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: selectVideoModalIsOpen(s.videoModal),
    videoModalObj: selectVideoModalObj(s.videoModal),
  }),
  dispatchToProps: dispatch => ({
    onDismiss: () => dispatch(actions.videoModal.hideVideoModal()),
  }),
})(VideoModalComponent);
