import { createActionFactory } from "@neufund/shared";

import {
  TCompanyEtoData,
  TEtoSpecsData,
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TEtoProducts } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { TEtoWithCompanyAndContractReadonly } from "../eto/types";

export const etoFlowActions = {
  loadIssuerEto: createActionFactory("ETO_FLOW_LOAD_ISSUER_ETO"),
  loadDataStop: createActionFactory("ETO_FLOW_LOAD_DATA_STOP"),
  loadProducts: createActionFactory("ETO_FLOW_LOAD_PRODUCTS"),
  loadIssuerStep: createActionFactory("ETO_FLOW_LOAD_ISSUER_STEP"),
  setProducts: createActionFactory("ETO_FLOW_SET_PRODUCTS", (products: TEtoProducts) => ({
    products,
  })),
  changeProductType: createActionFactory("ETO_FLOW_CHANGE_PRODUCT", (productId: string) => ({
    productId,
  })),
  uploadStartDate: createActionFactory("ETO_FLOW_START_DATE_TX"),
  cleanupStartDate: createActionFactory("ETO_FLOW_CLEANUP_START_DATE_TX"),
  submitDataStart: createActionFactory("ETO_FLOW_SUBMIT_DATA_START"),
  publishDataStart: createActionFactory("ETO_FLOW_PUBLISH_DATA_START"),
  setEto: createActionFactory(
    "ETO_FLOW_SET_ETO",
    ({ eto, company }: { eto: TEtoSpecsData; company?: TCompanyEtoData }) => ({ eto, company }),
  ),
  saveCompanyStart: createActionFactory(
    "ETO_FLOW_SAVE_COMPANY_START",
    (company: TPartialCompanyEtoData) => ({ company }),
  ),
  saveEtoStart: createActionFactory(
    "ETO_FLOW_SAVE_ETO_START",
    (eto: TPartialEtoSpecData, options: { patch: boolean } = { patch: true }) => ({
      eto,
      options,
    }),
  ),
  changeBookBuildingStatus: createActionFactory(
    "ETO_FLOW_CHANGE_BOOK_BUILDING_STATES",
    (status: boolean) => ({ status }),
  ),
  downloadBookBuildingStats: createActionFactory("ETO_FLOW_DOWNLOAD_BOOK_BUILDING_STATS"),
  setNewStartDate: createActionFactory("ETO_FLOW_SET_START_DATE", (newStartDate: Date) => ({
    newStartDate,
  })),
  clearNewStartDate: createActionFactory("ETO_FLOW_CLEAR_START_DATE", () => ({
    newStartDate: undefined,
  })),
  issuerSignInvestmentAgreement: createActionFactory(
    "ISSUER_FLOW_SIGN_INVESTMENT_AGREEMENT",
    (eto: TEtoWithCompanyAndContractReadonly, agreementHash: string) => ({ eto, agreementHash }),
  ),
  nomineeSignInvestmentAgreement: createActionFactory(
    "NOMINEE_FLOW_SIGN_INVESTMENT_AGREEMENT",
    (eto: TEtoWithCompanyAndContractReadonly, agreementHash: string) => ({ eto, agreementHash }),
  ),
  setEtoDateStart: createActionFactory("ETO_FLOW_SET_ETO_DATE_START"),
  setEtoDateStop: createActionFactory("ETO_FLOW_SET_ETO_DATE_STOP"),
};
