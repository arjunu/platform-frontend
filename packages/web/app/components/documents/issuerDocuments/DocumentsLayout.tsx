import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EEtoDocumentType } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { EtoFileIpfsModal } from "../../eto/shared/EtoFileIpfsModal";
import { DocumentUploadableTile } from "../../shared/DocumentUploadable";
import { Heading } from "../../shared/Heading";
import { ProductTemplates } from "../../shared/SingleColDocumentWidget";
import { DocumentList } from "../DocumentList";
import {
  getInvestorDocumentTitles,
  getUploadedDocumentName,
  isBusy,
  isFileUploaded,
  renameDocuments,
  sortDocuments,
  uploadAllowed,
} from "../utils";
import { TComponentProps } from "./Documents";

import * as styles from "../Documents.module.scss";

const DocumentsLayout: React.FunctionComponent<TComponentProps> = ({
  etoFilesData,
  generateTemplate,
  etoState,
  etoTemplates,
  etoDocuments,
  startDocumentDownload,
  offeringDocumentType,
  onChainState,
  documentsUploading,
  documentsDownloading,
  transactionPending,
  documentsGenerated,
  startDocumentRemove,
}) => {
  const { productTemplates, documentsStateInfo } = etoFilesData;
  const documents = renameDocuments(documentsStateInfo, onChainState);

  return (
    <>
      <EtoFileIpfsModal />
      <div data-test-id="eto-documents" className={styles.layout}>
        <Heading level={3} className={styles.header}>
          <FormattedMessage id="documents.legal-documents" />
        </Heading>

        <p className={styles.description}>
          <FormattedMessage id="documents.legal-documents.description" />
        </p>

        <section className={styles.documentSection}>
          <h4 className={cn(styles.groupName)}>
            <FormattedMessage id="documents.generated-documents" />
          </h4>
          <DocumentList
            generateTemplate={generateTemplate}
            etoTemplates={etoTemplates}
            documentsGenerated={documentsGenerated}
            documentTitles={getInvestorDocumentTitles(offeringDocumentType)}
            fallbackText={
              <FormattedMessage id="documents.please-fill-the-eto-forms-in-order-to-generate-templates" />
            }
          />
        </section>

        <section className={styles.documentSection}>
          <h4 className={styles.groupName}>
            <FormattedMessage id="documents.approved-prospectus-and-agreements-to-upload" />
          </h4>
          {documentsStateInfo &&
            documents.map((key: EEtoDocumentType) => (
              <DocumentUploadableTile
                key={key}
                documentKey={key}
                active={uploadAllowed(documentsStateInfo, etoState, key, onChainState)}
                busy={isBusy(key, transactionPending, Boolean(documentsUploading[key]))}
                typedFileName={getInvestorDocumentTitles(offeringDocumentType)[key]}
                isFileUploaded={isFileUploaded(etoDocuments, key)}
                downloadDocumentStart={startDocumentDownload}
                documentDownloadLinkInactive={
                  Boolean(documentsUploading[key]) || Boolean(documentsDownloading[key])
                }
                startDocumentRemove={startDocumentRemove}
                uploadedFileName={getUploadedDocumentName(etoDocuments, key)}
              />
            ))}
        </section>

        {productTemplates && (
          <ProductTemplates
            documents={sortDocuments(Object.keys(productTemplates)).map(
              key => productTemplates[key],
            )}
            title={<FormattedMessage id="documents.agreement-and-prospectus-templates" />}
            description={
              <FormattedMessage id="documents.agreement-and-prospectus-templates.description" />
            }
            className={styles.documents}
            offeringDocumentType={offeringDocumentType}
          />
        )}
      </div>
    </>
  );
};

export { DocumentsLayout };
