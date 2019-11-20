import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EEtoState } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import {
  EETOStateOnChain,
  EEtoSubState,
  TEtoWithCompanyAndContractReadonly,
} from "../../../modules/eto/types";
import { isComingSoon, isOnChain } from "../../../modules/eto/utils";
import { CommonHtmlProps, Dictionary, PartialDictionary, TTranslatedString } from "../../../types";

import * as styles from "./ETOState.module.scss";

export enum EProjectStatusSize {
  MEDIUM = "medium",
  LARGE = "large",
  SMALL = "small",
  HUGE = "huge",
}

export enum EProjectStatusLayout {
  NORMAL = "normal",
  BLACK = "black",
  INHERIT = "inherit",
}

interface IExternalProps {
  eto: TEtoWithCompanyAndContractReadonly;
}

interface ISizeLayoutProps {
  size?: EProjectStatusSize;
  layout?: EProjectStatusLayout;
}

export const generalStateToName: Dictionary<
  TTranslatedString,
  EEtoState | EETOStateOnChain | EEtoSubState
> = {
  [EEtoState.PREVIEW]: <FormattedMessage id="shared-component.eto-overview.status-in-preview" />,
  [EEtoState.PENDING]: <FormattedMessage id="shared-component.eto-overview.status-pending" />,
  [EEtoState.LISTED]: <FormattedMessage id="shared-component.eto-overview.status-listed" />,
  [EEtoState.PROSPECTUS_APPROVED]: (
    <FormattedMessage id="shared-component.eto-overview.status-prospectus-approved" />
  ),
  [EEtoState.ON_CHAIN]: <FormattedMessage id="shared-component.eto-overview.status-on-chain" />,
  [EEtoState.SUSPENDED]: <FormattedMessage id="shared-component.eto-overview.status-suspended" />,

  // on chain state mappings
  [EETOStateOnChain.Setup]: <FormattedMessage id="eto.status.onchain.setup" />,
  [EETOStateOnChain.Whitelist]: <FormattedMessage id="eto.status.onchain.whitelist" />,
  [EETOStateOnChain.Public]: <FormattedMessage id="eto.status.onchain.public" />,
  [EETOStateOnChain.Signing]: <FormattedMessage id="eto.status.onchain.signing" />,
  [EETOStateOnChain.Claim]: <FormattedMessage id="eto.status.onchain.claim" />,
  [EETOStateOnChain.Payout]: <FormattedMessage id="eto.status.onchain.payout" />,
  [EETOStateOnChain.Refund]: <FormattedMessage id="eto.status.onchain.refund" />,

  // on chain sub state mappings
  [EEtoSubState.MARKETING_LISTING_IN_REVIEW]: (
    <FormattedMessage id="eto.status.sub-state.marketing-listing-in-review" />
  ),
  [EEtoSubState.CAMPAIGNING]: <FormattedMessage id="eto.status.onchain.setup" />,
  [EEtoSubState.WHITELISTING]: <FormattedMessage id="eto.status.sub-state.whitelisting" />,
  [EEtoSubState.COUNTDOWN_TO_PRESALE]: <FormattedMessage id="eto.status.onchain.setup" />,
  [EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE]: <FormattedMessage id="eto.status.onchain.setup" />,
};

export const issuerOnChainStateToName: PartialDictionary<TTranslatedString, EETOStateOnChain> = {
  // on chain state mappings
  [EETOStateOnChain.Whitelist]: <FormattedMessage id="eto.status.onchain.whitelist" />,
  [EETOStateOnChain.Claim]: <FormattedMessage id="eto.status.onchain.issuer-withdraw-funds" />,
  [EETOStateOnChain.Payout]: <FormattedMessage id="eto.status.onchain.issuer-withdraw-funds" />,
};

const stateToClassName: Partial<Record<EEtoState | EETOStateOnChain | EEtoSubState, string>> = {
  [EEtoState.PREVIEW]: styles.blue,
  [EEtoState.PENDING]: styles.orange,
  [EEtoState.LISTED]: styles.green,
  [EEtoState.SUSPENDED]: styles.red,
  // eto on chain states
  [EETOStateOnChain.Whitelist]: styles.green,
  [EETOStateOnChain.Public]: styles.green,
  [EETOStateOnChain.Claim]: styles.green,
  [EETOStateOnChain.Payout]: styles.green,
  [EETOStateOnChain.Refund]: styles.red,
  [EETOStateOnChain.Signing]: styles.blue,

  // eto sub states
  [EEtoSubState.MARKETING_LISTING_IN_REVIEW]: styles.orange,
  [EEtoSubState.CAMPAIGNING]: styles.green,
  [EEtoSubState.WHITELISTING]: styles.green,
  [EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE]: styles.green,
  [EEtoSubState.COUNTDOWN_TO_PRESALE]: styles.green,
};

const getState = (
  eto: TEtoWithCompanyAndContractReadonly,
): EETOStateOnChain | EEtoState | EEtoSubState => {
  if (eto.subState) {
    return eto.subState;
  } else if (isOnChain(eto)) {
    return eto.contract.timedState;
  } else {
    return eto.state;
  }
};

const ComingSoonEtoState: React.FunctionComponent<ISizeLayoutProps & CommonHtmlProps> = ({
  className,
  size = EProjectStatusSize.MEDIUM,
  layout = EProjectStatusLayout.NORMAL,
}) => (
  <div
    className={cn(styles.projectStatus, styles.green, size, layout, className)}
    data-test-id="eto-state-coming-soon"
  >
    <FormattedMessage id="eto.status.sub-state.coming-soon" />
  </div>
);

const SuccessEtoState: React.FunctionComponent<ISizeLayoutProps & CommonHtmlProps> = ({
  className,
  size = EProjectStatusSize.MEDIUM,
  layout = EProjectStatusLayout.NORMAL,
}) => (
  <div
    className={cn(styles.projectStatus, styles.green, size, layout, className)}
    data-test-id="eto-state-mock-successful"
  >
    <FormattedMessage id="eto.status.mock.success" />
  </div>
);

const ETOIssuerState: React.FunctionComponent<IExternalProps &
  ISizeLayoutProps &
  CommonHtmlProps> = ({
  eto,
  className,
  size = EProjectStatusSize.MEDIUM,
  layout = EProjectStatusLayout.NORMAL,
}) => {
  const state = getState(eto);
  const timedState = isOnChain(eto) ? eto.contract.timedState : undefined;

  return (
    <div
      className={cn(styles.projectStatus, stateToClassName[state], size, layout, className)}
      data-test-id={`eto-state-${state}`}
    >
      {(timedState && issuerOnChainStateToName[timedState]) || generalStateToName[state]}
    </div>
  );
};

const ETOInvestorState: React.FunctionComponent<IExternalProps &
  ISizeLayoutProps &
  CommonHtmlProps> = ({
  eto,
  className,
  size = EProjectStatusSize.MEDIUM,
  layout = EProjectStatusLayout.NORMAL,
}) => {
  if (isComingSoon(eto.state)) {
    return <ComingSoonEtoState />;
  }

  const state = getState(eto);

  return (
    <div
      className={cn(styles.projectStatus, stateToClassName[state], size, layout, className)}
      data-test-id={`eto-state-${state}`}
    >
      {generalStateToName[state]}
    </div>
  );
};

export { ETOIssuerState, ETOInvestorState, ComingSoonEtoState, SuccessEtoState };
