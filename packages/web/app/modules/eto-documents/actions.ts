import { createActionFactory } from "@neufund/shared";

import {
  EEtoDocumentType,
  IEtoDocument,
  IEtoFilesInfo,
} from "../../lib/api/eto/EtoFileApi.interfaces";

export const etoDocumentsActions = {
  loadFileDataStart: createActionFactory("ETO_DOCUMENTS_LOAD_FILE_DATA_START"),
  loadEtoFilesInfo: createActionFactory(
    "ETO_DOCUMENTS_LOAD_ETO_FILE_DATA",
    (data: IEtoFilesInfo) => ({
      data,
    }),
  ),
  generateTemplate: createActionFactory(
    "ETO_DOCUMENTS_GENERATE_TEMPLATE",
    (document: IEtoDocument) => ({ document }),
  ),
  generateTemplateByEtoId: createActionFactory(
    "ETO_DOCUMENTS_GENERATE_TEMPLATE_BY_ETO_ID",
    (document: IEtoDocument, etoId: string) => ({
      document,
      etoId,
    }),
  ),
  etoUploadDocumentStart: createActionFactory(
    "ETO_DOCUMENTS_UPLOAD_DOCUMENT_START",
    (file: File, documentType: EEtoDocumentType) => ({ file, documentType }),
  ),
  etoRemoveDocumentStart: createActionFactory(
    "ETO_DOCUMENTS_REMOVE_DOCUMENT_START",
    (documentType: EEtoDocumentType) => ({ documentType }),
  ),
  etoUploadDocumentFinish: createActionFactory(
    "ETO_DOCUMENTS_UPLOAD_DOCUMENT_FINISH",
    (documentType: EEtoDocumentType) => ({ documentType }),
  ),
  showIpfsModal: createActionFactory(
    "ETO_DOCUMENTS_IPFS_MODAL_SHOW",
    (fileUploadAction: () => void) => ({ fileUploadAction }),
  ),
  hideIpfsModal: createActionFactory("ETO_DOCUMENTS_IPFS_MODAL_HIDE"),
  downloadDocumentStart: createActionFactory(
    "ETO_DOCUMENTS_DOWNLOAD_START",
    (documentType: EEtoDocumentType) => ({ documentType }),
  ),
  downloadDocumentFinish: createActionFactory(
    "ETO_DOCUMENTS_DOWNLOAD_FINISH",
    (documentType: EEtoDocumentType) => ({ documentType }),
  ),
};
