import {
  convertFractionToPercentage,
  convertInArray,
  convertNumberToString,
  convertPercentageToFraction,
  parseStringToFloat,
  removeEmptyKeyValueFields,
} from "../../../utils";

const toFormState = {
  useOfCapitalList: [
    convertInArray({ percent: [convertFractionToPercentage(), convertNumberToString()] }),
  ],
};

const fromFormState = {
  useOfCapitalList: [
    removeEmptyKeyValueFields(),
    convertInArray({ percent: [parseStringToFloat(), convertPercentageToFraction()] }),
  ],
};

export { toFormState, fromFormState };
