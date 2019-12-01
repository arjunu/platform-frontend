import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "recompose";

import { IEtoDocument } from "../../../../../../lib/api/eto/EtoFileApi.interfaces";
import {
  canShowDocument,
  ignoredTemplatesPublicView,
} from "../../../../../../lib/api/eto/EtoFileUtils";
import { actions } from "../../../../../../modules/actions";
import { TEtoWithCompanyAndContractReadonly } from "../../../../../../modules/eto/types";
import { appConnect } from "../../../../../../store";
import { CommonHtmlProps } from "../../../../../../types";
import { getInvestorDocumentTitles } from "../../../../../documents/utils";
import { Container, EColumnSpan } from "../../../../../layouts/Container";
import { DashboardHeading } from "../../../../../shared/DashboardHeading";
import { DocumentButton } from "../../../../../shared/DocumentLink";
import { Panel } from "../../../../../shared/Panel";

import * as styles from "./DocumentsWidget.module.scss";

type TExternalProps = {
  eto: TEtoWithCompanyAndContractReadonly;
  columnSpan?: EColumnSpan;
  isUserFullyVerified: boolean;
};

type TDispatchProps = {
  downloadDocument: (document: IEtoDocument) => void;
};

const DocumentsWidgetLayout: React.FunctionComponent<TDispatchProps &
  TExternalProps &
  CommonHtmlProps> = ({ downloadDocument, className, columnSpan, isUserFullyVerified, eto }) => {
  const { templates, documents, product } = eto;

  const documentTitles = getInvestorDocumentTitles(product.offeringDocumentType);

  return templates || documents ? (
    <Container columnSpan={EColumnSpan.ONE_COL}>
      <DashboardHeading
        title={<FormattedMessage id="eto.public-view.documents.legal-documents" />}
      />
      <Panel className={className} columnSpan={columnSpan}>
        <section className={styles.group}>
          <Row>
            {Object.keys(templates)
              .filter(key => !ignoredTemplatesPublicView.some(template => template === key))
              .map((key, i) => (
                <Col sm="6" md="12" lg="6" key={i} className={styles.document}>
                  <DocumentButton
                    onClick={() => downloadDocument(templates[key])}
                    title={documentTitles[templates[key].documentType]}
                  />
                </Col>
              ))}
            {Object.values(documents)
              .filter(document => canShowDocument(document, isUserFullyVerified))
              .map((document, i) => (
                <Col sm="6" md="12" lg="6" key={i} className={styles.document}>
                  <DocumentButton
                    data-test-id={`eto-public-view.documents.${document.documentType}`}
                    onClick={() => downloadDocument(document)}
                    title={documentTitles[document.documentType]}
                  />
                </Col>
              ))}
          </Row>
        </section>
      </Panel>
    </Container>
  ) : null;
};

const DocumentsWidget = compose<
  TExternalProps & TDispatchProps & CommonHtmlProps,
  TExternalProps & CommonHtmlProps
>(
  appConnect<{}, TDispatchProps, TExternalProps>({
    dispatchToProps: (dispatch, { eto }) => ({
      downloadDocument: (document: IEtoDocument) =>
        dispatch(actions.eto.downloadEtoDocument(document, eto)),
    }),
  }),
)(DocumentsWidgetLayout);

export { DocumentsWidget, DocumentsWidgetLayout };
