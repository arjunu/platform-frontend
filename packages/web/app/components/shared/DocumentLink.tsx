import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../types";
import { Button, ButtonTextPosition, EButtonLayout } from "./buttons";
import { Document } from "./Document";
import { ExternalLink } from "./links";

import * as styles from "./DocumentLink.module.scss";

interface IDocumentLabelExternalProps {
  title: string | React.ReactNode;
  altIcon?: React.ReactNode;
  extension?: string;
}

const DocumentLabel: React.FunctionComponent<IDocumentLabelExternalProps> = ({
  title,
  altIcon,
  extension,
}) => (
  <div className={styles.documentLabel}>
    {altIcon || <Document extension={extension || "pdf"} />}
    {title}
  </div>
);

export interface IDocumentLinkProps {
  url: string;
  name: TTranslatedString;
  altIcon?: React.ReactNode;
}

const DocumentLink: React.FunctionComponent<IDocumentLinkProps> = ({ url, name, altIcon }) => (
  <ExternalLink href={url}>
    <DocumentLabel title={name} altIcon={altIcon} extension={url} />
  </ExternalLink>
);

interface IDocumentButtonExternalProps {
  title: string | React.ReactNode;
  altIcon?: React.ReactNode;
  onClick?: () => void;
  layout?: EButtonLayout;
}

const DocumentButton: React.FunctionComponent<IDocumentButtonExternalProps & TDataTestId> = ({
  onClick,
  title,
  altIcon,
  layout = EButtonLayout.INLINE,
  ["data-test-id"]: dataTestId,
}) => (
  <Button
    layout={layout}
    onClick={onClick}
    textPosition={ButtonTextPosition.LEFT}
    data-test-id={dataTestId}
  >
    <DocumentLabel title={title} altIcon={altIcon} />
  </Button>
);

export { DocumentLink, DocumentButton, DocumentLabel };
