import {
  convertInArray,
  convertNumberToString,
  parseStringToFloat,
  parseStringToInteger,
  removeEmptyKeyValueFields,
} from "../../../utils";

const toFormState = {
  useOfCapitalList: [convertInArray({ shareCapital: convertNumberToString() })],
  companyShareCapital: convertNumberToString(),
  numberOfFounders: convertNumberToString(),
  lastFundingSizeEur: convertNumberToString(),
};

const fromFormState = {
  shareholders: [
    removeEmptyKeyValueFields(),
    convertInArray({ shareCapital: parseStringToInteger() }),
  ],
  companyShareCapital: parseStringToInteger(),
  lastFundingSizeEur: parseStringToFloat(),
  numberOfFounders: parseStringToInteger(),
};

export { toFormState, fromFormState };
