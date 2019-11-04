import { includes } from "lodash";
import * as moment from "moment";
import * as Yup from "yup";

import {
  getMessageTranslation,
  ValidationMessage,
} from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { ECountries } from "../../../utils/enums/countriesEnum";

/**
 * Date schema
 */
const DATE_SCHEME = "YYYY-M-D";
const parse = (s: string) => moment(s, DATE_SCHEME, true);

export const currencyCodeSchema = (v: Yup.StringSchema) =>
  v.matches(/^[A-Z]{3}$/, {
    message: getMessageTranslation(
      createMessage(ValidationMessage.VALIDATION_CURRENCY_CODE),
    ) as string,
  });

export const dateSchema = (v: Yup.StringSchema) =>
  v
    .transform(
      (_value: unknown, originalValue: string): string => {
        const date = parse(originalValue);
        if (!date.isValid()) {
          return "";
        }
        return date.format(DATE_SCHEME);
      },
    )
    .test(
      "is-valid",
      getMessageTranslation(createMessage(ValidationMessage.VALIDATION_INVALID_DATE)),
      s => parse(s).isValid(),
    );

export const date = dateSchema(Yup.string());

export const personBirthDate = date
  .test(
    "is-old-enough",
    getMessageTranslation(createMessage(ValidationMessage.VALIDATION_MIN_AGE)),
    s => {
      const d = parse(s);
      return d.isValid() && d.isBefore(moment().subtract(18, "years"));
    },
  )
  .test(
    "is-young-enough",
    getMessageTranslation(createMessage(ValidationMessage.VALIDATION_MAX_AGE)),
    s => {
      const d = parse(s);
      return d.isValid() && d.isAfter(moment().subtract(125, "years"));
    },
  );

export const foundingDate = date.test(
  "is-old-enough",
  getMessageTranslation(createMessage(ValidationMessage.VALIDATION_DATE_IN_THE_FUTURE)),
  s => {
    const d = parse(s);
    return d.isValid() && d.isBefore(moment());
  },
);

export const citizen = Yup.bool();

export const countryCode = Yup.string();

export const RESTRICTED_COUNTRIES = [
  ECountries.AFGHANISTAN,
  ECountries.BAHAMAS,
  ECountries.BOTSWANA,
  ECountries.CAMBODIA,
  ECountries.ETHIOPIA,
  ECountries.GHANA,
  ECountries.GUAM,
  ECountries.IRAN,
  ECountries.IRAQ,
  ECountries.LIBYAN_ARAB_JAMAHIRIYA,
  ECountries.NIGERIA,
  ECountries.NORTH_KOREA,
  ECountries.PAKISTAN,
  ECountries.PANAMA,
  ECountries.PUERTO_RICO,
  ECountries.SERBIA,
  ECountries.SRI_LANKA,
  ECountries.SYRIAN_ARAB_REPUBLIC,
  ECountries.TRINIDAD_AND_TOBAGO,
  ECountries.TUNISIA,
  ECountries.YEMEN,
];

export const restrictedCountry = countryCode.test(
  "country",
  getMessageTranslation(createMessage(ValidationMessage.VALIDATION_RESTRICTED_COUNTRY)),
  response => !includes(RESTRICTED_COUNTRIES, response),
);

export const percentage = Yup.number()
  .max(100, (values: unknown) =>
    getMessageTranslation(createMessage(ValidationMessage.VALIDATION_PECENTAGE_MAX, values)),
  )
  .min(0, (values: unknown) =>
    getMessageTranslation(createMessage(ValidationMessage.VALIDATION_PERCENTAGE_MIN, values)),
  );
