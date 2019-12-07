import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../modules/actions";
import { selectMyAssetsWithTokenData } from "../../modules/investor-portfolio/selectors";
import { TETOWithTokenData } from "../../modules/investor-portfolio/types";
import { selectNeuPriceEur } from "../../modules/shared/tokenPrice/selectors";
import { selectNeuBalance, selectNeumarkAddress } from "../../modules/wallet/selectors";
import { appConnect } from "../../store";
import { multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { commitmentStatusLink } from "../appRouteUtils";
import { DashboardHeading } from "../eto/shared/DashboardHeading";
import { Container } from "../layouts/Container";
import { Button, ButtonLink, EButtonLayout, EButtonSize } from "../shared/buttons";
import { FormatNumber } from "../shared/formatters/FormatNumber";
import { Money } from "../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  EPriceFormat,
} from "../shared/formatters/utils";
import { TokenIcon } from "../shared/icons/TokenIcon";
import { ENewTableCellLayout, NewTable, NewTableRow } from "../shared/table";

import * as neuIcon from "../../assets/img/neu_icon.svg";
import * as styles from "./PortfolioLayout.module.scss";

interface IExternalProps {
  isRetailEto: boolean;
  walletAddress: string;
}

interface IStateProps {
  neumarkAddress: string;
  myNeuBalance: string;
  neuPrice: string;
  neuValue: string;
  myAssets: TETOWithTokenData[];
}

interface IDispatchProps {
  showDownloadAgreementModal: (etoId: string, isRetailEto: boolean) => void;
  startTokenTransfer: (tokenAddress: string, tokenImage: string) => void;
}

interface IAdditionalProps {
  tokenLoaded: boolean;
  setTokenLoaded: (value: boolean) => void;
}

type TComponentProps = IExternalProps & IStateProps & IDispatchProps & IAdditionalProps;

