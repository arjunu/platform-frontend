import { createActionFactory } from "@neufund/shared";

import { TCompanyEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EEtoDocumentType, IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { Dictionary } from "../../types";
import {
  IEtoContractData,
  IEtoTokenData,
  IEtoTokenGeneralDiscounts,
  SignedISHAStatus,
  TEtoWithCompanyAndContractReadonly,
  TOfferingAgreementsStatus,
} from "./types";

export const etoActions = {
  // public actions
  loadEtoPreview: createActionFactory(
    "ETO_LOAD_ETO_PREVIEW",
    (previewCode: string, widgetView?: boolean) => ({
      previewCode,
      widgetView,
    }),
  ),
  loadEto: createActionFactory("ETO_LOAD_ETO", (etoId: string, widgetView?: boolean) => ({
    etoId,
    widgetView,
  })),
  loadEtos: createActionFactory("ETO_LOAD_ETOS"),
  loadTokenTerms: createActionFactory(
    "INVESTOR_TOKEN_PRICE_LOAD",
    (eto: TEtoWithCompanyAndContractReadonly) => ({ eto }),
  ),
  downloadEtoDocument: createActionFactory(
    "ETO_DOWNLOAD_DOCUMENT",
    (document: IEtoDocument, eto: TEtoWithCompanyAndContractReadonly) => ({
      document,
      eto,
    }),
  ),
  downloadEtoTemplateByType: createActionFactory(
    "ETO_DOWNLOAD_TEMPLATE_BY_TYPE",
    (etoId: string, documentType: EEtoDocumentType) => ({ etoId, documentType }),
  ),
  loadTokensData: createActionFactory("ETO_LOAD_TOKENS_DATA"),
  loadEtoAgreementsStatus: createActionFactory(
    "ETO_LOAD_AGREEMENTS_STATUS",
    (eto: TEtoWithCompanyAndContractReadonly) => ({
      eto,
    }),
  ),
  ensureEtoJurisdiction: createActionFactory(
    "ETO_VERIFY_ETO_JURISDICTION",
    (previewCode: string, jurisdiction: string) => ({
      previewCode,
      jurisdiction,
    }),
  ),
  confirmJurisdictionDisclaimer: createActionFactory("ETO_CONFIRM_JURISDICTION_DISCLAIMER"),
  confirmConfidentialityAgreement: createActionFactory("ETO_CONFIRM_CONFIDENTIALITY_AGREEMENT"),
  verifyEtoAccess: createActionFactory("ETO_VERIFY_ETO_ACCESS", (previewCode: string) => ({
    previewCode,
  })),

  // state mutations
  setEtos: createActionFactory(
    "ETO_SET_ETOS",
    ({
      etos,
      companies,
    }: {
      etos: Dictionary<TEtoSpecsData>;
      companies: Dictionary<TCompanyEtoData>;
    }) => ({ etos, companies }),
  ),
  setEto: createActionFactory(
    "ETO_SET_ETO",
    ({ eto, company }: { eto: TEtoSpecsData; company?: TCompanyEtoData }) => ({ eto, company }),
  ),
  setEtosDisplayOrder: createActionFactory("ETO_SET_DISPLAY_ORDER", (order: string[]) => ({
    order,
  })),
  setEtoDataFromContract: createActionFactory(
    "ETO_SET_ETO_DATA_FROM_CONTRACT",
    (previewCode: string, data: IEtoContractData) => ({ previewCode, data }),
  ),
  setEtoWidgetError: createActionFactory("ETO_SET_ETO_WIDGET_ERROR"),
  setTokenData: createActionFactory(
    "ETO_SET_ETO_TOKEN_DATA",
    (previewCode: string, tokenData: IEtoTokenData) => ({
      previewCode,
      tokenData,
    }),
  ),
  setTokenGeneralDiscounts: createActionFactory(
    "ETO_SET_ETO_TOKEN_GENERAL_DISCOUNTS",
    (etoId: string, tokenGeneralDiscounts: IEtoTokenGeneralDiscounts) => ({
      etoId,
      tokenGeneralDiscounts,
    }),
  ),
  setAgreementsStatus: createActionFactory(
    "ETO_SET_AGREEMENTS_STATUS",
    (previewCode: string, statuses: TOfferingAgreementsStatus) => ({
      previewCode,
      statuses,
    }),
  ),
  loadSignedInvestmentAgreement: createActionFactory(
    "ETO_LOAD_INVESTMENT_AGREEMENT",
    (eto: TEtoWithCompanyAndContractReadonly) => ({ eto }),
  ),
  setInvestmentAgreementHash: createActionFactory(
    "ETO_SET_INVESTMENT_AGREEMENT_URL",
    (previewCode: string, url: SignedISHAStatus["url"]) => ({ url, previewCode }),
  ),
};
