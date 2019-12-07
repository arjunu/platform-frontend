import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../types";
import { Button, EButtonLayout } from "./buttons";
import { ButtonInline } from "./buttons/ButtonInline";
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
  layout,
  ["data-test-id"]: dataTestId,
}) => {
  if (layout) {
    return (
      <Button layout={layout} onClick={onClick} data-test-id={dataTestId}>
        <DocumentLabel title={title} altIcon={altIcon} />
      </Button>
    );
  } else {
    return (
      <ButtonInline onClick={onClick} data-test-id={dataTestId}>
        <DocumentLabel title={title} altIcon={altIcon} />
      </ButtonInline>
    );
  }
};

export { DocumentLink, DocumentButton, DocumentLabel };
