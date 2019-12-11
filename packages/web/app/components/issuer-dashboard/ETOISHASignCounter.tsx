import { nonNullable } from "@neufund/shared"
import { Moment } from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderNothing } from "recompose";

import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { selectIsIssuer } from "../../modules/auth/selectors";
import {
  selectIssuerEtoNextStateStartDate,
  selectUploadedInvestmentAgreement,
} from "../../modules/eto-flow/selectors";
import { selectEtoOnChainState } from "../../modules/eto/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContractReadonly } from "../../modules/eto/types";
import { isOnChain } from "../../modules/eto/utils";
import { appConnect, IAppState } from "../../store";
import { DashboardWidget } from "../shared/dashboard-widget/DashboardWidget";
import { IPanelProps } from "../shared/Panel";
import { TimeLeftWithUTC } from "../shared/TimeLeftWithUTC";

import * as styles from "./ETOISHASignCounter.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContractReadonly;
}

interface IStateProps {
  uploadedAgreement: IEtoDocument | undefined;
  stateOnChain: EETOStateOnChain;
  countdownDate: Date | Moment | undefined;
}

type TProps = IExternalProps & IPanelProps & IStateProps;

const ETOISHASignCounterLayout: React.FunctionComponent<IPanelProps &
  Pick<IStateProps, "countdownDate">> = ({ countdownDate, columnSpan }) => {
  const date = nonNullable(countdownDate);

  return (
    <DashboardWidget
      data-test-id="settings.isha-sign-counter"
      title={<FormattedMessage id="settings.isha-sign-counter-widget.title" />}
      text={<FormattedMessage id="settings.isha-sign-counter-widget.text" />}
      columnSpan={columnSpan}
    >
      <TimeLeftWithUTC countdownDate={date} />
      <p className={styles.warning}>
        <FormattedMessage id="settings.isha-sign-counter-widget.warning" />
      </p>
    </DashboardWidget>
  );
};

const ETOISHASignCounter = compose<TProps, IExternalProps & IPanelProps>(
  appConnect<IStateProps | null, {}, IExternalProps & IPanelProps>({
    stateToProps: (state: IAppState, ownProps: IExternalProps) => {
      const isIssuer = selectIsIssuer(state);

      if (!isIssuer || !isOnChain(ownProps.eto)) {
        return null;
      }

      return {
        stateOnChain: nonNullable(selectEtoOnChainState(state, ownProps.eto.previewCode)),
        uploadedAgreement: selectUploadedInvestmentAgreement(state),
        countdownDate: selectIssuerEtoNextStateStartDate(state),
      };
    },
  }),
  branch<IStateProps>(props => !props.countdownDate, renderNothing),
  branch<IStateProps>(props => props.stateOnChain > EETOStateOnChain.Signing, renderNothing),
  branch<IStateProps & IExternalProps>(
    props => props.stateOnChain < EETOStateOnChain.Signing,
    renderNothing,
  ),
)(ETOISHASignCounterLayout);

export { ETOISHASignCounter, ETOISHASignCounterLayout };