const PortfolioMyAssetsComponent: React.FunctionComponent<TComponentProps> = ({
  myNeuBalance,
  neumarkAddress,
  myAssets,
  startTokenTransfer,
  neuPrice,
  neuValue,
  showDownloadAgreementModal,
  isRetailEto,
  walletAddress,
}) => (
  <Container>
    <DashboardHeading
      title={<FormattedMessage id="portfolio.section.your-assets.title" />}
      description={<FormattedMessage id="portfolio.section.your-assets.description" />}
    />
    <NewTable
      placeholder={<FormattedMessage id="portfolio.section.your-assets.table.placeholder" />}
      titles={[
        <FormattedMessage id="portfolio.section.my-assets.table.header.token" />,
        <FormattedMessage id="portfolio.section.my-assets.table.header.quantity" />,
        <FormattedMessage id="portfolio.section.my-assets.table.header.current-value" />,
        <FormattedMessage id="portfolio.section.my-assets.table.header.current-price" />,
        "",
        "",
      ]}
    >
      {myNeuBalance !== "0" ? (
        <NewTableRow cellLayout={ENewTableCellLayout.MIDDLE}>
          <>
            <TokenIcon srcSet={{ "1x": neuIcon }} alt="" className={cn("mr-2", styles.token)} />
            <span>{"NEU"}</span>
          </>
          <Money
            value={myNeuBalance}
            inputFormat={ENumberInputFormat.ULPS}
            valueType={ECurrency.NEU}
            outputFormat={ENumberOutputFormat.FULL}
          />
          <Money
            value={neuValue}
            inputFormat={ENumberInputFormat.ULPS}
            valueType={ECurrency.EUR}
            outputFormat={ENumberOutputFormat.FULL}
          />
          <Money
            value={neuPrice}
            inputFormat={ENumberInputFormat.FLOAT}
            valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
            outputFormat={ENumberOutputFormat.FULL}
          />
          <Button
            size={EButtonSize.SMALL}
            layout={EButtonLayout.PRIMARY}
            onClick={() => startTokenTransfer(neumarkAddress, neuIcon)}
            data-test-id="portfolio-my-assets-neu-agreements"
          >
            <FormattedMessage id="portfolio.section.my-assets.send" />
          </Button>
          <ButtonLink
            to={commitmentStatusLink(walletAddress)}
            layout={EButtonLayout.GHOST}
            size={EButtonSize.SMALL}
            data-test-id="portfolio-my-assets-neu-agreements"
          >
            <FormattedMessage id="portfolio.section.my-assets.download-agreements" />
          </ButtonLink>
        </NewTableRow>
      ) : null}

      {myAssets &&
        myAssets
          .filter(v => v.tokenData)
          .filter(v => v.tokenData.balance !== "0")
          .map(
            ({
              equityTokenImage,
              equityTokenName,
              etoId,
              tokenData,
              equityTokenSymbol,
              contract,
            }) => (
              <NewTableRow
                key={etoId}
                cellLayout={ENewTableCellLayout.MIDDLE}
                data-test-id={`portfolio-my-assets-token-${etoId}`}
              >
                <>
                  <TokenIcon
                    srcSet={{ "1x": equityTokenImage }}
                    alt=""
                    className={cn("mr-2", styles.token)}
                  />
                  <span className={styles.tokenName}>
                    {equityTokenName} ({equityTokenSymbol})
                  </span>
                </>
                <span data-test-id={`portfolio-my-assets-token-balance-${etoId}`}>
                  <FormatNumber
                    value={tokenData.balance}
                    inputFormat={ENumberInputFormat.FLOAT}
                    outputFormat={ENumberOutputFormat.INTEGER}
                  />
                </span>
                <Money
                  value={multiplyBigNumbers([tokenData.tokenPrice, tokenData.balance])}
                  inputFormat={ENumberInputFormat.ULPS}
                  valueType={ECurrency.EUR}
                  outputFormat={ENumberOutputFormat.FULL}
                />
                <Money
                  value={tokenData.tokenPrice}
                  inputFormat={ENumberInputFormat.ULPS}
                  valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
                  outputFormat={ENumberOutputFormat.FULL}
                />
                <Button
                  disabled={!tokenData.canTransferToken}
                  data-test-id={`modals.portfolio.portfolio-assets.send-token-${etoId}`}
                  className="text-center"
                  size={EButtonSize.SMALL}
                  onClick={() => startTokenTransfer(contract!.equityTokenAddress, equityTokenImage)}
                  layout={EButtonLayout.PRIMARY}
                >
                  <FormattedMessage id="portfolio.section.my-assets.send" />
                </Button>

                <Button
                  onClick={() => showDownloadAgreementModal(etoId, isRetailEto)}
                  layout={EButtonLayout.GHOST}
                  size={EButtonSize.SMALL}
                  data-test-id={`modals.portfolio.portfolio-assets.download-agreements-${etoId}`}
                >
                  <FormattedMessage id="portfolio.section.my-assets.download-agreements" />
                </Button>
              </NewTableRow>
            ),
          )}
    </NewTable>
  </Container>
);

const PortfolioMyAssets = compose<TComponentProps, IExternalProps>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const neuPrice = selectNeuPriceEur(state);
      const myNeuBalance = selectNeuBalance(state);
      const neumarkAddress = selectNeumarkAddress(state);

      return {
        myNeuBalance,
        neuPrice,
        neumarkAddress,
        neuValue: multiplyBigNumbers([myNeuBalance, neuPrice]),
        myAssets: selectMyAssetsWithTokenData(state)!,
      };
    },
    dispatchToProps: dispatch => ({
      startTokenTransfer: (tokenAddress: string, tokenImage: string) =>
        dispatch(actions.txTransactions.startTokenTransfer(tokenAddress, tokenImage)),
      showDownloadAgreementModal: (etoId: string, isRetailEto: boolean) => {
        dispatch(actions.portfolio.showDownloadAgreementModal(etoId, isRetailEto));
      },
    }),
  }),
)(PortfolioMyAssetsComponent);

export { PortfolioMyAssets };
