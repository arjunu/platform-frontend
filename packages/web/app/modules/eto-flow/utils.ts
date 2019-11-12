import { sortBy } from "lodash/fp";
import * as Yup from "yup";

import {
  EtoCompanyInformationType,
  EtoEquityTokenInfoType,
  EtoInvestmentTermsType,
  EtoKeyIndividualsType,
  EtoLegalInformationType,
  EtoMarketingDataType,
  EtoMediaType,
  EtoPitchType,
  EtoRiskAssessmentType,
  EtoVotingRightsType,
  getEtoTermsSchema,
  TBookbuildingStatsType,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EProductName, TEtoProduct } from "../../lib/api/eto/EtoProductsApi.interfaces";

function getErrorsNumber(validator: Yup.Schema<any>, data?: any): number {
  try {
    validator.validateSync(data, { abortEarly: false });
    return 0;
  } catch (e) {
    return e.errors.length;
  }
}

export interface IProgressOptions {
  ignore: any;
}

export type ProgressCalculator = (formState: any, initialData?: any) => number;

// recursively clones a YUP Schema and makes number and string properties required
export function updateValidator(objectSchema: any, ignore: any): any {
  const type = objectSchema._type;
  if (ignore !== true) {
    switch (type) {
      case "object":
        for (const prop in objectSchema.fields) {
          // need to clone before change
          const schema = (objectSchema.fields[prop] = objectSchema.fields[prop].clone());
          updateValidator(schema, ignore && ignore[prop]);
        }
        break;
      case "array":
        // need to clone before change
        objectSchema._subType = objectSchema._subType.clone();
        updateValidator(objectSchema._subType, ignore && ignore[0]);
        break;
      case "string":
      case "number":
        objectSchema.withMutation((schema: any) => schema.required());
    }
  }
}

// recursively create initial data from current values
function updateInitialData(initialData: any, currentValue: any): any {
  if (Array.isArray(currentValue)) {
    return currentValue.map((_, i) => updateInitialData({}, currentValue[i]));
  } else if (typeof currentValue === "object") {
    for (const prop in currentValue) {
      if (currentValue.hasOwnProperty(prop)) {
        initialData[prop] = updateInitialData({}, currentValue && currentValue[prop]);
      }
    }
    return initialData;
  }
}

export function getInitialDataForFractionCalculation(formState: any): any {
  return updateInitialData({}, formState);
}

export const etoMediaProgressOptions: IProgressOptions = {
  ignore: {
    companyVideo: true,
    companySlideshare: true,
    companyPitchdeckUrl: {
      title: true,
    },
  },
};

export const etoInvestmentTermsProgressOptions: IProgressOptions = {
  ignore: {
    discountScheme: true,
    fixedSlotsMaximumDiscountFraction: true,
    newSharesToIssueInFixedSlots: true,
    publicDiscountFraction: true,
    whitelistDiscountFraction: true,
    newSharesToIssueInWhitelist: true,
    authorizedCapital: true,
  },
};

export const calculateCompanyInformationProgress = getFormFractionDoneCalculator(
  EtoCompanyInformationType.toYup(),
);
export const calculateEtoTermsProgress = getFormFractionDoneCalculator(getEtoTermsSchema().toYup());
export const calculateEtoKeyIndividualsProgress = getFormFractionDoneCalculator(
  EtoKeyIndividualsType.toYup(),
);
export const calculateLegalInformationProgress = getFormFractionDoneCalculator(
  EtoLegalInformationType.toYup(),
);
export const calculateProductVisionProgress = getFormFractionDoneCalculator(EtoPitchType.toYup());
export const calculateEtoMediaProgress = getFormFractionDoneCalculator(
  EtoMediaType.toYup(),
  etoMediaProgressOptions,
);
export const calculateEtoRiskAssessmentProgress = getFormFractionDoneCalculator(
  EtoRiskAssessmentType.toYup(),
);
export const calculateEtoVotingRightsProgress = getFormFractionDoneCalculator(
  EtoVotingRightsType.toYup(),
);
export const calculateEtoEquityTokenInfoProgress = getFormFractionDoneCalculator(
  EtoEquityTokenInfoType.toYup(),
);
export const calculateInvestmentTermsProgress = getFormFractionDoneCalculator(
  EtoInvestmentTermsType.toYup(),
  etoInvestmentTermsProgressOptions,
);

export const calculateMarketingEtoData = getFormFractionDoneCalculator(
  EtoMarketingDataType.toYup(),
  {
    ignore: true,
  },
);

export const calculateVotingRightsEtoData = getFormFractionDoneCalculator(
  EtoVotingRightsType.toYup(),
  {
    ignore: true,
  },
);

export const calculateEtoInvestmentTermsData = getFormFractionDoneCalculator(
  EtoInvestmentTermsType.toYup(),
  {
    ignore: true,
  },
);

export const calculateEtoTermsData = getFormFractionDoneCalculator(getEtoTermsSchema().toYup(), {
  ignore: true,
});

export function getFormFractionDoneCalculator(
  validator: Yup.Schema<any>,
  opts?: IProgressOptions,
): ProgressCalculator {
  const strictValidator = validator.clone();
  const ignore = opts && opts.ignore;

  updateValidator(strictValidator, ignore);

  return (formState: any, initialData?: any) => {
    if (initialData === undefined) {
      initialData = updateInitialData({}, formState);
    }

    const errors = getErrorsNumber(strictValidator, formState) || 0;
    const maxErrors = getErrorsNumber(strictValidator, initialData) || 1;

    const result = 1 - errors / maxErrors;
    if (result < 0) return 0;
    return result;
  };
}

export const bookBuildingStatsToCsvString = (stats: TBookbuildingStatsType[]) =>
  [`email,amount,"submitted on","updated on"`]
    .concat(
      stats.map(
        (el: TBookbuildingStatsType) =>
          `${el.email ? `"${el.email}"` : "(anonymous pledge)"},${
            el.amountEur
          },${el.insertedAt.slice(0, 10)},${el.updatedAt.slice(0, 10)}`,
      ),
    )
    .join("\r\n");

export const createCsvDataUri = (dataAsString: string) =>
  `data:text/csv,${encodeURIComponent(dataAsString)}`;

export const downloadFile = (uri: string, filename: string) => {
  const link = document.createElement("a");
  link.href = uri;
  link.download = filename;
  link.click();
};

export const isValidEtoStartDate = (startDate: Date, dateToWhitelistMinDurationSec: number) => {
  const startTimeSec = startDate.getTime() / 1000;
  const nowSec = Date.now() / 1000;
  return dateToWhitelistMinDurationSec + nowSec < startTimeSec;
};

const PRODUCTS_SORT_ORDER: EProductName[] = [
  EProductName.MINI_ETO_LI,
  EProductName.HNWI_ETO_LI,
  EProductName.HNWI_ETO_DE,
  EProductName.RETAIL_ETO_DE,
  EProductName.RETAIL_ETO_LI_VMA,
  EProductName.RETAIL_ETO_LI_SECURITY,
];

export const sortProducts = sortBy((product: TEtoProduct) => {
  const index = PRODUCTS_SORT_ORDER.indexOf(product.name);

  if (index === -1) {
    return PRODUCTS_SORT_ORDER.length;
  }

  return index;
});
