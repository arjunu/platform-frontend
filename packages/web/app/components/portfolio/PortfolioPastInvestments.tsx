import * as cn from "classnames";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { TETOWithInvestorTicket } from "../../modules/investor-portfolio/types";
import { getTokenPrice } from "../../modules/investor-portfolio/utils";
import { etoPublicViewLink } from "../appRouteUtils";
import { DashboardHeading } from "../eto/shared/DashboardHeading";
import { EProjectStatusSize, ETOInvestorState } from "../eto/shared/ETOState";
import { Container } from "../layouts/Container";
import { FormatNumber } from "../shared/formatters/FormatNumber";
import { Money } from "../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  EPriceFormat,
} from "../shared/formatters/utils";
import { CurrencyIcon } from "../shared/icons/CurrencyIcon";
import { TokenIcon } from "../shared/icons/TokenIcon";
import { ENewTableCellLayout, NewTable, NewTableRow } from "../shared/table";

import * as styles from "./PortfolioLayout.module.scss";

interface IExternalProps {
  pastInvestments: TETOWithInvestorTicket[];
}

const PortfolioPastInvestments: React.FunctionComponent<IExternalProps> = ({ pastInvestments }) => (
  <Container>
    <DashboardHeading
      title={<FormattedMessage id="portfolio.section.past-investments.title" />}
      description={<FormattedMessage id="portfolio.section.past-investments.description" />}
    />
    <NewTable
      keepRhythm={true}
      placeholder={
        <FormattedMessage id="portfolio.section.past-investments.table.header.placeholder" />
      }
      titles={[
        <FormattedMessage id="portfolio.section.past-investments.table.header.date" />,
        <FormattedMessage id="portfolio.section.past-investments.table.header.token" />,
        "",
        <FormattedMessage id="portfolio.section.past-investments.table.header.quantity" />,
        <FormattedMessage id="portfolio.section.past-investments.table.header.value-eur" />,
        <FormattedMessage id="portfolio.section.past-investments.table.header.price-eur" />,
        <>
          <CurrencyIcon currency={ECurrency.NEU} className={cn("mr-2", styles.tokenSmall)} />
          <FormattedMessage id="portfolio.section.past-investments.table.header.neu-reward" />
        </>,
        <FormattedMessage id="portfolio.section.past-investments.table.header.eto-status" />,
      ]}
    >
      {pastInvestments.map(({ investorTicket, ...eto }) => {
        const timedState = eto.contract!.timedState;
        const investmentDate = eto.contract!.startOfStates[timedState]!;

        return (
          <NewTableRow
            key={eto.etoId}
            data-test-id={`past-investments-${eto.etoId}`}
            cellLayout={ENewTableCellLayout.MIDDLE}
          >
            <FormattedDate value={investmentDate} />
            <>
              <TokenIcon
                srcSet={{ "1x": eto.equityTokenImage }}
                alt=""
                className={cn("mr-2", styles.token)}
              />
              <span className={styles.tokenName} data-test-id="past-investments-token-name">
                {eto.equityTokenName} ({eto.equityTokenSymbol})
              </span>
            </>

            <Link
              to={etoPublicViewLink(eto.previewCode, eto.product.jurisdiction)}
              data-test-id="portfolio-past-investments-view-profile"
            >
              <FormattedMessage id="portfolio.section.reserved-assets.view-profile" />
            </Link>
            <FormatNumber
              value={investorTicket.equityTokenInt}
              inputFormat={ENumberInputFormat.FLOAT}
              outputFormat={ENumberOutputFormat.INTEGER}
              data-test-id="past-investments-token-balance"
            />
            <Money
              value={investorTicket.equivEurUlps}
              inputFormat={ENumberInputFormat.ULPS}
              valueType={ECurrency.EUR}
              outputFormat={ENumberOutputFormat.FULL}
              data-test-id="past-investments-invested-amount"
            />
            <Money
              value={getTokenPrice(investorTicket.equityTokenInt, investorTicket.equivEurUlps)}
              inputFormat={ENumberInputFormat.FLOAT}
              valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
              outputFormat={ENumberOutputFormat.FULL}
              data-test-id="past-investments-token-price"
            />
            <Money
              value={investorTicket.rewardNmkUlps.toString()}
              inputFormat={ENumberInputFormat.ULPS}
              valueType={ECurrency.NEU}
              outputFormat={ENumberOutputFormat.FULL}
              data-test-id="past-investments-asset-neu-reward"
            />
            <ETOInvestorState eto={eto} size={EProjectStatusSize.SMALL} />
          </NewTableRow>
        );
      })}
    </NewTable>
  </Container>
);

export { PortfolioPastInvestments };
