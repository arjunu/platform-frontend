import { branch, compose, renderComponent, setDisplayName, withProps } from "recompose";

import { TEtoInvestmentCalculatedValues } from "../../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IPledge } from "../../../../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import {
  selectIsAuthorized,
  selectIsInvestor,
  selectIsVerifiedInvestor,
} from "../../../../../modules/auth/selectors";
import {
  selectInvestorCount,
  selectMyPledge,
  selectPledgedAmount,
} from "../../../../../modules/bookbuilding-flow/selectors";
import {
  calculateWhitelistingState,
  EWhitelistingState,
} from "../../../../../modules/bookbuilding-flow/utils";
import { EETOStateOnChain } from "../../../../../modules/eto/types";
import { appConnect } from "../../../../../store";
import { OmitKeys } from "../../../../../types";
import { LoadingIndicator } from "../../../../shared/loading-indicator/LoadingIndicator";

interface IExternalProps {
  etoId: string;
  investorsLimit: number;
  minPledge: number;
  investmentCalculatedValues?: TEtoInvestmentCalculatedValues;
  nextState: EETOStateOnChain;
  nextStateStartDate?: Date;
  whitelistingIsActive: boolean;
  keyQuoteFounder: string;
  canEnableBookbuilding: boolean;
  isEmbedded: boolean;
}

interface IStateProps {
  pledgedAmount: number;
  investorsCount: number;
  isAuthorized: boolean;
  isInvestor: boolean;
  isVerifiedInvestor: boolean;
  pledge?: IPledge;
}

interface IWithProps {
  whitelistingState: EWhitelistingState;
  countdownDate: Date | undefined;
  maxPledge?: number;
}

type TComponentProps = OmitKeys<IExternalProps, "canEnableBookbuilding" | "whitelistingIsActive"> &
  IStateProps &
  IWithProps;

const connectCampaigningActivatedWidget = (
  WrappedComponent: React.ComponentType<TComponentProps>,
) =>
  compose<TComponentProps, IExternalProps>(
    setDisplayName("CampaigningActivatedWidget"),
    appConnect<IStateProps, {}, IExternalProps>({
      stateToProps: (state, props) => ({
        isAuthorized: selectIsAuthorized(state.auth),
        isInvestor: selectIsInvestor(state),
        isVerifiedInvestor: selectIsVerifiedInvestor(state),
        pledgedAmount: selectPledgedAmount(state, props.etoId),
        investorsCount: selectInvestorCount(state, props.etoId),
        pledge: selectMyPledge(state, props.etoId),
      }),
    }),

    // TODO: check why with `maxPledge` missing error is not shown
    withProps<IWithProps, IStateProps & IExternalProps>(
      ({
        nextStateStartDate,
        whitelistingIsActive,
        canEnableBookbuilding,
        investorsLimit,
        investorsCount,
        investmentCalculatedValues,
      }) => {
        const bookbuildingLimitReached = investorsLimit - investorsCount === 0;
        return {
          whitelistingState: calculateWhitelistingState({
            canEnableBookbuilding,
            whitelistingIsActive,
            bookbuildingLimitReached,
            investorsCount,
          }),
          maxPledge: investmentCalculatedValues && investmentCalculatedValues.effectiveMaxTicket,
          countdownDate:
            !!nextStateStartDate && nextStateStartDate > new Date()
              ? nextStateStartDate
              : undefined,
        };
      },
    ),
    branch<IWithProps & IExternalProps>(
      ({ whitelistingState, investmentCalculatedValues }) =>
        whitelistingState === EWhitelistingState.ACTIVE && !investmentCalculatedValues,
      renderComponent(LoadingIndicator),
    ),
  )(WrappedComponent);

export { connectCampaigningActivatedWidget, TComponentProps };
