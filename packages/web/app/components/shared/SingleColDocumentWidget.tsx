import * as React from "react";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { IEtoDocument, immutableDocumentName } from "../../lib/api/eto/EtoFileApi.interfaces";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { IImmutableFileId } from "../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { getDocumentTemplateTitles } from "../documents/utils";
import { DocumentButton } from "./DocumentLink";
import { InlineIcon } from "./icons";

import * as link from "../../assets/img/inline_icons/social_link.svg";
import * as styles from "./SingleColDocumentWidget.module.scss";

interface IOwnProps {
  offeringDocumentType: EOfferingDocumentType;
  documents: IEtoDocument[];
  title: TTranslatedString;
  description?: TTranslatedString;
  className?: string;
}
interface IDispatchProps {
  downloadImmutableFile: (fileId: IImmutableFileId, fileName: string) => void;
}

type IProps = IOwnProps & IDispatchProps;

const SingleColDocumentsLayout: React.FunctionComponent<IProps> = ({
  documents,
  className,
  title,
  description,
  downloadImmutableFile,
  offeringDocumentType,
}) => {
  const documentTemplateTitles = getDocumentTemplateTitles(offeringDocumentType);
  return (
    <div className={className}>
      <h3 className={styles.groupName}>{title}</h3>
      {description && <p className={styles.groupDescription}>{description}</p>}
      <section className={styles.group}>
        {documents.map(({ ipfsHash, mimeType, documentType }) => (
          <div className={styles.document} key={ipfsHash}>
            <DocumentButton
              onClick={() =>
                downloadImmutableFile(
                  {
                    ...{ ipfsHash, mimeType },
                    asPdf: false,
                  },
                  immutableDocumentName[documentType],
                )
              }
              title={documentTemplateTitles[documentType]}
              altIcon={<InlineIcon svgIcon={link} />}
            />
          </div>
        ))}
      </section>
    </div>
  );
};

const ProductTemplates = compose<React.FunctionComponent<IOwnProps>>(
  setDisplayName("SingleColDocuments"),
  appConnect<{}, IDispatchProps>({
    dispatchToProps: dispatch => ({
      downloadImmutableFile: (fileId, name) =>
        dispatch(actions.immutableStorage.downloadImmutableFile(fileId, name)),
    }),
  }),
)(SingleColDocumentsLayout);

export { ProductTemplates, SingleColDocumentsLayout };
