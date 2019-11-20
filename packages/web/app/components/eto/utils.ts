import BigNumber from "bignumber.js";
import { cloneDeep, flow, get, set } from "lodash";

import { TCompanyEtoData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { invariant } from "../../utils/invariant";
import { formatFlexiPrecision } from "../../utils/NumberUtils";
import { TShareholder } from "./public-view/LegalInformationWidget";

const HUNDRED_PERCENT = new BigNumber("100");
export const OTHERS_NAME = "Others";

export interface ICompoundField {
  [x: string]: string | number | undefined;
}

//TODO remove it. Data should come from backend with all defaults set
export const applyDefaults = (data: any, defaults: any) => {
  const dataCopy = { ...data };

  return Object.keys(defaults).reduce((acc, key) => {
    if (acc[key] === undefined || acc[key] === null) {
      acc[key] = defaults[key];
    }
    return acc;
  }, dataCopy);
};

/**** DATA CONVERSION FUNCTIONS ****/
export const convert = (conversionSpec: { [key: string]: unknown }) => (data: any) => {
  if (data) {
    const dataCopy = cloneDeep(data);
    Object.keys(conversionSpec).forEach(key => {
      const fieldValue = get(dataCopy, key);
      set(dataCopy, key, convertField(fieldValue, conversionSpec[key]));
    });
    return dataCopy;
  } else {
    return data;
  }
};

const convertField = (input: any, f: any) => {
  if (Array.isArray(f)) {
    return flow(f)(input);
  } else {
    return input !== undefined ? f(input) : input;
  }
};

export const convertInArray = (conversionSpec: any) => (data: {}[]) => {
  if (Array.isArray(data)) {
    return data.map(element => convert(conversionSpec)(element));
  } else {
    return data;
  }
};

const findNonEmptyKeyValueField = (data: ICompoundField | undefined) =>
  data
    ? Object.keys(data).reduce((acc: boolean, key: string) => {
        if (data[key] !== undefined) {
          return true;
        } else {
          return acc;
        }
      }, false)
    : false;

//removes data left from empty key-value fields, e.g. {key:undefined,value:undefined}
export const removeEmptyKeyValueFields = () => (data: ICompoundField[] | undefined) => {
  if (data !== undefined && data !== null) {
    const cleanData = data.filter(field => findNonEmptyKeyValueField(field));
    return cleanData.length ? cleanData : undefined;
  } else {
    return undefined;
  }
};

//removes empty key-value fields, e.g. {key:undefined,value:undefined}
export const removeEmptyKeyValueField = () => (data: ICompoundField | undefined) =>
  findNonEmptyKeyValueField(data) ? data : undefined;

type TConvertPercentageToFractionOptions = { passThroughInvalidData: true };
// add an option to pass invalid values on. This is to be used in validation pipelines
export const convertPercentageToFraction = (options?: TConvertPercentageToFractionOptions) => (
  data: number | undefined,
) => {
  const parseFn = (number: number) => parseFloat((number / 100).toPrecision(4));

  if (options && options.passThroughInvalidData) {
    return typeof data === "number" && Number.isFinite(data) ? parseFn(data) : data;
  } else {
    invariant(
      data === undefined || Number.isFinite(data),
      "convertPercentageToFraction: cannot convert non-number",
    );
    return data !== undefined ? parseFn(data) : data;
  }
};

export const convertFractionToPercentage = () => (data: number | undefined) => {
  invariant(
    data === undefined || Number.isFinite(data),
    "convertFractionToPercentage: cannot convert NaN",
  );
  return data !== undefined ? parseFloat((data * 100).toFixed(2)) : data;
};

type TParseStringToFloatData = string | number | undefined;

type TParseStringToFloatOptions = { passThroughInvalidData: true };

// add an option to pass invalid values on. This is to be used in validation pipelines
export function parseStringToFloat(): (data: TParseStringToFloatData) => number | undefined;
export function parseStringToFloat(
  options: TParseStringToFloatOptions,
): (data: TParseStringToFloatData) => string | number | undefined;
/* tslint:disable:typedef */
export function parseStringToFloat(options?: TParseStringToFloatOptions) {
  return (data: TParseStringToFloatData): number | undefined | string => {
    const result = typeof data === "string" ? parseFloat(data) : data;
    if (Number.isFinite(result!)) {
      return result;
    } else {
      return options && options.passThroughInvalidData ? data : undefined;
    }
  };
}
/* tslint:enable:typedef */

export const parseStringToInteger = () => (data: string | number | undefined) => {
  if (typeof data === "string") {
    const result = parseInt(data, 10);
    return Number.isNaN(result) ? undefined : result;
  } else {
    return data;
  }
};

export const convertNumberToString = () => (data: number | undefined) => {
  invariant(
    data === undefined || Number.isFinite(data),
    "convertNumberToString: cannot convert NaN",
  );
  return data !== undefined ? data.toString() : data;
};

export const convertToPrecision = (precision: number) => (data: number) => {
  if (data && !Number.isNaN(data)) {
    return parseFloat(formatFlexiPrecision(data, precision));
  } else {
    return undefined;
  }
};

export const setDefaultValueIfUndefined = (defaultValue: any) => (data: any) =>
  data === undefined ? defaultValue : data;

export const removeEmptyField = () => (data: any) => {
  if (
    data === "" ||
    (Array.isArray(data) && data.length === 0) ||
    data === null ||
    Number.isNaN(data)
  ) {
    data = undefined;
  }
  return data;
};

export const removeField = () => () => undefined;

// this is to generate unique keys
// that we supply to react elements when mapping over an array of data
export const generateKeys = () => (data: { key: string }[]) =>
  data &&
  data.map(arrayElement => {
    arrayElement.key = Math.random().toString();
    return arrayElement;
  });

// removes unique keys created with generateKeys()
// if API doesn't accept them
export const removeKeys = () => (data: { key: string }[]) =>
  data &&
  data.map(arrayElement => {
    delete arrayElement.key;
    return arrayElement;
  });

type TEtoLegalShareholderTypeNarrowed = {
  fullName: string;
  shareCapital: number;
};

type TChartDataGeneratorInternal = {
  totalPercentage: BigNumber;
  shareholders: TShareholder[];
};

const shareholderSortingFunction = (
  a: TEtoLegalShareholderTypeNarrowed,
  b: TEtoLegalShareholderTypeNarrowed,
) => {
  // Always move Others to end
  if (a.fullName === OTHERS_NAME) {
    return 1;
  }

  if (a.shareCapital === b.shareCapital) {
    return 0;
  } else {
    return a.shareCapital < b.shareCapital ? 1 : -1;
  }
};

export const generateShareholders = (
  shareholders: TCompanyEtoData["shareholders"],
  companyShares: number,
): ReadonlyArray<TShareholder> => {
  if (shareholders === undefined) {
    return [];
  } else {
    const shareholdersData = shareholders.filter(
      (shareholder): shareholder is TEtoLegalShareholderTypeNarrowed =>
        !!(shareholder && shareholder.fullName && shareholder.shareCapital),
    );

    const assignedShares = shareholdersData.reduce(
      (acc, shareholder) => (acc += shareholder.shareCapital),
      0,
    );

    if (assignedShares < companyShares) {
      shareholdersData.push({
        fullName: OTHERS_NAME,
        shareCapital: companyShares - assignedShares,
      });
    }

    const chartData = shareholdersData.sort(shareholderSortingFunction).reduce(
      (
        acc: TChartDataGeneratorInternal,
        shareholder: TEtoLegalShareholderTypeNarrowed,
        index: number,
      ) => {
        if (acc.totalPercentage.lessThan(HUNDRED_PERCENT)) {
          const shareCapitalPercentage = new BigNumber(
            ((shareholder.shareCapital * 100) / companyShares).toString(),
          ).round(2, 4);

          const currentTotalPercentage = acc.totalPercentage.add(shareCapitalPercentage);

          // the last member of array that makes currentTotalPercentage <= 100
          // gets the rest of (100% - shares) to account for the rounding errors,
          // all the following members are not included in the result
          const shareCapitalPercentageCorrected =
            index !== shareholdersData.length - 1 &&
            currentTotalPercentage.lessThanOrEqualTo(HUNDRED_PERCENT)
              ? shareCapitalPercentage
              : HUNDRED_PERCENT.sub(acc.totalPercentage);

          if (shareCapitalPercentageCorrected.greaterThan("0")) {
            acc.shareholders.push({
              fullName: shareholder.fullName,
              percentageOfShares: shareCapitalPercentageCorrected.toNumber(),
            });
          }

          acc.totalPercentage = currentTotalPercentage;
        }
        return acc;
      },
      { totalPercentage: new BigNumber("0"), shareholders: [] },
    );

    return chartData.shareholders;
  }
};
