import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { IPFS_PROTOCOL } from "../../config/constants";
import { EEtoState, EtoStateToCamelcase } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import {
  EEtoDocumentType,
  IEtoDocument,
  TEtoDocumentTemplates,
  TStateInfo,
} from "../../lib/api/eto/EtoFileApi.interfaces";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { EETOStateOnChain } from "../../modules/eto/types";
import { DeepReadonly } from "../../types";
import { invariant } from "../../utils/invariant";

const documentsOrder = [
  "termsheetTemplate",
  "reservationAndAcquisitionAgreement",
  "companyTokenHolderAgreement",
  "investmentSummaryTemplate",
  "investmentAndShareholderAgreementTemplate",
  "investmentMemorandumTemplate",
];

export const sortDocuments = (documents: string[]) =>
  [...documents].sort(
    (a: string, b: string) => documentsOrder.indexOf(a) - documentsOrder.indexOf(b),
  );

export const documentTitles = {
  company_token_holder_agreement: <FormattedMessage id="eto.documents.tokenholder-agreement" />,
  reservation_and_acquisition_agreement: (
    <FormattedMessage id="eto.documents.reservation-and-acquisition-agreement" />
  ),
  investment_and_shareholder_agreement_template: (
    <FormattedMessage id="eto.documents.investment-and-shareholder-agreement" />
  ),
  prospectus_template: <FormattedMessage id="eto.documents.prospectus-template" />,
  termsheet_template: <FormattedMessage id="eto.documents.termsheet" />,
  investment_memorandum_template: (
    <FormattedMessage id="eto.documents.investment-memorandum-template" />
  ),
  // in document collection
  investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.signed-investment-and-shareholder-agreement" />
  ),
  signed_investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.signed-investment-and-shareholder-agreement" />
  ),
  signed_termsheet: <FormattedMessage id="eto.documents.signed-termsheet" />,
  investment_summary_template: <FormattedMessage id="eto.documents.investment-summary-template" />,
  investment_and_shareholder_agreement_preview: (
    <FormattedMessage id="eto.documents.investment-and-shareholder-agreement-preview" />
  ),
};

const approvedInvestorOfferingDocumentTitle = (documentType: EOfferingDocumentType) =>
  documentType === EOfferingDocumentType.PROSPECTUS ? (
    <FormattedMessage id="eto.documents.approved-investor-prospectus-document" />
  ) : (
    <FormattedMessage id="eto.documents.approved-investment-memorandum-document" />
  );

export const getInvestorDocumentTitles = (documentType: EOfferingDocumentType) => ({
  ...documentTitles,
  approved_investor_offering_document: approvedInvestorOfferingDocumentTitle(documentType),
});

export const getDocumentTemplateTitles = (documentType: EOfferingDocumentType) => ({
  company_token_holder_agreement: (
    <FormattedMessage id="eto.documents.tokenholder-agreement-template" />
  ),
  reservation_and_acquisition_agreement: (
    <FormattedMessage id="eto.documents.reservation-and-acquisition-agreement-template" />
  ),
  investment_and_shareholder_agreement_template: (
    <FormattedMessage id="eto.documents.investment-and-shareholder-agreement-template" />
  ),
  prospectus_template: <FormattedMessage id="eto.documents.prospectus-template" />,
  termsheet_template: <FormattedMessage id="eto.documents.termsheet-template" />,
  investment_memorandum_template: (
    <FormattedMessage id="eto.documents.investment-memorandum-template" />
  ),
  // in document collection
  investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.signed-investment-and-shareholder-agreement" />
  ),
  approved_investor_offering_document:
    documentType === EOfferingDocumentType.PROSPECTUS ? (
      <FormattedMessage id="eto.documents.investor-prospectus-document-template" />
    ) : (
      <FormattedMessage id="eto.documents.investment-memorandum-document-template" />
    ),
  signed_termsheet: null,
  signed_investment_and_shareholder_agreement: null,
  investment_summary_template: <FormattedMessage id="eto.documents.investment-summary-template" />,
  investment_and_shareholder_agreement_preview: null,
});

