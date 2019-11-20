import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import * as Yup from "yup";

import { MIN_COMPANY_SHARE_CAPITAL } from "../../../../../config/constants";
import { EtoLegalInformationType } from "../../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { currencyCodeSchema, dateSchema } from "../../../../../lib/api/util/customSchemas";
import { convertAndValidatePipeline } from "../../../../shared/forms/utils";
import {
  convert,
  convertInArray,
  parseStringToFloat,
  removeEmptyKeyValueFields,
} from "../../../utils";
import { fromFormState } from "./legalInformationFormStateConverters";

type TShareholdersList = {
  fullName: string;
  shareCapital: number;
};

const ShareholdersListRequired = Yup.object<TShareholdersList>().shape({
  fullName: Yup.string().required(),
  shareCapital: Yup.number().required(),
});

const ShareholdersListNotRequired = Yup.object<TShareholdersList>().shape({
  fullName: Yup.string().notRequired(),
  shareCapital: Yup.number().notRequired(),
});

const ShareholdersListValidator = Yup.lazy((value: TShareholdersList) => {
  if (value && (value["fullName"] !== undefined || value["shareCapital"] !== undefined)) {
    return ShareholdersListRequired;
  } else {
    return ShareholdersListNotRequired;
  }
});

const validator = Yup.object().shape({
  name: Yup.string().required(),
  legalForm: Yup.string().required(),
  companyLegalDescription: Yup.string().required(),
  street: Yup.string().required(),
  country: Yup.string().required(),
  vatNumber: Yup.string(),
  registrationNumber: Yup.string().required(),
  foundingDate: dateSchema(Yup.string()).required(), //todo write a normal method with Yup.addMethod
  numberOfEmployees: Yup.string(),
  companyStage: Yup.string(),
  numberOfFounders: Yup.number(),
  lastFundingSizeEur: Yup.number(),
  companyShareCapital: Yup.number()
    .min(MIN_COMPANY_SHARE_CAPITAL)
    .required(),
  shareCapitalCurrencyCode: currencyCodeSchema(Yup.string()), //todo write an extension method with Yup.addMethod
  shareholders: Yup.array()
    .of(ShareholdersListValidator)
    .required(<FormattedMessage id="form.field.error.array.at-least-one-entry-required" />)
    .min(1, <FormattedMessage id="form.field.error.array.at-least-one-entry-required" />),
});

const conversionSpec1 = {
  ...fromFormState,
  shareholders: [
    removeEmptyKeyValueFields(),
    convertInArray({ shareCapital: parseStringToFloat({ passThroughInvalidData: true }) }),
  ],
};

export const legalInformationValidationFn = convertAndValidatePipeline([
  { validator, conversionFn: convert(conversionSpec1) },
  { validator: EtoLegalInformationType.toYup(), conversionFn: convert(fromFormState) },
]);
