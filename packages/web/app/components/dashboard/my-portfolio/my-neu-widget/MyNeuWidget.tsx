import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { externalRoutes } from "../../../../config/externalRoutes";
import {
  selectIsLoading,
  selectNeuBalance,
  selectNeuBalanceEuroAmount,
  selectWalletError,
} from "../../../../modules/wallet/selectors";
import { appConnect } from "../../../../store";
import { withContainer } from "../../../../utils/withContainer.unsafe";
import { EButtonLayout, EIconPosition } from "../../../shared/buttons/Button";
import { ButtonLink } from "../../../shared/buttons/ButtonLink";
import { ECurrency } from "../../../shared/formatters/utils";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { ESize, MoneySuiteWidget } from "../../../shared/MoneySuiteWidget/MoneySuiteWidget";
import { MyNeuWidgetError } from "./MyNeuWidgetError";

import arrowRight from "../../../../assets/img/inline_icons/arrow_right.svg";
import icon from "../../../../assets/img/neu_icon.svg";
import * as styles from "./MyNeuWidget.module.scss";

interface IStateProps {
  balanceNeu: string;
  balanceEur: string;
  isLoading: boolean;
  error: string | undefined;
}

interface IComponentProps {
  balanceNeu: string;
  balanceEur: string;
}

export const MyNeuWidgetLayoutWrapper: React.FunctionComponent = ({ children }) => (
  <section className={styles.wrapper}>
    <h5 className={styles.title}>
      <FormattedMessage id="dashboard.my-neu-widget.my-neumark" />
    </h5>
    {children}
  </section>
);

export const MyNeuWidgetLayout: React.FunctionComponent<IComponentProps> = props => (
  <>
    <div className={styles.content}>
      <MoneySuiteWidget
        currency={ECurrency.NEU}
        largeNumber={props.balanceNeu}
        icon={icon}
        value={props.balanceEur}
        currencyTotal={ECurrency.EUR}
        data-test-id="my-neu-widget-neumark-balance"
        size={ESize.LARGE}
      />
      <ButtonLink
        to={externalRoutes.neufundSupportWhatIsNeu}
        target="_blank"
        layout={EButtonLayout.GHOST}
        iconPosition={EIconPosition.ICON_AFTER}
        svgIcon={arrowRight}
        data-test-id="my-neu-widget-support-link"
      >
        <FormattedMessage id="dashboard.my-neu-widget.about" />
      </ButtonLink>
    </div>
  </>
);

export const MyNeuWidget = compose<IComponentProps, {}>(
  appConnect<IStateProps>({
    stateToProps: s => ({
      isLoading: selectIsLoading(s),
      error: selectWalletError(s),
      balanceNeu: selectNeuBalance(s),
      balanceEur: selectNeuBalanceEuroAmount(s),
    }),
  }),
  withContainer(MyNeuWidgetLayoutWrapper),
  branch<IStateProps>(({ error }) => !!error, renderComponent(MyNeuWidgetError)),
  branch<IStateProps>(({ isLoading }) => isLoading, renderComponent(LoadingIndicator)),
)(MyNeuWidgetLayout);