//if onChainState === < Payout | Claim >
// INVESTMENT_AND_SHAREHOLDER_AGREEMENT changes to SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT
export const renameDocuments = (
  documentsStateInfo: DeepReadonly<TStateInfo> | undefined,
  onChainState: EETOStateOnChain,
) => {
  const documents = documentsStateInfo ? [...documentsStateInfo.uploadableTypes] : [];

  if (
    documentsStateInfo &&
    (onChainState === EETOStateOnChain.Claim || onChainState === EETOStateOnChain.Payout)
  ) {
    const i = documents.findIndex(x => x === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT);
    documents[i] = EEtoDocumentType.SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT;
  }

  return documents;
};

const canUploadInOnChainStates = (
  etoState: EEtoState,
  documentKey: EEtoDocumentType,
  onChainState?: EETOStateOnChain,
) =>
  etoState === EEtoState.ON_CHAIN
    ? onChainState === EETOStateOnChain.Signing &&
      documentKey === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT
    : true;

//disable document tile and don't start the signing process if there's a transaction pending
// this only applies to INVESTMENT_AND_SHAREHOLDER_AGREEMENT now, just to make sure I won't break anything
const mayBeSignedNow = (documentKey: EEtoDocumentType, transactionPending: boolean) => {
  switch (documentKey) {
    case EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT:
      return !transactionPending;
    default:
      return true;
  }
};

//disable document tile if there's some activity under way
export const isBusy = (
  documentKey: EEtoDocumentType,
  transactionPending: boolean,
  documentUploading: boolean,
) => !mayBeSignedNow(documentKey, transactionPending) || documentUploading;

export const isFileUploaded = (
  etoDocuments: TEtoDocumentTemplates,
  documentKey: EEtoDocumentType,
) =>
  Object.keys(etoDocuments).some(
    uploadedKey => etoDocuments[uploadedKey].documentType === documentKey,
  );

//not all documents may be uploaded in all etoStates AND onChain states
export const uploadAllowed = (
  documentsStateInfo: DeepReadonly<TStateInfo>,
  etoState: EEtoState,
  documentKey: EEtoDocumentType,
  onChainState?: EETOStateOnChain,
) =>
  documentsStateInfo &&
  etoState &&
  EtoStateToCamelcase[etoState] in documentsStateInfo.canUploadInStates &&
  documentsStateInfo.canUploadInStates[EtoStateToCamelcase[etoState]].some(
    (fileName: string) => fileName === documentKey,
  ) &&
  canUploadInOnChainStates(etoState, documentKey, onChainState);

export const ipfsLinkFromHash = (ipfsHash: string): string => {
  invariant(ipfsHash.trim() !== "", "invalid string supplied to ipfsLinkFromHash()");
  return `${IPFS_PROTOCOL}:${ipfsHash}`;
};

export const hashFromIpfsLink = (ipfsLink: string): string => {
  invariant(
    ipfsLink.trim() !== "" && ipfsLink.startsWith(`${IPFS_PROTOCOL}:`),
    "invalid ipfs link supplied to hashFromIpfsLink()",
  );
  return ipfsLink.replace(`${IPFS_PROTOCOL}:`, "");
};

export const investmentAgreementNotSigned = (
  signedInvestmentAgreementUrl: undefined | string,
  ipfsHash: string,
) =>
  signedInvestmentAgreementUrl === undefined ||
  signedInvestmentAgreementUrl !== ipfsLinkFromHash(ipfsHash);

export const getUploadedDocumentName = (
  documentsList: TEtoDocumentTemplates,
  documentType: string,
) => {
  const document = Object.values(documentsList).find(
    (doc: IEtoDocument) => doc.documentType === documentType,
  );

  if (document) {
    // Some file names has path included, return only file name
    // This probably applies to fixture accounts only
    return document.name.split("/").pop();
  }
  return undefined;
};
