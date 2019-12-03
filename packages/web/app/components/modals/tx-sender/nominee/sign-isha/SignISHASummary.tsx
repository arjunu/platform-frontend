import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { EEtoDocumentType } from "../../../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../../../modules/actions";
import {
  selectNomineeAcceptIshaUploadedFileName,
  selectNomineeAcceptIshaUploadState,
  selectNomineeActiveEtoPreviewCode,
} from "../../../../../modules/nominee-flow/selectors";
import { appConnect } from "../../../../../store";
import { EProcessState } from "../../../../../utils/enums/processStates";
import { nonNullable } from "../../../../../utils/nonNullable";
import { Button, EButtonLayout } from "../../../../shared/buttons/Button";
import { DocumentUploadableTile } from "../../../../shared/DocumentUploadable";
import { EHeadingSize, Heading } from "../../../../shared/Heading";

import * as styles from "./SignISHASummary.module.scss";

interface IDispatchProps {
  onAccept: () => void;
  startDocumentRemove: (previewCode: string) => void;
  onDropFile: (file: File, documentType: EEtoDocumentType) => void;
}

type TStateProps = {
  previewCode: ReturnType<typeof selectNomineeActiveEtoPreviewCode>;
  uploadState: ReturnType<typeof selectNomineeAcceptIshaUploadState>;
  uploadedFileName: ReturnType<typeof selectNomineeAcceptIshaUploadedFileName>;
};

type TComponentProps = {
  previewCode: string;
  uploadState: EProcessState;
  uploadedFileName: string | undefined;
} & IDispatchProps;

const SignNomineeISHASummaryLayout: React.FunctionComponent<TComponentProps> = ({
  onAccept,
  uploadState,
  previewCode,
  startDocumentRemove,
  uploadedFileName,
  onDropFile,
}) => {
  const uploadSuccessful = uploadState === EProcessState.SUCCESS;
  return (
    <section className={styles.sectionLayout} data-test-id="nominee-sign-isha-modal">
      <Heading decorator={false} level={2} size={EHeadingSize.HUGE}>
        <FormattedMessage id="nominee.sign-isha.title" />
      </Heading>
      <p>
        <FormattedMessage id="nominee.sign-isha.text" />
      </p>
      <DocumentUploadableTile
        documentKey={EEtoDocumentType.SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT}
        active={true}
        busy={uploadState === EProcessState.IN_PROGRESS}
        typedFileName={
          <FormattedMessage id="eto.documents.signed-investment-and-shareholder-agreement" />
        }
        isFileUploaded={uploadSuccessful}
        documentDownloadLinkInactive={!uploadSuccessful}
        startDocumentRemove={() => startDocumentRemove(previewCode)}
        uploadedFileName={uploadedFileName}
        onDropFile={onDropFile}
      />
      <p className={styles.hashError} data-test-id="nominee-sign-agreement.hashes-dont-match">
        {uploadState === EProcessState.ERROR && (
          <FormattedHTMLMessage
            tagName="span"
            id="eto.documents.signed-investment-and-shareholder-agreement.hashes-dont-match"
            values={{ uploadedFileName }}
          />
        )}
      </p>
      <Button
        disabled={!uploadSuccessful}
        type="submit"
        layout={EButtonLayout.PRIMARY}
        data-test-id="nominee-sign-agreement-sign"
        onClick={onAccept}
      >
        <FormattedMessage id="nominee.sign-agreement.sign" />
      </Button>
    </section>
  );
};

const SignNomineeISHASummary = compose<TComponentProps, {}>(
  appConnect<TStateProps, IDispatchProps>({
    stateToProps: state => ({
      previewCode: nonNullable(selectNomineeActiveEtoPreviewCode(state)),
      uploadedFileName: selectNomineeAcceptIshaUploadedFileName(state),
      uploadState: nonNullable(selectNomineeAcceptIshaUploadState(state)),
    }),
    dispatchToProps: dispatch => ({
      onAccept: () => dispatch(actions.txSender.txSenderAccept()),
      onDropFile: (file, documentType) =>
        dispatch(actions.nomineeFlow.nomineeUploadIsha(file, documentType)),
      startDocumentRemove: previewCode =>
        dispatch(actions.nomineeFlow.nomineeRemoveUploadedIsha(previewCode)),
    }),
  }),
)(SignNomineeISHASummaryLayout);

export { SignNomineeISHASummaryLayout, SignNomineeISHASummary };
