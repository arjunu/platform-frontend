import * as React from "react";
import { FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../modules/actions";
import { EETOStateOnChain } from "../../modules/eto/types";
import { selectActiveNomineeEto, selectCapitalIncrease } from "../../modules/nominee-flow/selectors";
import { appConnect } from "../../store";
import { DataUnavailableError } from "../../utils/errors";
import { getStartOfState } from "../eto/shared/timeline/EtoTimeline";
import { Button, EButtonLayout, EButtonTheme } from "../shared/buttons/Button";
import { Money } from "../shared/formatters/Money";
import { ECurrency, ENumberInputFormat, ENumberOutputFormat } from "../shared/formatters/utils";

import * as styles from "./NomineeDashboard.module.scss"

type TRedeemShareCapitalProps = {
  companyName: string,
  amount: string,
  deadline: number,
  redeemFunds: ()=>void
}

type TRedeemShareCapitalStateProps = {
  companyName: string,
  amount: string,
  deadline: number,
}
type RedeemShareCapitalDispatchProps = {
  redeemFunds: ()=>void
}

const RedeemShareCapitalLayout: React.FunctionComponent<TRedeemShareCapitalProps> = ({
  companyName,
  amount,
  deadline,
  redeemFunds
}) =>
  <section
    className={styles.nomineeStepWidget}
    data-test-id="nominee-flow-redeem-share-capital"
  >
    <h4 className={styles.nomineeStepWidgetTitle}>
      <FormattedMessage id="nominee-flow.redeem-share-capital.title" />
    </h4>
    <div className={styles.nomineeStepWidgetContent}>
      <p>
        <FormattedMessage
          id="nominee-flow.redeem-share-capital.text"
          values={{
            companyName,
            amount: <Money
              value={amount}
              inputFormat={ENumberInputFormat.ULPS}
              outputFormat={ENumberOutputFormat.INTEGER}
              valueType={ECurrency.EUR_TOKEN}
            />
          }} />
      </p>
      <p className={styles.textBold}>
        <FormattedMessage id="nominee-flow.redeem-share-capital.text-note" />
        <FormattedRelative value={deadline} initialNow={new Date()} />
      </p>
    </div>
    <Button
      className={styles.nomineeStepWidgetButton}
      layout={EButtonLayout.PRIMARY}
      theme={EButtonTheme.BRAND}
      data-test-id="eto-nominee-sign-agreement-action"
      onClick={redeemFunds}
    >
      <FormattedMessage id="nominee-flow.redeem-share-capital.button-redeem-funds" />
    </Button>
  </section>;

const RedeemShareCapital = compose<TRedeemShareCapitalProps, {}>(
  appConnect<TRedeemShareCapitalStateProps,{}>({
    stateToProps: (state) => {
      const nomineeEto = selectActiveNomineeEto(state);
      if (nomineeEto && nomineeEto.contract) {

        return ({
          companyName: nomineeEto.company.name,
          amount: selectCapitalIncrease(state),
          deadline: getStartOfState(EETOStateOnChain.Claim, nomineeEto.contract.startOfStates)
        })
      } else {
        throw new DataUnavailableError("nominee eto is undefined")
      }
    },

  }),
appConnect<{},{},TRedeemShareCapitalStateProps>({
  dispatchToProps: (dispatch,props) =>({
    redeemFunds: () => dispatch(actions.txTransactions.startWithdrawNEuro(props.amount))
  })
})
  //fixme use withProps
  //fixme guard against negative deadline,
  //fixme set deadline to days OR hours
)(RedeemShareCapitalLayout);

export { RedeemShareCapitalLayout, RedeemShareCapital }
