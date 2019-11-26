import { connect as formikConnect, Field, FieldProps } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { ArrayWithAtLeastOneMember, CommonHtmlProps, TFormikConnect } from "../../../../types";
import { IUploadRequirements, SingleFileUpload } from "../../SingleFileUpload";
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
  uploadRequirements?: IUploadRequirements;
  exactDimensions?: boolean;
}

interface IDispatchProps {
  uploadFile: (file: File, onDone: (error: unknown, fileUrl?: string) => void) => void;
  getFile: (fileUrl: string, onDone: (error: unknown, fileInfo?: unknown) => void) => void;
}

interface IState {
  isUploading: boolean;
}

export interface IImageDimensions {
  width: number;
  height: number;
}

const downloadImage = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = url.substring(url.lastIndexOf("/") + 1);
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const validateExactDimensions = (
  imageDimensions: IImageDimensions,
  requiredDimensions: IImageDimensions,
): boolean =>
  imageDimensions.width === requiredDimensions.width &&
  imageDimensions.height === requiredDimensions.height;

const validateBelowDimensions = (
  imageDimensions: IImageDimensions,
  requiredDimensions: IImageDimensions,
): boolean =>
  imageDimensions.width <= requiredDimensions.width &&
  imageDimensions.height <= requiredDimensions.height;

const getValidator = (exactDimensions: boolean | undefined) => {
  if (exactDimensions) {
    return validateExactDimensions;
  }
  return validateBelowDimensions;
};

export class FormSingleFileUploadComponent extends React.Component<
  IOwnProps & IDispatchProps & CommonHtmlProps & TFormikConnect,
  IState
> {
  state = {
    isUploading: false,
  };

  private validateImage = async (file: File): Promise<boolean> => {
    const { name, formik, dimensions, exactDimensions } = this.props;
    const { setFieldError } = formik;

    formik.setFieldTouched(name, true);

    if (dimensions) {
      const isValid = getValidator(exactDimensions);

      try {
        const readImageResult: IImageDimensions = await readImageAndGetDimensions(file);
        if (!isValid(readImageResult, dimensions)) {
          setFieldError(
            name,
            ((
              <FormattedMessage id="shared.dropzone.upload.image.errors.wrong-dimensions" />
            ) as unknown) as string,
          );
          return false;
        }
      } catch (e) {
        setFieldError(
          name,
          ((
            <FormattedMessage
              id="shared.dropzone.upload.image.errors.error"
              values={{ error: e }}
            />
          ) as unknown) as string,
        );
        return false;
      }
    }

    return true;
  };

  private acceptImage = (file: File) => {
    this.setState({ isUploading: true });
    this.props.uploadFile(file, this.onUploadingDone);
  };

  private onDropFile = async (file: File) => {
    const isValid = await this.validateImage(file);
    if (isValid) {
      this.acceptImage(file);
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
            uploadRequirements={this.props.uploadRequirements}
            label={label}
            file={field.value}
            onDropFile={this.onDropFile}
            className={className}
            style={style}
            disabled={disabled}
            onDownload={() => downloadImage(field.value)}
            onRemove={() => {
              this.setValue("");
            }}
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
    }),
  }),
  formikConnect,
)(FormSingleFileUploadComponent);
