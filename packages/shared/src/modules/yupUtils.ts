import { FormikContext, isFunction } from "formik";
import { compose, includes, mapValues, pick } from "lodash/fp";
import { MixedSchema, object, ObjectSchema, reach, Schema } from "yup";

const getSchemaTests = <T>(schema: Schema<T>): string[] => schema.describe().tests;

export const getSchemaMeta = <T>(schema: Schema<T>): any => schema.describe().meta;

const getSchemaFields = <T>(schema: Schema<T>): { [field in keyof T]: Schema<T[field]> } =>
  (schema as any).fields;

// To have conditional schema resolved correctly we need to pass values
export const getSchemaField = <T>(
  name: string,
  schema: Schema<T> | undefined,
  context?: FormikContext<any>,
) => schema && reach(schema, name, context ? context.values : undefined);

export const isRequired = compose(
  includes("required"),
  getSchemaTests,
);

// TODO: Refactor to use Yup's `describe` method
const findSchemaConstraint = (constraintName: string, schema: any) => {
  const schemaTest = schema && schema.tests.find((test: any) => test.TEST_NAME === constraintName);

  return schemaTest && schemaTest.TEST.params[constraintName];
};

export const findMin = (schema: any) => findSchemaConstraint("min", schema);

export const findMax = (schema: any) => findSchemaConstraint("max", schema);

/**
 * Loops through object schema fields and marks them as required
 */
export const makeAllRequired = (schema: ObjectSchema<any>): ObjectSchema<any> => {
  const oldFields: { [key: string]: MixedSchema } = (schema as any).fields;
  const newFields = mapValues(s => s.required(), oldFields);
  return object(newFields);
};

export const makeAllRequiredExcept = (
  schema: ObjectSchema<any>,
  keys: string[],
): ObjectSchema<any> => {
  const oldFields: { [key: string]: MixedSchema } = (schema as any).fields;
  const newFields = mapValues((s, ...rest) => {
    const [key]: string[] = rest;

    if (keys.includes(key)) {
      return s;
    }

    return s.required();
  }, oldFields);
  return object(newFields);
};

/**
 * Picks only values defined in schema
 */
export const pickSchemaValues = <T extends object, R extends T>(
  schema: Schema<T>,
  values: R,
): T => {
  const schemaKeys = Object.keys(getSchemaFields(schema)) as (keyof T)[];

  return pick<R, keyof T>(schemaKeys, values);
};

export const getValidationSchema = <T>(schema: Schema<T> | (() => Schema<T>)): Schema<T> =>
  isFunction(schema) ? schema() : schema;
