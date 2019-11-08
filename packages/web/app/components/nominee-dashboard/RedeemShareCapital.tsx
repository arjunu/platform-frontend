import * as React from "react";
import { FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { EETOStateOnChain, TEtoStartOfStates } from "../../modules/eto/types";
import {
  selectActiveNomineeEto,
  selectCapitalIncrease,
  selectRedeemShareCapitalTaskSubstate,
} from "../../modules/nominee-flow/selectors";
import { ERedeemShareCapitalTaskSubstate } from "../../modules/nominee-flow/types";
import { appConnect } from "../../store";
import { DataUnavailableError } from "../../utils/errors";
import { Button, EButtonLayout, EButtonTheme } from "../shared/buttons/Button";
import { Money } from "../shared/formatters/Money";
import { ECurrency, ENumberInputFormat, ENumberOutputFormat } from "../shared/formatters/utils";

import * as styles from "./NomineeDashboard.module.scss";

type TRedeemShareCapitalStateProps = {
  companyName: string;
  amount: string | undefined;
  deadline: number;
};
type RedeemShareCapitalDispatchProps = {
  redeemFunds: (amount: string | undefined) => void;
};

type TProps = TRedeemShareCapitalStateProps & RedeemShareCapitalDispatchProps;

const RedeemShareCapitalLayout: React.FunctionComponent<TProps> = ({
  companyName,
  amount,
  deadline,
  redeemFunds,
}) => (
  <section className={styles.nomineeStepWidget} data-test-id="nominee-flow-redeem-share-capital">
    <h4 className={styles.nomineeStepWidgetTitle}>
      <FormattedMessage id="nominee-flow.redeem-share-capital.title" />
    </h4>
    <div className={styles.nomineeStepWidgetContent}>
      <p>
        <FormattedMessage
          id="nominee-flow.redeem-share-capital.text"
          values={{
            companyName,
            amount: (
              <Money
                value={amount}
                inputFormat={ENumberInputFormat.ULPS}
                outputFormat={ENumberOutputFormat.INTEGER}
                valueType={ECurrency.EUR_TOKEN}
              />
            ),
          }}
        />
      </p>
      <p className={styles.textBold}>
        <FormattedMessage id="nominee-flow.redeem-share-capital.text-note" />
        <FormattedRelative value={deadline} initialNow={new Date()} style={"numeric"} />
      </p>
    </div>
    <Button
      className={styles.nomineeStepWidgetButton}
      layout={EButtonLayout.PRIMARY}
      theme={EButtonTheme.BRAND}
      data-test-id="eto-nominee-sign-agreement-action"
      onClick={() => redeemFunds(amount)}
    >
      <FormattedMessage id="nominee-flow.redeem-share-capital.button-redeem-funds" />
    </Button>
  </section>
);

export const WaitForIshaSigning = () => (
  <section
    className={styles.nomineeStepWidget}
    data-test-id="nominee-flow-redeem-share-capital-waiting-for-isha-signing"
  >
    <h4 className={styles.nomineeStepWidgetTitle}>
      <FormattedMessage id="nominee-flow.redeem-share-capital.wait-for-isha-signing.title" />
    </h4>
    <p className={styles.nomineeStepWidgetContent}>
      <FormattedMessage id="nominee-flow.redeem-share-capital.wait-for-isha-signing.text" />
    </p>
  </section>
);

export const getStartOfClaimState = (startOfStates: TEtoStartOfStates) => {
  const startOfClaimState = startOfStates && startOfStates[EETOStateOnChain.Claim];
  if (startOfClaimState === undefined) {
    throw new DataUnavailableError("start of claim state is undefined");
  }
  const timeLeft = startOfClaimState.getTime() - Date.now();
  return timeLeft > 0 ? startOfClaimState.getTime() : Date.now();
};

const RedeemShareCapital = compose<TProps, {}>(
  appConnect<{ taskSubstate: ERedeemShareCapitalTaskSubstate }>({
    stateToProps: state => {
      const taskSubstate = selectRedeemShareCapitalTaskSubstate(state);
      if (!taskSubstate) {
        throw new DataUnavailableError("task substate is missing");
      } else {
        return {
          taskSubstate,
        };
      }
    },
  }),
  branch<{ taskSubstate: ERedeemShareCapitalTaskSubstate }>(
    ({ taskSubstate }) =>
      taskSubstate === ERedeemShareCapitalTaskSubstate.WAITING_FOR_ISSUER_TO_SIGN_ISHA,
    renderComponent(WaitForIshaSigning),
  ),
  appConnect<TRedeemShareCapitalStateProps, RedeemShareCapitalDispatchProps>({
    stateToProps: state => {
      const nomineeEto = selectActiveNomineeEto(state);
      if (nomineeEto && nomineeEto.contract) {
        return {
          companyName: nomineeEto.company.name,
          amount: selectCapitalIncrease(state),
          deadline: getStartOfClaimState(nomineeEto.contract.startOfStates),
        };
      } else {
        throw new DataUnavailableError("nominee eto is undefined");
      }
    },
    dispatchToProps: dispatch => ({
      redeemFunds: amount => dispatch(actions.txTransactions.startWithdrawNEuro(amount)),
    }),
  }),
)(RedeemShareCapitalLayout);

export { RedeemShareCapitalLayout, RedeemShareCapital };
