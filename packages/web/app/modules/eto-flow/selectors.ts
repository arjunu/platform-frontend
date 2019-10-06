import { find, some } from "lodash";
import { createSelector } from "reselect";

import {
  EEtoState,
  TCompanyEtoData,
  TEtoSpecsData,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import {
  EEtoDocumentType,
  IEtoDocument,
  TEtoDocumentTemplates,
} from "../../lib/api/eto/EtoFileApi.interfaces";
import { ignoredTemplates } from "../../lib/api/eto/EtoFileUtils";
import {
  EOfferingDocumentType,
  EProductName,
  TEtoProduct,
} from "../../lib/api/eto/EtoProductsApi.interfaces";
import { EKycRequestStatus } from "../../lib/api/kyc/KycApi.interfaces";
import { IAppState } from "../../store";
import { DeepReadonly } from "../../types";
import { nonNullable } from "../../utils/nonNullable";
import { objectToFilteredArray } from "../../utils/objectToFilteredArray";
import { selectIsUserEmailVerified } from "../auth/selectors";
import { selectEtoDocumentsLoading } from "../eto-documents/selectors";
import { selectAgreementsStatus, selectEtoContract, selectEtoSubState } from "../eto/selectors";
import {
  EEtoAgreementStatus,
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
  TOfferingAgreementsStatus,
} from "../eto/types";
import { isOnChain } from "../eto/utils";
import { selectKycRequestStatus } from "../kyc/selectors";
import { EAgreementType } from "../tx/transactions/nominee/sign-agreement/types";
import { IEtoFlowState } from "./types";
import { isValidEtoStartDate, sortProducts } from "./utils";

export const selectIssuerEtoFlow = (state: IAppState) => state.etoIssuer;

export const selectIssuerEto: (state: IAppState) => TEtoSpecsData | undefined = createSelector(
  selectIssuerEtoFlow,
  (state: DeepReadonly<IEtoFlowState>) => state.eto,
);

export const selectEtoNominee: (state: IAppState) => string | undefined = createSelector(
  selectIssuerEtoFlow,
  (state: DeepReadonly<IEtoFlowState>) => state.eto && state.eto.nominee,
);

export const selectEtoNomineeDisplayName: (state: IAppState) => string | undefined = createSelector(
  selectIssuerEtoFlow,
  (state: DeepReadonly<IEtoFlowState>) => state.eto && state.eto.nomineeDisplayName,
);

export const selectIssuerEtoPreviewCode = createSelector(
  selectIssuerEto,
  (eto: TEtoSpecsData | undefined) => (eto ? eto.previewCode : undefined),
);

export const selectIssuerCompany = createSelector(
  selectIssuerEtoFlow,
  (state: DeepReadonly<IEtoFlowState>) => state.company,
);

const selectIssuerEtoWithCompanyAndContractInternal = createSelector(
  // forward eto param to combiner
  (_: IAppState, eto: TEtoSpecsData) => eto,
  (state: IAppState, eto: TEtoSpecsData) => selectEtoContract(state, eto.previewCode),
  (state: IAppState) => nonNullable(selectIssuerCompany(state)),
  (state: IAppState, eto: TEtoSpecsData) => selectEtoSubState(state, eto),
  (eto, contract, company, subState) => ({
    ...eto,
    contract,
    company,
    subState,
  }),
);

export const selectIssuerEtoWithCompanyAndContract = (
  state: IAppState,
): TEtoWithCompanyAndContract | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return selectIssuerEtoWithCompanyAndContractInternal(state, eto);
  }

  return undefined;
};

export const selectIsBookBuilding = (state: IAppState): boolean => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.isBookbuilding;
  }

  return false;
};

export const selectMaxPledges = (state: IAppState) => {
  const eto = selectIssuerEto(state);

  return eto !== undefined ? eto.maxPledges : null;
};

export const selectIssuerEtoId = (state: IAppState): string | undefined => {
  const eto = selectIssuerEto(state);
  if (eto) {
    return eto.etoId;
  }
  return undefined;
};

export const selectCanEnableBookBuilding = (state: IAppState): boolean => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.canEnableBookbuilding;
  }

  return false;
};

export const selectIssuerEtoState = (state: IAppState): EEtoState | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.state;
  }

  return undefined;
};

export const selectIssuerEtoProduct = (state: IAppState): TEtoProduct | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.product;
  }

  return undefined;
};

export const selectIssuerEtoOfferingDocumentType = (
  state: IAppState,
): EOfferingDocumentType | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.product.offeringDocumentType;
  }

  return undefined;
};

export const selectIssuerEtoDateToWhitelistMinDuration = (state: IAppState): number => {
  const eto = selectIssuerEto(state);
  return eto!.product.dateToWhitelistMinDuration;
};

export const selectIssuerEtoLoading = (state: IAppState): boolean => state.etoIssuer.loading;

export const selectNewEtoDateSaving = (state: IAppState): boolean => state.etoIssuer.etoDateSaving;

export const selectCombinedEtoCompanyData = createSelector(
  selectIssuerCompany,
  selectIssuerEto,
  (company: TCompanyEtoData | undefined, eto: TEtoSpecsData | undefined) => ({
    ...company,
    ...eto,
  }),
);

export const selectIssuerEtoTemplates = (state: IAppState): TEtoDocumentTemplates | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.templates;
  }

  return undefined;
};

