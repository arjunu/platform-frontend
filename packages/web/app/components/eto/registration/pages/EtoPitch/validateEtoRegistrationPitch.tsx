import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import * as Yup from "yup";

import {
  EtoPitchType,
  TPartialCompanyEtoData,
} from "../../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { percentage } from "../../../../../lib/api/util/customSchemas.unsafe";
import { addBigNumbers } from "../../../../../utils/BigNumberUtils";
import {
  convertAndValidatePipeline,
  replaceValidatorWith,
  transformValidator,
} from "../../../../shared/forms/utils";
import {
  convert,
  convertInArray,
  convertPercentageToFraction,
  parseStringToFloat,
  removeEmptyKeyValueFields,
} from "../../../utils";
import { fromFormState } from "./etoRegistrationPitchFormStateConverters";

const HUNDRED_PERCENT = 1; //backend stores percentage as a fraction 0..1
const MIN_KEY_VALUE_ARRAY_LENGTH = 1;

type TEtoCapitalList = {
  percent: number;
  description: string;
};

const EtoCapitalListRequired = Yup.object<TEtoCapitalList>().shape({
  percent: percentage.required(),
  description: Yup.string().required(),
});

const EtoCapitalListNotRequired = Yup.object<TEtoCapitalList>().shape({
  percent: percentage.notRequired(),
  description: Yup.string().notRequired(),
});

const EtoCapitalListValidator = Yup.lazy((value: TEtoCapitalList) => {
  if (value && (value["percent"] !== undefined || value["description"] !== undefined)) {
    return EtoCapitalListRequired;
  } else {
    return EtoCapitalListNotRequired;
  }
});

const validator = Yup.object().shape({
  problemSolved: Yup.string(),
  productVision: Yup.string(),
  inspiration: Yup.string(),
  roadmap: Yup.string(),
  useOfCapital: Yup.string().required(),
  useOfCapitalList: Yup.array()
    .of(EtoCapitalListValidator)
    .min(
      MIN_KEY_VALUE_ARRAY_LENGTH,
      <FormattedMessage id="form.field.error.array.at-least-one-entry-required" />,
    )
    .required(<FormattedMessage id="form.field.error.array.at-least-one-entry-required" />),
  customerGroup: Yup.string(),
  sellingProposition: Yup.string(),
  marketingApproach: Yup.string(),
  companyMission: Yup.string(),
  targetMarketAndIndustry: Yup.string(),
  keyBenefitsForInvestors: Yup.string(),
  keyCompetitors: Yup.string(),
  marketTraction: Yup.string(),
  businessModel: Yup.string(),
});

const percentConversionSpec = [
  parseStringToFloat({ passThroughInvalidData: true }),
  convertPercentageToFraction({ passThroughInvalidData: true }),
];

const amountOfCapitalListValidator = Yup.number()
  .required(<FormattedMessage id="form.field.error.allocation-of-100-percents-of-funds" />)
  .min(
    HUNDRED_PERCENT,
    <FormattedMessage id="form.field.error.allocation-of-100-percents-of-funds" />,
  )
  .max(HUNDRED_PERCENT, <FormattedMessage id="form.field.error.cannot-be-more-than-100-percent" />);

const validatorConversionSpec = {
  useOfCapitalList: replaceValidatorWith(amountOfCapitalListValidator),
};

const conversionSpec1 = {
  useOfCapitalList: [
    removeEmptyKeyValueFields(),
    convertInArray({ percent: percentConversionSpec }),
  ],
};

const conversion2 = (data: TPartialCompanyEtoData) => {
  const dataCopy = convert(conversionSpec1)(data);

  if (dataCopy.useOfCapitalList) {
    dataCopy.useOfCapitalList = dataCopy.useOfCapitalList.reduce(
      // use big number representation to prevent floating points precision errors
      (acc: number, { percent }: { percent: number }) =>
        +addBigNumbers([acc.toString(), percent.toString()]),
      0,
    );
  }

  return dataCopy;
};

export const etoPitchValidationFn = convertAndValidatePipeline([
  { validator, conversionFn: convert(conversionSpec1) },
  {
    validator: transformValidator(validatorConversionSpec)(validator),
    conversionFn: conversion2,
  },
  { validator: EtoPitchType.toYup(), conversionFn: convert(fromFormState) },
]);
