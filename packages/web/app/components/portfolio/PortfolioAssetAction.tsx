import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../modules/actions";
import { selectEtoWithCompanyAndContractById } from "../../modules/eto/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContractReadonly } from "../../modules/eto/types";
import { appConnect } from "../../store";
import {
  EInvestmentStatusSize,
  InvestmentStatusWidget,
} from "../eto/overview/EtoOverviewStatus/InvestmentWidget/InvestmentStatusWidget";
import { Button, EButtonLayout, EButtonSize, EIconPosition } from "../shared/buttons";

import arrowRight from "../../assets/img/inline_icons/arrow_right.svg";

type TExternalProps = {
  state: EETOStateOnChain;
  etoId: string;
};

interface IDispatchProps {
  onClaim: (etoId: string) => void;
  onRefund: (etoId: string) => void;
}

interface IStateProps {
  eto: TEtoWithCompanyAndContractReadonly;
}

const PortfolioAssetActionComponent: React.FunctionComponent<TExternalProps &
  IDispatchProps &
  IStateProps> = ({ state, etoId, onClaim, eto, onRefund }) => {
  switch (state) {
    case EETOStateOnChain.Claim:
    case EETOStateOnChain.Payout:
      return (
        <Button
          onClick={() => onClaim(etoId)}
          layout={EButtonLayout.GHOST}
          iconPosition={EIconPosition.ICON_AFTER}
          svgIcon={arrowRight}
          data-test-id={"modals.portfolio.portfolio-asset-action.claim-" + etoId}
          size={EButtonSize.SMALL}
        >
          <FormattedMessage id="portfolio.section.reserved-assets.claim-tokens" />
        </Button>
      );
    case EETOStateOnChain.Refund:
      return (
        <Button
          onClick={() => onRefund(etoId)}
          layout={EButtonLayout.GHOST}
          iconPosition={EIconPosition.ICON_AFTER}
          svgIcon={arrowRight}
          size={EButtonSize.SMALL}
        >
          <FormattedMessage id="portfolio.section.reserved-assets.refund" />
        </Button>
      );
    case EETOStateOnChain.Signing:
      return (
        <Button layout={EButtonLayout.GHOST} size={EButtonSize.SMALL} disabled>
          <FormattedMessage id="portfolio.section.reserved-assets.wait-for-update" />
        </Button>
      );

    case EETOStateOnChain.Public:
    case EETOStateOnChain.Whitelist:
      return <InvestmentStatusWidget eto={eto} size={EInvestmentStatusSize.SMALL} />;

    default:
      return null;
  }
};

const PortfolioAssetAction = appConnect<IStateProps, IDispatchProps, TExternalProps>({
  stateToProps: (state, props) => ({
    eto: selectEtoWithCompanyAndContractById(state, props.etoId)!,
  }),
  dispatchToProps: dispatch => ({
    onClaim: (etoId: string) => dispatch(actions.txTransactions.startUserClaim(etoId)),
    onRefund: (etoId: string) => dispatch(actions.txTransactions.startInvestorRefund(etoId)),
  }),
})(PortfolioAssetActionComponent);

export { PortfolioAssetAction };
