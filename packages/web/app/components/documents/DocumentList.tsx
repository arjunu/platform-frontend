import * as React from "react";

import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { TTranslatedString } from "../../types";
import { DocumentTile } from "../shared/Document";

import * as styles from "./Documents.module.scss";

type TDocumentListProps = {
  etoTemplates: IEtoDocument[];
  generateTemplate: (document: IEtoDocument) => void;
  documentsGenerated: { [ipfsHash: string]: boolean };
  documentTitles: { [title: string]: TTranslatedString };
  fallbackText: TTranslatedString;
};

export const DocumentList: React.FunctionComponent<TDocumentListProps> = ({
  etoTemplates,
  generateTemplate,
  documentsGenerated,
  documentTitles,
  fallbackText,
}) => (
  <>
    {etoTemplates.length !== 0 ? (
      etoTemplates.map(template => (
        <DocumentTile
          key={template.ipfsHash}
          title={documentTitles[template.documentType]}
          extension={".doc"}
          busy={documentsGenerated[template.ipfsHash]}
          blank={false}
          onlyDownload={true}
          fileName={template.documentType}
          downloadAction={() => generateTemplate(template)}
        />
      ))
    ) : (
      <div className={styles.note}>{fallbackText}</div>
    )}
  </>
);
