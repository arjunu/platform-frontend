import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { EKycRequestType, IKycFileInfo } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { Button } from "../../shared/buttons";
import { EButtonLayout, EButtonSize } from "../../shared/buttons/Button";
import { ButtonGroup } from "../../shared/buttons/ButtonGroup";
import { EMimeType } from "../../shared/forms/fields/utils.unsafe";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { KycStep } from "../shared/KycStep";

import * as styles from "./Start.module.scss";

interface IStateProps {
  fileUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  onDone: () => void;
  onDropFile: (file: File) => void;
  goBack: () => void;
  goToDashboard: () => void;
}

interface IProps {
  layout: EKycRequestType;
}

type TComponentProps = IProps & IStateProps & IDispatchProps;

export const KYCUploadComponent: React.FunctionComponent<TComponentProps> = props => (
  <>
    <KycStep
      step={4}
      allSteps={5}
      title={<FormattedMessage id="kyc.personal.manual-verification.title" />}
      description={<FormattedMessage id="kyc.personal.manual-verification.description" />}
      buttonAction={() => props.goToDashboard()}
    />

    <MultiFileUpload
      acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
      onDropFile={props.onDropFile}
      uploadType={EKycRequestType.INDIVIDUAL}
      files={props.files}
      fileUploading={props.fileUploading}
      data-test-id="kyc-personal-upload-dropzone"
      layout="vertical"
    />

    <ButtonGroup className={styles.buttons}>
      <Button
        layout={EButtonLayout.OUTLINE}
        size={EButtonSize.HUGE}
        className={styles.button}
        data-test-id="kyc-personal-start-go-back"
        onClick={props.goBack}
      >
        <FormattedMessage id="form.back" />
      </Button>
      <Button
        layout={EButtonLayout.PRIMARY}
        size={EButtonSize.HUGE}
        className={styles.button}
        onClick={props.onDone}
        disabled={!props.files || props.files.length === 0}
        data-test-id="kyc-personal-upload-submit"
      >
        <FormattedMessage id="form.button.submit-request" />
      </Button>
    </ButtonGroup>
  </>
);

export const KYCPersonalUpload = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      files: state.kyc.individualFiles,
      filesLoading: !!state.kyc.individualFilesLoading,
      fileUploading: !!state.kyc.individualFileUploading,
    }),
    dispatchToProps: dispatch => ({
      onDone: () => dispatch(actions.kyc.kycSubmitIndividualRequest()),
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadIndividualDocument(file)),
      goBack: () => dispatch(actions.routing.goToKYCIndividualDocumentVerification()),
      goToDashboard: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualDocumentList()),
  }),
)(KYCUploadComponent);
