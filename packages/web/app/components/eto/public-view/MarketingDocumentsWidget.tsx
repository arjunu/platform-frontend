import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { TCompanyEtoData } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { CommonHtmlProps } from "../../../types";
import { nonNullable } from "../../../utils/nonNullable";
import { Container, EColumnSpan } from "../../layouts/Container";
import { DocumentLink } from "../../shared/DocumentLink";
import { InlineIcon } from "../../shared/icons";
import { Panel } from "../../shared/Panel";
import { DashboardHeading } from "../shared/DashboardHeading";

import * as icon_link from "../../../assets/img/inline_icons/social_link.svg";
import * as styles from "./DocumentsWidget.module.scss";

type TExternalProps = {
  companyMarketingLinks: TCompanyEtoData["marketingLinks"];
  columnSpan?: EColumnSpan;
};

const MarketingDocumentsWidget: React.FunctionComponent<TExternalProps & CommonHtmlProps> = ({
  companyMarketingLinks,
  className,
  columnSpan,
}) =>
  companyMarketingLinks ? (
    <Container columnSpan={EColumnSpan.THREE_COL}>
      <DashboardHeading
        title={<FormattedMessage id="eto.public-view.documents.marketing-links" />}
      />
      <Panel className={className} columnSpan={columnSpan}>
        <section className={styles.group}>
          <Row>
            {companyMarketingLinks &&
              companyMarketingLinks
                .filter(link => link.url && link.title)
                .map((link, i) => (
                  <Col sm="6" md="12" lg="6" key={i} className={styles.document}>
                    <DocumentLink
                      url={nonNullable(link.url)}
                      name={nonNullable(link.title)}
                      altIcon={<InlineIcon svgIcon={icon_link} />}
                    />
                  </Col>
                ))}
          </Row>
        </section>
      </Panel>
    </Container>
  ) : null;

export { MarketingDocumentsWidget };
