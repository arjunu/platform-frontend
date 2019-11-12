import * as cn from "classnames";
import * as React from "react";
import { FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { EETOStateOnChain } from "../../modules/eto/types";
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
import { PortfolioAssetAction } from "./PortfolioAssetAction";

import * as styles from "./PortfolioLayout.module.scss";

interface IExternalProps {
  pendingAssets: TETOWithInvestorTicket[];
}

const PortfolioReservedAssets: React.FunctionComponent<IExternalProps> = ({ pendingAssets }) => (
  <Container>
    <DashboardHeading
      title={<FormattedMessage id="portfolio.section.reserved-assets.title" />}
      description={<FormattedMessage id="portfolio.section.reserved-assets.description" />}
    />
    <NewTable
      placeholder={
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.placeholder" />
      }
      titles={[
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.token" />,
        "",
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.balance" />,
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.value-eur" />,
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.price-eur" />,
        <>
          <CurrencyIcon currency={ECurrency.NEU} className={cn("mr-2", styles.tokenSmall)} />
          <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
        </>,
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.eto-status" />,
        {
          title: "",
          width: "20%",
        },
      ]}
    >
      {pendingAssets.map(({ investorTicket, ...eto }) => {
        const timedState = eto.contract!.timedState;
        const isWhitelistedOrPublic =
          timedState === EETOStateOnChain.Whitelist || timedState === EETOStateOnChain.Public;

        return (
          <NewTableRow
            key={eto.etoId}
            data-test-id={`portfolio-reserved-asset-${eto.etoId}`}
            cellLayout={ENewTableCellLayout.MIDDLE}
          >
            <>
              <TokenIcon
                srcSet={{ "1x": eto.equityTokenImage }}
                alt=""
                className={cn("mr-2", styles.token)}
              />
              <span className={styles.tokenName} data-test-id="portfolio-reserved-asset-token-name">
                {eto.equityTokenName} ({eto.equityTokenSymbol})
              </span>
            </>

            <Link
              to={etoPublicViewLink(eto.previewCode, eto.product.jurisdiction)}
              data-test-id="portfolio-reserved-assets-view-profile"
            >
              <FormattedMessage id="portfolio.section.reserved-assets.view-profile" />
            </Link>
            <FormatNumber
              value={investorTicket.equityTokenInt}
              inputFormat={ENumberInputFormat.FLOAT}
              outputFormat={ENumberOutputFormat.INTEGER}
              data-test-id="portfolio-reserved-asset-token-balance"
            />

            <Money
              value={investorTicket.equivEurUlps}
              inputFormat={ENumberInputFormat.ULPS}
              valueType={ECurrency.EUR}
              outputFormat={ENumberOutputFormat.FULL}
              data-test-id="portfolio-reserved-asset-invested-amount"
            />

            <Money
              value={getTokenPrice(investorTicket.equityTokenInt, investorTicket.equivEurUlps)}
              inputFormat={ENumberInputFormat.FLOAT}
              valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
              outputFormat={ENumberOutputFormat.FULL}
              data-test-id="portfolio-reserved-token-price"
            />

            <Money
              value={investorTicket.rewardNmkUlps.toString()}
              inputFormat={ENumberInputFormat.ULPS}
              valueType={ECurrency.NEU}
              outputFormat={ENumberOutputFormat.FULL}
              data-test-id="portfolio-reserved-asset-neu-reward"
            />
            <span data-test-id="portfolio-reserved-asset-status">
              {isWhitelistedOrPublic ? (
                <span className={"text-uppercase"}>
                  <FormattedMessage
                    id="shared-component.eto-overview.invest.ends-in"
                    values={{
                      endsIn: (
                        <FormattedRelative
                          value={eto.contract!.startOfStates[EETOStateOnChain.Signing]!}
                          style="numeric"
                          initialNow={new Date()}
                        />
                      ),
                    }}
                  />
                </span>
              ) : (
                <ETOInvestorState eto={eto} size={EProjectStatusSize.SMALL} />
              )}
            </span>

            <PortfolioAssetAction state={timedState} etoId={eto.etoId} />
          </NewTableRow>
        );
      })}
    </NewTable>
  </Container>
);

export { PortfolioReservedAssets };
