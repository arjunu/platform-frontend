/*
 * Override yup typings to allow TTranslateString as a message
 */

import {
  ArraySchema,
  BooleanSchema,
  DateSchema,
  LocaleObject,
  Message,
  MixedSchema,
  NumberSchema,
  ObjectSchema,
  Ref,
  Schema,
  StringSchema,
  TestContext,
  TestMessageParams,
  ValidationError,
} from "yup";

import { TTranslatedString } from "../app/types";

declare module "yup" {
  type Message =
    | TTranslatedString
    | ((params: object & Partial<TestMessageParams>) => TTranslatedString);

  interface LocaleObjectFixed {
    mixed?: { [key in keyof MixedSchema]?: Message };
    string?: { [key in keyof StringSchema]?: Message };
    number?: { [key in keyof NumberSchema]?: Message };
    boolean?: { [key in keyof BooleanSchema]?: Message };
    bool?: { [key in keyof BooleanSchema]?: Message };
    date?: { [key in keyof DateSchema]?: Message };
    array?: { [key in keyof ArraySchema<any>]?: Message };
    object?: { [key in keyof ObjectSchema<any>]?: Message };
  }

  export interface NumberSchema extends Schema<number> {
    min(limit: number | Ref, message?: Message): NumberSchema;
    max(limit: number | Ref, message?: Message): NumberSchema;
  }

  export interface ArraySchema<T> extends Schema<T[]> {
    min(limit: number | Ref, message?: Message): ArraySchema<T>;
    max(limit: number | Ref, message?: Message): ArraySchema<T>;
  }

  export interface Schema<T> {
    test(
      name: string,
      message: Message,
      test: (
        this: TestContext,
        value?: any,
      ) => boolean | ValidationError | Promise<boolean | ValidationError>,
      callbackStyleAsync?: boolean,
    ): this;
    typeError(message?: TTranslatedString): this;
    required(message?: TTranslatedString): this;
    oneOf(arrayOfValues: any[], message?: TTranslatedString): this;
  }

  export function setLocale(customLocale: LocaleObjectFixed): void;
}
