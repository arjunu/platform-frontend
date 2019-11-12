import { yupToFormErrors } from "formik";
import * as Yup from "yup";

export type TConversionAndValidationSpec<Data> = {
  validator: Yup.Schema<unknown>;
  conversionFn: (data: Data) => unknown;
};

type TTransformationSpec<T> = {
  [key: string]: (
    validatorFields: { [field in keyof T]: Yup.Schema<any> },
    key: string,
  ) => { [field in keyof T]: Yup.Schema<any> };
};

export type ObjectSchema<T> = Yup.ObjectSchema<T> & {
  fields: { [field in keyof T]: Yup.Schema<T[field]> };
};

export const validateForm = (validator: Yup.Schema<any>, data: any, strict: boolean) => {
  try {
    validator.validateSync(data, { abortEarly: false, strict });
  } catch (e) {
    if (e instanceof Yup.ValidationError) {
      return yupToFormErrors(e);
    }
  }
  return undefined;
};

export const convertAndValidatePipeline = <Data extends {}>(
  validationSpec: TConversionAndValidationSpec<Data>[],
) => (data: Data) => {
  /* we run all validations and collect their results in an array, */
  /* then create and return a single errors object. Flattening of array goes from  */
  /* right to left (reduceRight) because the earlier validations have precedence over the later ones  */
  let validationResults = [];
  for (let { conversionFn, validator } of validationSpec) {
    const converted = conversionFn(data);
    const currentValidationResult = validateForm(validator, converted, true);
    if (currentValidationResult !== undefined) {
      validationResults.push(currentValidationResult);
    }
  }
  return validationResults.reduceRight((acc: object | undefined, result) => {
    if (acc !== undefined) {
      return {
        ...acc,
        ...result,
      };
    } else {
      return result;
    }
  }, undefined);
};

export const replaceValidatorWith = (newValidator: Yup.Schema<unknown>) => <T>(
  validatorFields: { [field in keyof T]: Yup.Schema<T[field]> },
  key: keyof T,
) => {
  (validatorFields[key] as any) = newValidator;
  return validatorFields;
};

export const deleteValidator = () => <T>(
  validatorFields: { [field in keyof T]: Yup.Schema<T[field]> },
  key: keyof T,
) => {
  delete validatorFields[key];
  return validatorFields;
};

export const addValidator = (newValidator: Yup.Schema<unknown>) => (
  validatorFields: { [field: string]: Yup.Schema<unknown> },
  key: string,
) => {
  validatorFields[key] = newValidator;
  return validatorFields;
};

export const transformValidator = <T>(transformationSpec: TTransformationSpec<T>) => (
  baseValidator: Yup.ObjectSchema<T>,
) => {
  if (!(baseValidator instanceof Yup.object)) {
    throw new Error("transformValidator() only works on object schema!");
  }

  const validatorCopy = baseValidator.clone();

  Object.keys(transformationSpec).forEach(key => {
    (validatorCopy as ObjectSchema<unknown>).fields = transformationSpec[key](
      (validatorCopy as ObjectSchema<T>).fields,
      key,
    );
  });

  return validatorCopy as Yup.ObjectSchema<unknown>;
};
