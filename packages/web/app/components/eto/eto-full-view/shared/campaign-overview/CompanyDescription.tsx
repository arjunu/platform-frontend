import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TEtoWithCompanyAndContractReadonly } from "../../../../../modules/eto/types";
import { Container, EColumnSpan } from "../../../../layouts/Container";
import { Field } from "../../../../shared/Field";
import { ExternalLink } from "../../../../shared/links/index";
import { normalizedUrl } from "../../../../shared/MediaLinksWidget";
import { Panel } from "../../../../shared/Panel";
import { DEFAULT_PLACEHOLDER } from "../../../constants";
import { DashboardHeading } from "../../../../shared/DashboardHeading";

import * as styles from "../PublicView.module.scss";

const CompanyDescription: React.FunctionComponent<{ eto: TEtoWithCompanyAndContractReadonly }> = ({
  eto,
}) => {
  const {
    companyDescription,
    keyQuoteInvestor,
    companyWebsite,
    brandName,
    companyOneliner,
  } = eto.company;
  return companyDescription || keyQuoteInvestor ? (
    <>
      <Container columnSpan={EColumnSpan.TWO_COL}>
        <DashboardHeading title={brandName + (companyOneliner ? ` — ${companyOneliner}` : "")} />
      </Container>
      <Panel columnSpan={EColumnSpan.TWO_COL}>
        {companyDescription && (
          <p className="mb-4" data-test-id="eto-view-company-description">
            <Field name="companyDescription" value={companyDescription} />
          </p>
        )}
        {keyQuoteInvestor && <p className={cn(styles.quote, "mb-4")}>{keyQuoteInvestor}</p>}
        {companyWebsite && (
          <p>
            <FormattedMessage
              id="eto.public-view.eto-find-out"
              values={{
                companyWebsite: (
                  <ExternalLink href={normalizedUrl(companyWebsite)}>
                    {companyWebsite.split("//")[1] || DEFAULT_PLACEHOLDER}
                  </ExternalLink>
                ),
              }}
            />
          </p>
        )}
      </Panel>
    </>
  ) : null;
};

export { CompanyDescription };
