import { mapValues } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import * as Yup from "yup";

import { DeepReadonly, Dictionary, TTranslatedString } from "../types";

export const object = <T extends {}>(objectShape: T) => new ObjectYTS(objectShape);
export const string = <T extends string>() => new StringYTS<T>();
export const wysiwygString = () => new WysiwygStringYTS();
export const url = () => new StringYTS().enhance((v: Yup.StringSchema) => v.url());
export const array = <T extends YTS<any>>(shape: T) => new ArrayYTS(shape);
export const number = () => new NumberYTS();
export const boolean = () => new BooleanYTS();
export const onlyTrue = (message?: TTranslatedString) =>
  new BooleanYTS().enhance(v =>
    v.test(
      "isTrue",
      message || <FormattedMessage id="form.field.error.set-to-true" />,
      value => value === undefined || value === true,
    ),
  );

export type TypeOf<T extends YTS<any>> = DeepReadonly<T["_T"]>;

export type Schema<T> = ObjectYTS<T>;

export function isYTS(schema: any): schema is Schema<any> {
  return schema instanceof YTS;
}

type TypeOfProps<P extends Dictionary<any>> = { [K in keyof P]: TypeOf<P[K]> };

class YTS<T> {
  _T!: T;

  constructor(protected validator: Yup.Schema<any>, protected isRequired = true) {}

  toYup(): Yup.Schema<any> {
    // TODO: should be moved to constructor as each time creating new object is bad for performance
    return this.isRequired ? this.validator.required() : this.validator;
  }

  enhance(updateValidator: (validator: Yup.NumberSchema) => Yup.NumberSchema): YTS<T>;
  enhance(updateValidator: (validator: Yup.StringSchema) => Yup.StringSchema): YTS<T>;
  enhance(updateValidator: (validator: Yup.ArraySchema<T>) => Yup.ArraySchema<T>): YTS<T>;
  enhance(updateValidator: (validator: Yup.ObjectSchema<T>) => Yup.ObjectSchema<T>): YTS<T>;
  enhance(updateValidator: (validator: Schema<T>) => Yup.Schema<T>): YTS<T>;
  enhance(updateValidator: (validator: any) => any): YTS<T> {
    return new YTS<T>(updateValidator(this.validator), this.isRequired);
  }

  optional(): YTS<T | undefined> {
    return new YTS(this.validator, false);
  }
}

class ObjectYTS<T> extends YTS<TypeOfProps<T>> {
  shape: T;
  constructor(shape: T) {
    const validator = Yup.object(mapValues(shape as any, s => s.toYup()));
    super(validator as any);
    this.shape = shape;
  }
}

class StringYTS<T extends string = string> extends YTS<T> {
  constructor() {
    super(Yup.string());
  }
}

class WysiwygStringYTS extends YTS<string> {
  constructor() {
    super(Yup.string().meta({ isWysiwyg: true }));
  }

  max(limit: number): YTS<string> {
    return this.enhance(v =>
      v.max(limit, <FormattedMessage id="form.field.error.wysiwyg-string.max" />),
    );
  }
}

class NumberYTS extends YTS<number> {
  constructor() {
    super(Yup.number());
  }
}

class BooleanYTS extends YTS<boolean> {
  constructor() {
    super(Yup.boolean());
  }
}

class ArrayYTS<T extends YTS<any>> extends YTS<Array<TypeOf<T>>> {
  shape: T;
  constructor(shape: T) {
    const validator = Yup.array().of(shape.toYup());
    super(validator);
    this.shape = shape;
  }

  // override toYup
  toYup(): Yup.Schema<any> {
    if (this.isRequired) {
      // we can't use here .required() since it will throw on empty array. See: https://github.com/jquense/yup/issues/189
      return this.validator.test(
        "required",
        "This field is required",
        val => val !== undefined && val !== null,
      );
    }
    return this.validator;
  }
}
