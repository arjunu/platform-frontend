import { FormikContext, FormikErrors, FormikTouched } from "formik";
import { get } from "lodash";
import * as React from "react";
import { FormGroup, InputProps } from "reactstrap";
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";
import { Schema } from "yup";

import { ArrayWithAtLeastOneMember, Dictionary, TTranslatedString } from "../../../../types";
import {
  getSchemaField,
  getSchemaMeta,
  getValidationSchema,
  isRequired,
} from "@neufund/shared"
import { ECurrency } from "../../formatters/utils";
import { selectDecimalPlaces } from "../../Money.unsafe";
import { FormFieldLabel } from "./FormFieldLabel";
import { IImageDimensions } from "./FormSingleFileUpload";

export enum EMimeType {
  PDF = "application/pdf",
  JPEG = "image/jpeg",
  JPG = "image/jpg",
  PNG = "image/png",
  SVG = "image/svg+xml",
  ANY_IMAGE_TYPE = "image/*",
}

export type TAcceptedFileType = EMimeType & string;

export interface IFormField {
  name: string;
  label?: TTranslatedString;
}

export const withFormField = (
  Component: React.ComponentType<any>,
): React.FunctionComponent<Dictionary<any> & IFormField> => ({ label, name, ...inputProps }) => (
  <FormGroup>
    {label && <FormFieldLabel name={name}>{label}</FormFieldLabel>}
    <Component name={name} {...inputProps} />
  </FormGroup>
);

/* The function that encapsulates the logic of determining a value for Input field valid property. Note we have to
   return boolean | undefined value. Undefined should be returned when the field has not been touched by the user. */
export const isValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  key: string,
  submitCount: number,
  ignoreTouched?: boolean,
): boolean | undefined => {
  if (ignoreTouched) return !get(errors, key);

  if (get(touched, key) || submitCount > 0) {
    return !(errors && get(errors, key));
  }

  return undefined;
};

export const isNonValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  name: string,
  submitCount: number,
  ignoreTouched?: boolean,
): boolean => {
  const valid = isValid(touched, errors, name, submitCount, ignoreTouched);

  return !(valid === undefined || valid === true);
};

export const applyCharactersLimit = (val: InputProps["value"] = "", limit: number | undefined) => {
  if (typeof val === "number" || Array.isArray(val) || !limit) {
    return val;
  }

  return limit && val.length > limit ? val.slice(0, limit) : val;
};

export const withCountedCharacters = (val: InputProps["value"] = "", limit: number) => {
  if (typeof val !== "string") {
    throw new Error("Only strings are supported for character counters");
  }

  return `${val.length}/${limit}`;
};

export const isFieldRequired = (
  validationSchema: any,
  name: string,
  context?: FormikContext<any>,
) => {
  if (validationSchema) {
    const schema = getValidationSchema(validationSchema);
    const fieldSchema = getSchemaField(name, schema, context);
    return isRequired(fieldSchema);
  } else {
    return false;
  }
};

export const isWysiwyg = <T extends any>(validationSchema: Schema<T>, name: string) => {
  if (validationSchema) {
    const schema = getValidationSchema(validationSchema);
    const fieldSchema = getSchemaField(name, schema);

    const meta = fieldSchema ? getSchemaMeta(fieldSchema) : undefined;

    return meta ? meta.isWysiwyg : false;
  } else {
    return false;
  }
};

export const generateMaskFromCurrency = (currency: ECurrency, isPrice?: boolean) => {
  const decimalLimit = selectDecimalPlaces(currency, isPrice);
  const integerLimit = 15 - decimalLimit; // when over 16 digits Formik starts to throw errors
  return createNumberMask({
    prefix: "",
    thousandsSeparatorSymbol: " ",
    allowDecimal: true,
    decimalLimit,
    integerLimit,
  });
};

const mapMimeTypeToExtension = (mimeType: EMimeType): string => {
  const mime2Extension: { [key: string]: string } = {
    [EMimeType.PDF]: "pdf",
    [EMimeType.JPEG]: "jpeg",
    [EMimeType.JPG]: "jpg",
    [EMimeType.PNG]: "png",
    [EMimeType.SVG]: "svg",
  };
  return mime2Extension[mimeType];
};

export const generateFileInformationDescription = (
  acceptedFiles: ArrayWithAtLeastOneMember<TAcceptedFileType>,
  dimensions?: IImageDimensions,
): string => {
  const chooseDelimiter = (index: number, length: number) => {
    if (index === 0) {
      return "";
    } else if (index !== 0 && index === length - 1) {
      return " or ";
    } else {
      return ", ";
    }
  };

  const imageDimensions = dimensions ? `${dimensions.width}px × ${dimensions.height}px, ` : "";

  const fileTypes = acceptedFiles.reduce(
    (acc: string, mimeType: EMimeType, index: number): string => {
      // insert 'or' before last one, otherwise ', ': 'pdf, jpg or gif'
      acc += `${chooseDelimiter(index, acceptedFiles.length)}${mapMimeTypeToExtension(mimeType)}`;
      return acc;
    },
    "",
  );

  return `${imageDimensions}${fileTypes}`;
};

// todo write a unit test.
//  This involves providing URL.createObjectUrl and Image events polyfills
//  because jsdom doesn't have them
const onImageLoad = (image: HTMLImageElement): Promise<IImageDimensions> =>
  new Promise((resolve, reject) => {
    image.onload = (e: Event) => {
      if (e.target !== null) {
        return resolve({
          width: ((e.target as HTMLImageElement) as IImageDimensions).width,
          height: ((e.target as HTMLImageElement) as IImageDimensions).height,
        });
      } else {
        return reject(new Error("image upload failed"));
      }
    };
    image.onerror = () => reject(new Error("could not read this image"));
    image.onabort = () => reject(new Error("image upload has been aborted"));
  });

export const readImageAndGetDimensions = (file: File): Promise<IImageDimensions> => {
  const image = new Image();
  image.src = URL.createObjectURL(file);

  return onImageLoad(image).then(res => {
    URL.revokeObjectURL(image.src);
    return res;
  });
};
