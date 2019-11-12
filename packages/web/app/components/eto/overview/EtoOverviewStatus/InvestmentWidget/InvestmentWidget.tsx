import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { EEtoState } from "../../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { actions } from "../../../../../modules/actions";
import {
  selectIsAuthorized,
  selectIsInvestor,
  selectIsUSInvestor,
} from "../../../../../modules/auth/selectors";
import { InvalidETOStateError } from "../../../../../modules/eto/errors";
import { selectEtoOnChainNextStateStartDate } from "../../../../../modules/eto/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../../../../modules/eto/types";
import { isOnChain } from "../../../../../modules/eto/utils";
import { selectIsUserVerifiedOnBlockchain } from "../../../../../modules/kyc/selectors";
import { appConnect } from "../../../../../store";
import { OmitKeys } from "../../../../../types";
import { invariant } from "../../../../../utils/invariant";
import { appRoutes } from "../../../../appRoutes";
import { etoPublicViewLink } from "../../../../appRouteUtils";
import { Button, ButtonLink } from "../../../../shared/buttons";
import { FormatNumber } from "../../../../shared/formatters/FormatNumber";
import { Money } from "../../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../../shared/formatters/utils";
import { InvestmentProgress } from "../../InvestmentProgress";
import { EndTimeWidget } from "../../shared/EndTimeWidget";
import { FundraisingBreakdownTooltip } from "./FundraisingBreakdownTooltip";
import { USInvestorMessage } from "./USInvestorMessage";

import * as styles from "./InvestmentWidget.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContractReadonly;
  isEmbedded: boolean;
}

interface IInvestmentStatsProps {
  eto: TEtoWithCompanyAndContractReadonly;
}

interface IStateProps {
  isAuthorized: boolean;
  isAllowedToInvest: boolean;
  isInvestor: boolean;
  isUsInvestor: boolean;
  nextStateDate: Date | undefined;
}

interface IDispatchProps {
  startInvestmentFlow: () => void;
}

type TInvestWidgetProps = IExternalProps & OmitKeys<IStateProps, "isUsInvestor"> & IDispatchProps;

const InvestNowButton: React.FunctionComponent<TInvestWidgetProps> = ({
  eto,
  isAuthorized,
  isAllowedToInvest,
  isInvestor,
  startInvestmentFlow,
  nextStateDate,
  isEmbedded,
}) => {
  const investNowButtonSelector = () => {
    // in case it's an in embedded iframe show invest now button with redirect to eto page
    if (isEmbedded) {
      return (
        <ButtonLink
          to={etoPublicViewLink(eto.previewCode, eto.product.jurisdiction)}
          target="_blank"
          data-test-id="eto-widget-invest-now-button"
        >
          <FormattedMessage id="shared-component.eto-overview.invest-now" />
        </ButtonLink>
      );
    }

    // for not authorized users forward to registration page
    if (!isAuthorized) {
      return (
        <ButtonLink to={appRoutes.register} data-test-id="eto-widget-register-to-invest-button">
          <FormattedMessage id="shared-component.eto-overview.register-to-invest" />
        </ButtonLink>
      );
    }

    // investor can either be allowed or not allowed to invest
    if (isInvestor) {
      return isAllowedToInvest ? (
        <Button onClick={startInvestmentFlow} data-test-id={`eto-invest-now-button-${eto.etoId}`}>
          <FormattedMessage id="shared-component.eto-overview.invest-now" />
        </Button>
      ) : (
        <ButtonLink
          to={appRoutes.profile}
          data-test-id="eto-overview-settings-update-required-to-invest"
        >
          <FormattedMessage id="shared-component.eto-overview.settings-update-required" />
        </ButtonLink>
      );
    }

    return invariant(false, "Investment button should not be shown at this stage");
  };

  return (
    <div className={styles.investNowButton}>
      {investNowButtonSelector()}
      {nextStateDate && <EndTimeWidget endTime={nextStateDate} className={styles.endTime} />}
    </div>
  );
};

const InvestmentStats: React.FunctionComponent<IInvestmentStatsProps> = ({ eto }) => {
  if (!isOnChain(eto)) {
    throw new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN);
  }

  const totalInvestors = eto.contract.totalInvestment.totalInvestors;
  return (
    <div>
      <div className={styles.header}>
        <div>
          {"≈"}
          <Money
            data-test-id="investment-widget-total-nEur-invested"
            value={eto.contract.totalInvestment.totalEquivEurUlps}
            inputFormat={ENumberInputFormat.ULPS}
            valueType={ECurrency.EUR}
            outputFormat={ENumberOutputFormat.FULL}
          />
          <FundraisingBreakdownTooltip
            etherTokenBalance={eto.contract.totalInvestment.etherTokenBalance}
            euroTokenBalance={eto.contract.totalInvestment.euroTokenBalance}
          />
        </div>
        {process.env.NF_MAY_SHOW_INVESTOR_STATS === "1" && (
          <div>
            <FormattedMessage
              id="shared-component.eto-overview.investors"
              values={{
                totalInvestors,
                totalInvestorsAsString: (
                  <FormatNumber
                    data-test-id="investment-widget-investors-invested"
                    value={totalInvestors}
                    outputFormat={ENumberOutputFormat.INTEGER}
                    inputFormat={ENumberInputFormat.FLOAT}
                  />
                ),
              }}
            />
          </div>
        )}
      </div>
      <InvestmentProgress eto={eto} />
    </div>
  );
};

const InvestmentWidgetLayout: React.FunctionComponent<TInvestWidgetProps> = props => (
  <section className={styles.investmentWidget} data-test-id="investment-widget">
    <InvestmentStats eto={props.eto} />
    {/* in case it's not an investor (issuer/nominee) don't show any button */}
    {(!props.isAuthorized || props.isInvestor) && <InvestNowButton {...props} />}
  </section>
);

const InvestmentWidget = compose<TInvestWidgetProps, IExternalProps>(
  appConnect<IStateProps, IDispatchProps, IExternalProps>({
    stateToProps: (state, props) => ({
      isAuthorized: selectIsAuthorized(state.auth),
      isAllowedToInvest: selectIsUserVerifiedOnBlockchain(state),
      isInvestor: selectIsInvestor(state),
      isUsInvestor: selectIsUSInvestor(state),
      nextStateDate: selectEtoOnChainNextStateStartDate(state, props.eto.previewCode),
    }),
    dispatchToProps: (dispatch, props) => ({
      startInvestmentFlow: () => dispatch(actions.investmentFlow.startInvestment(props.eto.etoId)),
    }),
  }),
  branch<IStateProps>(props => props.isUsInvestor, renderComponent(USInvestorMessage)),
)(InvestmentWidgetLayout);

export { InvestmentWidgetLayout, InvestmentWidget };
