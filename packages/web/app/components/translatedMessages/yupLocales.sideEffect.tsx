// tslint:disable:no-any-on-steroid

import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setLocale } from "yup";

const mixed = {
  default: (values: any) => <FormattedMessage id={"form.field.error.default"} values={values} />,
  required: (values: any) => <FormattedMessage id={"form.field.error.required"} values={values} />,
  oneOf: (values: any) => <FormattedMessage id={"form.field.error.one-of"} values={values} />,
  notOneOf: (values: any) => (
    <FormattedMessage id={"form.field.error.not-one-of"} values={values} />
  ),
  notType: (values: any) => <FormattedMessage id={"form.field.error.not-type"} values={values} />,
};

const string = {
  length: (values: any) => (
    <FormattedMessage id={"form.field.error.string.length"} values={values} />
  ),
  min: (values: any) => <FormattedMessage id={"form.field.error.string.min"} values={values} />,
  max: (values: any) => <FormattedMessage id={"form.field.error.string.max"} values={values} />,
  matches: (values: any) => (
    <FormattedMessage id={"form.field.error.string.matches"} values={values} />
  ),
  email: (values: any) => <FormattedMessage id={"form.field.error.string.email"} values={values} />,
  url: (values: any) => <FormattedMessage id={"form.field.error.string.url"} values={values} />,
  trim: (values: any) => <FormattedMessage id={"form.field.error.string.trim"} values={values} />,
  lowercase: (values: any) => (
    <FormattedMessage id={"form.field.error.string.lowercase"} values={values} />
  ),
  uppercase: (values: any) => (
    <FormattedMessage id={"form.field.error.string.uppercase"} values={values} />
  ),
};

const number = {
  min: (values: any) => <FormattedMessage id={"form.field.error.number.min"} values={values} />,
  max: (values: any) => <FormattedMessage id={"form.field.error.number.max"} values={values} />,
  lessThan: (values: any) => (
    <FormattedMessage id={"form.field.error.number.less-than"} values={values} />
  ),
  moreThan: (values: any) => (
    <FormattedMessage id={"form.field.error.number.more-than"} values={values} />
  ),
  notEqual: (values: any) => (
    <FormattedMessage id={"form.field.error.number.not-equal"} values={values} />
  ),
  positive: (values: any) => (
    <FormattedMessage id={"form.field.error.number.positive"} values={values} />
  ),
  negative: (values: any) => (
    <FormattedMessage id={"form.field.error.number.negative"} values={values} />
  ),
  integer: (values: any) => (
    <FormattedMessage id={"form.field.error.number.integer"} values={values} />
  ),
};

const date = {
  min: (values: any) => <FormattedMessage id={"form.field.error.date.min"} values={values} />,
  max: (values: any) => <FormattedMessage id={"form.field.error.date.max"} values={values} />,
};

const boolean = {};

const object = {
  noUnknown: (values: any) => (
    <FormattedMessage id={"form.field.error.object.no-unknown"} values={values} />
  ),
};

const array = {
  min: (values: any) => <FormattedMessage id={"form.field.error.array.min"} values={values} />,
  max: (values: any) => <FormattedMessage id={"form.field.error.array.max"} values={values} />,
};

setLocale({
  mixed,
  string,
  number,
  date,
  object,
  array,
  boolean,
});