export const selectFilteredIssuerEtoTemplatesArray = (state: IAppState): IEtoDocument[] => {
  const templates = selectIssuerEtoTemplates(state);
  const filterFunction = (key: string) =>
    !ignoredTemplates.some(templateKey => templateKey === key);

  return templates ? objectToFilteredArray(filterFunction, templates) : [];
};

export const selectIssuerEtoDocuments = (state: IAppState): TEtoDocumentTemplates | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.documents;
  }

  return undefined;
};

export const selectIsTermSheetSubmitted = (state: IAppState): boolean | undefined => {
  const documents = selectIssuerEtoDocuments(state);

  if (documents) {
    return some(documents, document => document.documentType === EEtoDocumentType.SIGNED_TERMSHEET);
  }
  return undefined;
};

export const selectIsOfferingDocumentSubmitted = (state: IAppState): boolean | undefined => {
  const documents = selectIssuerEtoDocuments(state);

  if (documents) {
    return some(
      documents,
      document => document.documentType === EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT,
    );
  }
  return undefined;
};

export const selectIsISHAPreviewSubmitted = (state: IAppState): boolean | undefined => {
  const documents = selectIssuerEtoDocuments(state);

  if (documents) {
    return some(
      documents,
      document =>
        document.documentType === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT_PREVIEW,
    );
  }
  return undefined;
};

export const selectUploadedInvestmentAgreement = (
  state: DeepReadonly<IAppState>,
): IEtoDocument | undefined => {
  const etoDocuments = selectIssuerEtoDocuments(state)!;

  return find(
    etoDocuments,
    document => document.documentType === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT,
  );
};

export const userHasKycAndEmailVerified = (state: IAppState) =>
  selectKycRequestStatus(state) === EKycRequestStatus.ACCEPTED &&
  selectIsUserEmailVerified(state.auth);

export const selectIsGeneralEtoLoading = (state: IAppState) =>
  selectIssuerEtoLoading(state) && selectEtoDocumentsLoading(state.etoDocuments);

export const selectNewPreEtoStartDate = (state: IAppState) => state.etoIssuer.newStartDate;

export const selectPreEtoStartDateFromContract = (state: IAppState) => {
  const eto = selectIssuerEtoWithCompanyAndContract(state);

  if (eto && isOnChain(eto)) {
    return eto.contract.startOfStates[EETOStateOnChain.Whitelist];
  }

  return undefined;
};

export const selectIssuerEtoOnChainState = (state: IAppState) => {
  const eto = selectIssuerEtoWithCompanyAndContract(state);

  if (eto && isOnChain(eto)) {
    return eto.contract.timedState;
  }

  return undefined;
};

export const selectPreEtoStartDate = (state: IAppState) =>
  selectNewPreEtoStartDate(state) || selectPreEtoStartDateFromContract(state);

export const selectCanChangePreEtoStartDate = (state: IAppState) => {
  const minDuration = selectIssuerEtoDateToWhitelistMinDuration(state);
  const date = selectPreEtoStartDateFromContract(state);
  return !date || isValidEtoStartDate(date, minDuration);
};

export const selectIsNewPreEtoStartDateValid = (state: IAppState) => {
  const minDuration = selectIssuerEtoDateToWhitelistMinDuration(state);
  const date = selectNewPreEtoStartDate(state);
  return date && isValidEtoStartDate(date, minDuration);
};

const recognizedProductTypes = [
  EProductName.HNWI_ETO_DE,
  EProductName.HNWI_ETO_LI,
  EProductName.MINI_ETO_LI,
  EProductName.RETAIL_ETO_DE,
  EProductName.RETAIL_ETO_LI_SECURITY,
  EProductName.RETAIL_ETO_LI_VMA,
  EProductName.FIFTH_FORCE_ETO,
];

export const selectAvailableProducts = createSelector(
  selectIssuerEtoFlow,
  ({ products }) => {
    if (products !== undefined) {
      const availableProducts = products
        .filter(product => product.available)
        // TODO: remove after platform-backend/#1550 is done
        .filter(product => product.name !== EProductName.FIFTH_FORCE_ETO)
        // Remove unrecognized product types
        .filter(product =>
          recognizedProductTypes.some(recognizedProd => recognizedProd === product.name),
        );

      return sortProducts(availableProducts);
    }

    return undefined;
  },
);

export const selectIssuerEtoSaving = createSelector(
  selectIssuerEtoFlow,
  state => state.saving,
);

export const selectIsMarketingDataVisibleInPreview = createSelector(
  selectIssuerEto,
  state => state && state.isMarketingDataVisibleInPreview,
);

export const selectIssuerEtoAgreementsStatus = (
  state: IAppState,
): TOfferingAgreementsStatus | undefined => {
  const previewCode = selectIssuerEtoPreviewCode(state);

  if (previewCode !== undefined) {
    return selectAgreementsStatus(state, previewCode);
  }

  return undefined;
};

export const selectAreAgreementsSignedByNominee = createSelector(
  selectIssuerEtoAgreementsStatus,
  documents => {
    if (documents) {
      return (
        documents[EAgreementType.THA] === EEtoAgreementStatus.DONE &&
        documents[EAgreementType.RAAA] === EEtoAgreementStatus.DONE
      );
    }

    return undefined;
  },
);
