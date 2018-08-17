import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import {
  selectICBMLockedEtherBalance,
  selectICBMLockedEtherBalanceEuroAmount,
  selectICBMLockedEuroTokenBalance,
  selectICBMLockedEuroTotalAmount,
  selectICBMLockedWalletHasFunds,
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLiquidEuroTokenBalance,
  selectLiquidEuroTotalAmount,
  selectLockedEtherBalance,
  selectLockedEtherBalanceEuroAmount,
  selectLockedEuroTokenBalance,
  selectLockedEuroTotalAmount,
  selectLockedWalletHasFunds,
} from "../../../../modules/wallet/selectors";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { LoadingIndicator } from "../../../shared/LoadingIndicator";
import { ClaimedDividends } from "../../claimed-dividends/ClaimedDividends";
import { IWalletValues, WalletBalance } from "../../wallet-balance/WalletBalance";

const transactions: any[] = [];

interface IStateProps {
  isLoading: boolean;
  error?: string;
  liquidWalletData?: IWalletValues;
  lockedWalletData?: IWalletValues & { hasFunds: boolean };
  icbmWalletData?: IWalletValues & { hasFunds: boolean };
}

interface IDispatchProps {
  goToDepositEuroToken: () => void;
  goToDepositEth: () => void;
}

type TProps = IStateProps & IDispatchProps;

export const WalletStartComponent: React.SFC<TProps> = props =>
  props.isLoading ? (
    <LoadingIndicator />
  ) : (
    <>
      <Row className="row-gutter-top">
        <Col lg={6} xs={12}>
          <WalletBalance
            className="h-100"
            isLocked={false}
            headerText={<FormattedMessage id="components.wallet.start.my-wallet" />}
            isLoading={props.isLoading}
            data={props.liquidWalletData}
          />
        </Col>

        {!props.isLoading &&
          props.lockedWalletData!.hasFunds && (
            <Col lg={6} xs={12}>
              <WalletBalance
                className="h-100"
                isLocked={true}
                headerText={<FormattedMessage id="components.wallet.start.locked-wallet" />}
                isLoading={props.isLoading}
                data={props.lockedWalletData}
              />
            </Col>
          )}

        {!props.isLoading &&
          props.icbmWalletData!.hasFunds && (
            <Col lg={6} xs={12}>
              <WalletBalance
                className="h-100"
                isLocked={true}
                headerText={<FormattedMessage id="components.wallet.start.icbm-wallet" />}
                isLoading={props.isLoading}
                data={props.icbmWalletData}
              />
            </Col>
          )}
      </Row>
      <Row>
        <Col className="my-4">
          <ClaimedDividends className="h-100" totalEurValue="0" recentPayouts={transactions} />
        </Col>
      </Row>
    </>
  );

export const WalletStart = compose<React.SFC>(
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.wallet.startLoadingWalletData()),
  }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => {
      const isLoading = s.wallet.loading;
      const error = s.wallet.error;

      if (!isLoading && !error) {
        const state = s;
        return {
          isLoading,
          error,
          liquidWalletData: {
            ethAmount: selectLiquidEtherBalance(state.wallet),
            ethEuroAmount: selectLiquidEtherBalanceEuroAmount(state),
            neuroAmount: selectLiquidEuroTokenBalance(state.wallet),
            neuroEuroAmount: selectLiquidEuroTokenBalance(state.wallet),
            totalEuroAmount: selectLiquidEuroTotalAmount(state),
          },
          lockedWalletData: {
            hasFunds: selectLockedWalletHasFunds(state),
            ethAmount: selectLockedEtherBalance(state.wallet),
            ethEuroAmount: selectLockedEtherBalanceEuroAmount(state),
            neuroAmount: selectLockedEuroTokenBalance(state.wallet),
            neuroEuroAmount: selectLockedEuroTokenBalance(state.wallet),
            totalEuroAmount: selectLockedEuroTotalAmount(state),
          },
          icbmWalletData: {
            hasFunds: selectICBMLockedWalletHasFunds(state),
            ethAmount: selectICBMLockedEtherBalance(state.wallet),
            ethEuroAmount: selectICBMLockedEtherBalanceEuroAmount(state),
            neuroAmount: selectICBMLockedEuroTokenBalance(state.wallet),
            neuroEuroAmount: selectICBMLockedEuroTokenBalance(state.wallet),
            totalEuroAmount: selectICBMLockedEuroTotalAmount(state),
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
)(WalletStartComponent);
