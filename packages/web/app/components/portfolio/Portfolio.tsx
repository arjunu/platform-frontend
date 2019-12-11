import { withContainer, withMetaTags } from "@neufund/shared";
import { isEqual } from "lodash/fp";
import { branch, compose, lifecycle, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { selectIsVerifiedInvestor } from "../../modules/auth/selectors";
import {
  selectMyAssets,
  selectMyPendingAssets,
  selectPastInvestments,
  selectTokensDisbursal,
} from "../../modules/investor-portfolio/selectors";
import { selectEthereumAddressWithChecksum } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/react-connected-components/OnEnterAction";
import { Layout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../shared/loading-indicator";
import { IPortfolioDispatchProps, PortfolioLayout, TPortfolioLayoutProps } from "./PortfolioLayout";

export type TStateProps = Partial<TPortfolioLayoutProps>;

export const Portfolio = compose<TPortfolioLayoutProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.eto.loadEtos());
      dispatch(actions.eto.loadTokensData());

      if (process.env.NF_ASSETS_PORTFOLIO_COMPONENT_VISIBLE === "1") {
        dispatch(actions.investorEtoTicket.loadClaimables());
      }
    },
  }),
  appConnect<TStateProps, IPortfolioDispatchProps>({
    stateToProps: state => ({
      myAssets: selectMyAssets(state),
      pendingAssets: selectMyPendingAssets(state),
      walletAddress: selectEthereumAddressWithChecksum(state),
      tokensDisbursal: selectTokensDisbursal(state),
      isVerifiedInvestor: selectIsVerifiedInvestor(state),
      pastInvestments: selectPastInvestments(state),
    }),
    dispatchToProps: dispatch => ({
      loadTokensData: () => {
        dispatch(actions.eto.loadTokensData());
      },
    }),
  }),
  lifecycle<TPortfolioLayoutProps & IPortfolioDispatchProps, {}>({
    componentDidUpdate(prevProps): void {
      const prevAssets = prevProps.myAssets;
      const actualAssets = this.props.myAssets;

      if (!isEqual(prevAssets, actualAssets)) {
        this.props.loadTokensData();
      }
    },
  }),
  withContainer(Layout),
  branch(
    (props: TStateProps) => !props.myAssets && !props.pendingAssets,
    renderComponent(LoadingIndicator),
  ),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.portfolio") })),
)(PortfolioLayout);
