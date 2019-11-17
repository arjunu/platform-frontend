import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import {
  selectIcbmWalletConnected,
  selectLockedWalletConnected,
  selectTotalEtherBalance,
  selectTotalEtherBalanceEuroAmount,
  selectTotalEuroBalance,
  selectTotalEuroTokenBalance,
} from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { CommonHtmlProps } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { appRoutes } from "../../appRoutes";
import { EColumnSpan } from "../../layouts/Container";
import { ButtonLink, EButtonLayout, EIconPosition } from "../../shared/buttons";
import { Money } from "../../shared/formatters/Money";
import { ECurrency, ENumberInputFormat, ENumberOutputFormat } from "../../shared/formatters/utils";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget/MoneySuiteWidget";
import { Panel } from "../../shared/Panel";
import { ECustomTooltipTextPosition, Tooltip } from "../../shared/tooltips";
import { WarningAlert } from "../../shared/WarningAlert";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as moneyIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./MyWalletWidget.module.scss";

type StateProps = {
  isLoading: boolean;
  error?: string;
  data?: {
    euroTokenAmount: string;
    ethAmount: string;
    ethEuroAmount: string;
    totalAmount: string;
    isIcbmWalletConnected: boolean;
    isLockedWalletConnected: boolean;
  };
};

export const MyWalletWidgetComponentBody: React.FunctionComponent<StateProps> = props => {
  if (props.isLoading) {
    return (
      <div>
        <LoadingIndicator />
      </div>
    );
  } else if (props.error) {
    return <WarningAlert>{props.error}</WarningAlert>;
  } else {
    const {
      euroTokenAmount,
      ethAmount,
      ethEuroAmount,
      totalAmount,
      isIcbmWalletConnected,
      isLockedWalletConnected,
    } = props.data!;

    return (
      <>
        <Row>
          <Col className={styles.moneySuiteWrapper} xs={12} sm={6} lg={12}>
            <MoneySuiteWidget
              currency={ECurrency.EUR_TOKEN}
              largeNumber={euroTokenAmount}
              icon={moneyIcon}
              value={euroTokenAmount}
              currencyTotal={ECurrency.EUR}
              data-test-id="my-wallet-widget-eur-token"
            />
          </Col>
          <Col className={styles.moneySuiteWrapper} xs={12} sm={6} lg={12}>
            <MoneySuiteWidget
              currency={ECurrency.ETH}
              largeNumber={ethAmount}
              icon={ethIcon}
              value={ethEuroAmount}
              currencyTotal={ECurrency.EUR}
              data-test-id="my-wallet-widget-eth-token"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className={`${styles.total} mt-3 mb-3 d-flex align-items-center`}>
              <span className={cn(styles.smallFont)}>
                <FormattedMessage id="dashboard.my-wallet-widget.total" />
              </span>
              <Money
                value={totalAmount}
                valueType={ECurrency.EUR}
                inputFormat={ENumberInputFormat.ULPS}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                className={cn(styles.money, "pl-1 pl-sm-2 m-0")}
                data-test-id="my-wallet-widget-total"
              />
            </div>
          </Col>
        </Row>
        {process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED === "1" &&
          process.env.NF_CHECK_LOCKED_WALLET_WIDGET_IN_DASHBOARD === "1" &&
          (!(isIcbmWalletConnected || isLockedWalletConnected) && (
            <Row data-test-id="my-wallet-widget-icbm-help-text">
              <Col>
                <p className={styles.icbmWallet}>
                  <FormattedMessage id="dashboard.my-portfolio-widget.cant-see-your-icbm-wallet" />
                  <br />
                  <Link to={appRoutes.profile} className={styles.link}>
                    <FormattedMessage id="dashboard.my-portfolio-widget.check-it-here" />
                  </Link>
                  <Tooltip
                    content={<FormattedMessage id="icbm-wallet.tooltip" />}
                    textPosition={ECustomTooltipTextPosition.LEFT}
                  />
                </p>
              </Col>
            </Row>
          ))}
      </>
    );
  }
};

export const MyWalletWidgetComponent: React.FunctionComponent<CommonHtmlProps & StateProps> = ({
  ...props
}) => (
  <Panel
    columnSpan={EColumnSpan.ONE_COL}
    headerText={
      <FormattedMessage id="components.dashboard.my-wallet.my-wallet-widget.header-text" />
    }
    rightComponent={
      <ButtonLink
        to={appRoutes.wallet}
        layout={EButtonLayout.GHOST}
        iconPosition={EIconPosition.ICON_AFTER}
        svgIcon={arrowRight}
        className={cn(styles.link, "pr-0")}
      >
        <FormattedMessage id="dashboard.my-wallet-widget.main-wallet-redirect-button" />
      </ButtonLink>
    }
  >
    <MyWalletWidgetComponentBody {...props} />
  </Panel>
);

export const MyWalletWidget = compose<React.FunctionComponent<CommonHtmlProps>>(
  onEnterAction({ actionCreator: d => d(actions.wallet.loadWalletData()) }),
  appConnect<StateProps>({
    stateToProps: s => {
      const isLoading = s.wallet.loading;
      const error = s.wallet.error;

      if (!isLoading && !error) {
        const state = s;
        return {
          isLoading,
          error,
          data: {
            euroTokenAmount: selectTotalEuroTokenBalance(state),
            ethAmount: selectTotalEtherBalance(state),
            ethEuroAmount: selectTotalEtherBalanceEuroAmount(state),
            totalAmount: selectTotalEuroBalance(state),
            isIcbmWalletConnected: selectIcbmWalletConnected(s.wallet),
            isLockedWalletConnected: selectLockedWalletConnected(s),
          },
        };
      } else {
        return {
          isLoading,
          error,
        };
      }
    },
  }),
)(MyWalletWidgetComponent);
