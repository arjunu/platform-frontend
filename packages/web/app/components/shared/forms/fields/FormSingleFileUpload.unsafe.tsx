import { connect as formikConnect, Field, FieldProps } from "formik";
import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../../../modules/actions";
import { ENotificationModalType } from "../../../../modules/notification-modal/actions";
import { appConnect } from "../../../../store";
import { ArrayWithAtLeastOneMember, CommonHtmlProps, TFormikConnect } from "../../../../types";
import { ImageUploadMessage } from "../../../translatedMessages/messages";
import { createMessage, TMessage } from "../../../translatedMessages/utils";
import { SingleFileUpload } from "../../SingleFileUpload";
import {
  generateFileInformationDescription,
  readImageAndGetDimensions,
  TAcceptedFileType,
} from "./utils.unsafe";

interface IOwnProps {
  disabled?: boolean;
  name: string;
  label: string | React.ReactNode;
  acceptedFiles: ArrayWithAtLeastOneMember<TAcceptedFileType>;
  fileFormatInformation?: string;
  "data-test-id"?: string;
  dimensions?: IImageDimensions;
}

interface IDispatchProps {
  uploadFile: (file: File, onDone: (error: unknown, fileUrl?: string) => void) => void;
  getFile: (fileUrl: string, onDone: (error: unknown, fileInfo?: unknown) => void) => void;
  showNotification: (message: TMessage) => void;
}

interface IState {
  isUploading: boolean;
}

export interface IImageDimensions {
  width: number;
  height: number;
}

export class FormSingleFileUploadComponent extends React.Component<
  IOwnProps & IDispatchProps & CommonHtmlProps & TFormikConnect,
  IState
> {
  state = {
    isUploading: false,
  };

  private validateImage = async (file: File): Promise<TMessage | null> => {
    //null for no error -- go style :)
    if (this.props.dimensions) {
      try {
        const readImageResult: IImageDimensions = await readImageAndGetDimensions(file);
        if (
          readImageResult.width === this.props.dimensions.width &&
          readImageResult.height === this.props.dimensions.height
        ) {
          return null;
        } else {
          return createMessage(ImageUploadMessage.IMAGE_UPLOAD_WRONG_IMAGE_DIMENSIONS);
        }
      } catch (e) {
        return createMessage(ImageUploadMessage.IMAGE_UPLOAD_FAILURE_WITH_DETAILS, e.message);
      }
    } else {
      return null;
    }
  };

  private acceptImage = (file: File) => {
    this.setState({ isUploading: true });
    this.props.uploadFile(file, this.onUploadingDone);
  };

  private onDropFile = async (file: File) => {
    const error: TMessage | null = await this.validateImage(file);
    if (!error) {
      this.acceptImage(file);
    } else {
      this.props.showNotification(error);
    }
  };

  private onUploadingDone = (error: unknown, url?: string) => {
    this.setState({ isUploading: false });

    if (!error && url) {
      this.setValue(url);
    }
  };

  private setValue(value?: string): void {
    const { name, formik } = this.props;
    const { setFieldValue } = formik;

    setFieldValue(name, value);
  }

  render(): React.ReactChild {
    const { label, name, acceptedFiles, className, style, disabled } = this.props;

    return (
      <Field
        name={name}
        render={({ field }: FieldProps) => (
          <SingleFileUpload
            name={name}
            data-test-id={this.props["data-test-id"]}
            acceptedFiles={acceptedFiles}
            fileUploading={this.state.isUploading}
            fileFormatInformation={
              this.props.fileFormatInformation ||
              generateFileInformationDescription(this.props.acceptedFiles, this.props.dimensions)
            }
            label={label}
            file={field.value}
            onDropFile={this.onDropFile}
            className={className}
            style={style}
            disabled={disabled}
            removeAction={() => this.setValue(undefined)}
          />
        )}
      />
    );
  }
}

export const FormSingleFileUpload = compose<
  IOwnProps & IDispatchProps & CommonHtmlProps & TFormikConnect,
  IOwnProps & CommonHtmlProps
>(
  appConnect<{}, IDispatchProps, IOwnProps>({
    dispatchToProps: dispatch => ({
      uploadFile: (file, onDone) =>
        dispatch(actions.formSingleFileUpload.uploadFileStart(file, onDone)),
      getFile: (fileUrl, onDone) =>
        dispatch(actions.formSingleFileUpload.getFileStart(fileUrl, onDone)),
      showNotification: (message: TMessage) =>
        dispatch(actions.notificationModal.notify({ type: ENotificationModalType.ERROR, message })),
    }),
  }),
  formikConnect,
)(FormSingleFileUploadComponent);
