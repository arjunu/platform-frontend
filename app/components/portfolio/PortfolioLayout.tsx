import BigNumber from "bignumber.js";
import * as cn from "classnames";
import { map } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { TETOWithInvestorTicket } from "../../modules/investor-tickets/types";
import { ETOStateOnChain } from "../../modules/public-etos/types";
import { divideBigNumbers } from "../../utils/BigNumberUtils";
import { documentTitles } from "../Documents";
import { AssetPortfolio } from "../shared/AssetPortfolio";
import { Button } from "../shared/buttons";
import { Document } from "../shared/Document";
import { NewTable, NewTableRow } from "../shared/NewTable";
import { ProjectStatus } from "../shared/ProjectStatus";
import { SectionHeader } from "../shared/SectionHeader";
import { PortfolioAssetAction } from "./PorfolioAssetAction";

import * as arrowIcon from "../../assets/img/inline_icons/arrow_right.svg";
import * as neuIcon from "../../assets/img/neu_icon.svg";
import * as styles from "./PortfolioLayout.module.scss";

type TProps = {
  myAssets: TETOWithInvestorTicket[];
  pendingAssets: TETOWithInvestorTicket[];
};

const getNeuReward = (equityTokenInt: BigNumber, equivEurUlps: BigNumber): string => {
  if (equivEurUlps.isZero()) {
    return "0";
  }

  return divideBigNumbers(equityTokenInt, equivEurUlps).toString();
};

const PortfolioLayout: React.SFC<TProps> = ({ myAssets, pendingAssets }) => (
  <>
    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.asset-portfolio.title" />
    </SectionHeader>
    <Row>
      <Col className="mb-4">
        <AssetPortfolio
          icon={neuIcon}
          currency="neu"
          currencyTotal="eur"
          largeNumber="1000000000000"
          value="10000000000000"
          theme="light"
          size="large"
          moneyValue="100000000"
          moneyChange={-20}
          tokenValue="1000000"
          tokenChange={20}
        />
      </Col>
    </Row>

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.dividends-from-neu.title" />
      <img src={neuIcon} alt="neu token" className={cn("ml-2", styles.token)} />
    </SectionHeader>

    <Row>
      <Col className="mb-4">
        <NewTable
          titles={[
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.token" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.balance" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.value-eur" />,
            "",
            "",
          ]}
        >
          <NewTableRow>
            <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.tokenSmall)} />
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
            <span>balance</span>
            <span>value</span>
            {""}
            {""}
            <Button layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
              <FormattedMessage id="portfolio.section.dividends-from-neu.table.claim" />
            </Button>
          </NewTableRow>
          <NewTableRow>
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.tokenSmall)} />
              <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
            </>
            <span>balance</span>
            <span>value</span>
            {""}
            {""}
            <Button layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
              <FormattedMessage id="portfolio.section.dividends-from-neu.table.claim" />
            </Button>
          </NewTableRow>
        </NewTable>
      </Col>
    </Row>

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.reserved-assets.title" />
    </SectionHeader>

    <Row>
      <Col className="mb-4">
        <NewTable
          keepRhythm={true}
          titles={[
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.token" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.balance" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.value-eur" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.price-eur" />,
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.tokenSmall)} />
              <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
            </>,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.eto-status" />,
          ]}
        >
          {pendingAssets.map(
            ({ equityTokenImage, equityTokenName, investorTicket, contract, etoId }) => {
              const timedState = contract!.timedState!;
              const isWhitelistedOrPublic =
                timedState === ETOStateOnChain.Whitelist || timedState === ETOStateOnChain.Public;

              return (
                <NewTableRow key={etoId}>
                  <>
                    <img src={equityTokenImage} alt="" className={cn("mr-2", styles.token)} />
                    <span>{equityTokenName}</span>
                  </>
                  <>{investorTicket.equityTokenInt.toString()}</>
                  <>{investorTicket.equivEurUlps.toString()}</>
                  <>{getNeuReward(investorTicket.equityTokenInt, investorTicket.equivEurUlps)}</>
                  <>{investorTicket.rewardNmkUlps.toString()}</>
                  <>
                    {isWhitelistedOrPublic ? (
                      <>Ends in {}</>
                    ) : (
                      <ProjectStatus status={timedState} />
                    )}
                  </>
                  <PortfolioAssetAction state={timedState} etoId={etoId} />
                </NewTableRow>
              );
            },
          )}
        </NewTable>
      </Col>
    </Row>

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.your-assets.title" />
    </SectionHeader>

    <Row>
      <Col className="mb-4">
        <NewTable
          keepRhythm={true}
          titles={[
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.token" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.balance" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.value-eur" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.price-eur" />,
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.tokenSmall)} />
              <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
            </>,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.documents" />,
          ]}
        >
          {pendingAssets.map(
            ({ equityTokenImage, equityTokenName, investorTicket, contract, etoId, documents }) => {
              return (
                <NewTableRow key={etoId}>
                  <>
                    <img src={equityTokenImage} alt="" className={cn("mr-2", styles.token)} />
                    <span>{equityTokenName}</span>
                  </>
                  <>{investorTicket.equityTokenInt.toString()}</>
                  <>{investorTicket.equivEurUlps.toString()}</>
                  <>{getNeuReward(investorTicket.equityTokenInt, investorTicket.equivEurUlps)}</>
                  <>{investorTicket.rewardNmkUlps.toString()}</>
                  <>
                    {map(
                      (document: IEtoDocument) => (
                        <span key={document.ipfsHash} className={styles.documentLink}>
                          <Document extension="pdf" />
                          <a href={document.name} download>
                            {documentTitles[document.documentType]}
                          </a>
                        </span>
                      ),
                      documents,
                    )}
                  </>
                </NewTableRow>
              );
            },
          )}
        </NewTable>
      </Col>
    </Row>
  </>
);

export { PortfolioLayout };
