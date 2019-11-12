import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EEtoDocumentType } from "../../lib/api/eto/EtoFileApi.interfaces";
import { Document, DocumentTile } from "./Document";
import { DocumentUploadableTile } from "./DocumentUploadable";

storiesOf("Document/Icons", module)
  .add("doc", () => (
    <>
      <Document extension="doc" />
    </>
  ))
  .add("pdf", () => <Document extension="pdf" />);

storiesOf("Document/Tiles/generated documents", module)
  .add("pdf", () => (
    <DocumentTile
      extension="pdf"
      title="generated document title pdf"
      onlyDownload={true}
      blank={true}
      activeUpload={false}
      busy={false}
      fileName="file_name"
      downloadAction={() => action("DOWNLOAD")}
    />
  ))
  .add("doc", () => (
    <DocumentTile
      extension="doc"
      title="generated document title doc"
      onlyDownload={true}
      blank={false}
      activeUpload={false}
      busy={false}
      fileName="file_name"
      downloadAction={() => action("DOWNLOAD")}
    />
  ))
  .add("disabled download link", () => (
    <DocumentTile
      extension="pdf"
      title="document title"
      onlyDownload={true}
      blank={true}
      activeUpload={false}
      busy={false}
      fileName="file_name"
      downloadAction={() => action("DOWNLOAD")}
      linkDisabled={true}
    />
  ))
  .add("file uploaded, upload active", () => (
    <DocumentTile
      extension="pdf"
      title="document title"
      onlyDownload={true}
      blank={true}
      activeUpload={true}
      busy={false}
      fileName="file_name"
      downloadAction={() => action("DOWNLOAD")}
    />
  ))
  .add("busy", () => (
    <DocumentTile
      extension="pdf"
      title="document title"
      onlyDownload={true}
      blank={true}
      activeUpload={true}
      busy={true}
      fileName="file_name"
      downloadAction={() => action("DOWNLOAD")}
    />
  ));

storiesOf("Document/Tiles/uploadable documents", module)
  .add("default", () => (
    <DocumentUploadableTile
      active={true}
      documentKey={EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT}
      typedFileName={"investment agreement"}
      isFileUploaded={false}
      downloadDocumentStart={() => action("DOWNLOAD")}
      startDocumentRemove={() => action("REMOVE")}
      documentDownloadLinkInactive={false}
      busy={false}
    />
  ))
  .add("disabled", () => (
    <DocumentUploadableTile
      active={true}
      documentKey={EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT}
      typedFileName={"investment agreement"}
      isFileUploaded={false}
      downloadDocumentStart={() => action("DOWNLOAD")}
      startDocumentRemove={() => action("REMOVE")}
      documentDownloadLinkInactive={false}
      busy={false}
      disabled={true}
    />
  ))
  .add("busy", () => (
    <DocumentUploadableTile
      active={true}
      documentKey={EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT}
      typedFileName={"investment agreement"}
      isFileUploaded={false}
      downloadDocumentStart={() => action("DOWNLOAD")}
      startDocumentRemove={() => action("REMOVE")}
      documentDownloadLinkInactive={false}
      busy={true}
    />
  ));
