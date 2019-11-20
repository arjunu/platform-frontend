import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { etoDocuments, etoFilesData, etoTemplates, testEto } from "../../../test/fixtures";
import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { ignoredTemplates, nomineeIgnoredTemplates } from "../../lib/api/eto/EtoFileUtils";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { EETOStateOnChain } from "../../modules/eto/types";
import { objectToFilteredArray } from "../../utils/objectToFilteredArray";
import { DocumentsLayout } from "./issuerDocuments/DocumentsLayout";
import { NomineeDocumentsLayout } from "./nomineeDocuments/NomineeDocumentsLayout";

const issuerProps: React.ComponentProps<typeof DocumentsLayout> = {
  etoFilesData: etoFilesData,
  etoState: EEtoState.ON_CHAIN,
  etoTemplates: objectToFilteredArray(
    (key: string) => !ignoredTemplates.some(templateKey => templateKey === key),
    etoTemplates,
  ),
  etoDocuments: etoDocuments,
  offeringDocumentType: EOfferingDocumentType.MEMORANDUM,
  generateTemplate: action("generateTemplate"),
  startDocumentDownload: action("startDocumentDownload"),
  onChainState: EETOStateOnChain.Signing,
  documentsDownloading: {},
  documentsUploading: {},
  documentsGenerated: {},
  transactionPending: false,
  startDocumentRemove: action("startDocumentRemove"),
};

const nomineeProps: React.ComponentProps<typeof NomineeDocumentsLayout> = {
  nomineeEto: testEto,
  etoTemplates: objectToFilteredArray(
    (key: string) => !nomineeIgnoredTemplates.some(templateKey => templateKey === key),
    etoTemplates,
  ),
  documentsGenerated: {},
  generateTemplate: action("generateTemplate"),
};

storiesOf("ETO/Documents", module).add("default", () => <DocumentsLayout {...issuerProps} />);
storiesOf("Nominee/NomineeDocuments", module).add("default", () => (
  <NomineeDocumentsLayout {...nomineeProps} />
));
