import { appRoutes } from "../appRoutes";

const parentRoutePath = appRoutes.kyc;

export const kycRoutes = {
  start: parentRoutePath + "/start",

  // private
  individualStart: parentRoutePath + "/personal/start",
  individualAddress: parentRoutePath + "/personal/address",
  individualUpload: parentRoutePath + "/personal/upload",
  individualDocumentVerification: parentRoutePath + "/personal/document-verification",

  // company
  legalRepresentative: parentRoutePath + "/business/legal-representative",
  businessData: parentRoutePath + "/business/data",
  beneficialOwners: parentRoutePath + "/business/beneficial-owners",

  // other
  pending: parentRoutePath + "/pending",
  rejected: parentRoutePath + "/rejected",
};
