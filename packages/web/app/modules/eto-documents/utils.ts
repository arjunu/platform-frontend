import { curry } from "lodash/fp";

import { EEtoDocumentType, TEtoDocumentTemplates } from "../../lib/api/eto/EtoFileApi.interfaces";

const getDocumentByType = curry(
  (documents: TEtoDocumentTemplates, documentType: EEtoDocumentType) =>
    Object.values(documents).find(document => document.documentType === documentType),
);

export { getDocumentByType };
