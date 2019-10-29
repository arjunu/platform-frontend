import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, renderNothing, withProps } from "recompose";

import { DAY } from "../../../config/constants";
import { IBookBuildingStats } from "../../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { actions } from "../../../modules/actions";
import { selectBookbuildingStats } from "../../../modules/bookbuilding-flow/selectors";
import {
  calculateWhitelistingState,
  EWhitelistingState,
} from "../../../modules/bookbuilding-flow/utils";
import {
  selectCanEnableBookBuilding,
  selectIsBookBuilding,
  selectIssuerEtoDateToWhitelistMinDuration,
  selectIssuerEtoId,
  selectIssuerEtoOnChainState,
  selectMaxPledges,
} from "../../../modules/eto-flow/selectors";
import { EETOStateOnChain } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { OmitKeys, TTranslatedString } from "../../../types";
import { assertNever } from "../../../utils/assertNever";
import { InvariantError } from "../../../utils/invariant";
import { nonNullable } from "../../../utils/nonNullable";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { onLeaveAction } from "../../../utils/OnLeaveAction";
import { EColumnSpan } from "../../layouts/Container";
import { ButtonArrowRight } from "../../shared/buttons/index";
import { DashboardWidget } from "../../shared/dashboard-widget/DashboardWidget";
import { Document } from "../../shared/Document";
import { DocumentButton } from "../../shared/DocumentLink";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryPanel } from "../../shared/errorBoundary/ErrorBoundaryPanel";
import { Money } from "../../shared/formatters/Money";
import { ECurrency, ENumberInputFormat, ENumberOutputFormat } from "../../shared/formatters/utils";
import { LoadingIndicator } from "../../shared/loading-indicator/index";
import { Panel } from "../../shared/Panel";

import * as styles from "./BookBuildingWidget.module.scss";

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

interface IDispatchProps {
  startBookBuilding: (etoId: string) => void;
  stopBookBuilding: (etoId: string) => void;
  downloadCSV: () => void;
}

interface IStateProps {
  bookBuildingEnabled?: boolean;
  bookBuildingStats: IBookBuildingStats;
  maxPledges: number | null;
  etoId: string;
  canEnableBookbuilding: boolean;
  onChainState: EETOStateOnChain | undefined;
  minOffsetPeriod: number;
}

interface IWithProps {
  whitelistingState: EWhitelistingState;
}

interface IPanelProps {
  headerText?: TTranslatedString;
  columnSpan?: EColumnSpan;
}

interface IBookBuilding {
  bookBuildingStats: IBookBuildingStats;
  downloadCSV: () => void;
  maxPledges: number | null;
}

type TProps = IWithProps &
  IDispatchProps &
  OmitKeys<IStateProps, "onChainState" | "canEnableBookbuilding" | "bookBuildingEnabled"> &
  IExternalProps;

const BookBuildingStats = ({ bookBuildingStats, maxPledges, downloadCSV }: IBookBuilding) => (
  <>
    <div className={styles.groupWrapper}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.amount-backed" />
      </span>
      <Money
        data-test-id="bookbuilding-widget.stats.amount-backed"
        value={bookBuildingStats.pledgedAmount.toString()}
        inputFormat={ENumberInputFormat.FLOAT}
        valueType={ECurrency.EUR}
        outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
      />
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.investors-backed" />
      </span>
      {maxPledges !== null ? (
        <span data-test-id="bookbuilding-widget.stats.number-of-pledges">
          <FormattedMessage
            id="settings.book-building-stats-widget.number-of-pledges"
            values={{ pledges: bookBuildingStats.investorsCount, maxPledges }}
          />
        </span>
      ) : null}
    </div>
    {bookBuildingStats.investorsCount > 0 ? (
      <DocumentButton
        onClick={downloadCSV}
        title={<FormattedMessage id="eto-bookbuilding-widget.download-bookbuilding-stats" />}
        altIcon={<Document extension="csv" />}
        data-test-id="bookbuilding-widget.stats.download"
      />
    ) : null}
  </>
);

export const BookBuildingWidgetComponent: React.FunctionComponent<TProps> = ({
  startBookBuilding,
  maxPledges,
  stopBookBuilding,
  bookBuildingStats,
  downloadCSV,
  minOffsetPeriod,
  etoId,
  columnSpan,
  whitelistingState,
}) => {
  switch (whitelistingState) {
    case EWhitelistingState.ACTIVE:
      return (
        <DashboardWidget
          title={<FormattedMessage id="settings.book-building-widget.book-building-enabled" />}
          text={
            <FormattedHTMLMessage
              tagName="span"
              id="settings.book-building-widget.book-building-enabled-text"
              values={{ minOffsetPeriod: minOffsetPeriod / DAY }}
            />
          }
          columnSpan={columnSpan}
        >
          <BookBuildingStats
            bookBuildingStats={bookBuildingStats}
            downloadCSV={downloadCSV}
            maxPledges={maxPledges}
          />

          <div className="m-auto">
            <ButtonArrowRight
              onClick={() => stopBookBuilding(etoId)}
              data-test-id="eto-flow-start-bookbuilding"
            >
              <FormattedMessage id="settings.book-building-widget.stop-book-building" />
            </ButtonArrowRight>
          </div>
        </DashboardWidget>
      );
    case EWhitelistingState.NOT_ACTIVE:
      return (
        <DashboardWidget
          title={<FormattedMessage id="settings.book-building-widget.start-book-building" />}
          text={<FormattedMessage id="settings.book-building-widget.proposal-accepted" />}
          columnSpan={columnSpan}
        >
          <div className="m-auto">
            <ButtonArrowRight
              onClick={() => startBookBuilding(etoId)}
              data-test-id="eto-flow-start-bookbuilding"
            >
              <FormattedMessage id="settings.book-building-widget.start-book-building" />
            </ButtonArrowRight>
          </div>
        </DashboardWidget>
      );
    case EWhitelistingState.SUSPENDED:
      return (
        <DashboardWidget
          title={<FormattedMessage id="settings.book-building-widget.book-building-disabled" />}
          text={<FormattedMessage id="settings.book-building-widget.book-building-disabled-text" />}
          columnSpan={columnSpan}
        >
          <BookBuildingStats
            bookBuildingStats={bookBuildingStats}
            downloadCSV={downloadCSV}
            maxPledges={maxPledges}
          />

          <div className="m-auto">
            <ButtonArrowRight
              onClick={() => startBookBuilding(etoId)}
              data-test-id="eto-flow-start-bookbuilding"
            >
              <FormattedMessage id="settings.book-building-widget.reactivate-book-building" />
            </ButtonArrowRight>
          </div>
        </DashboardWidget>
      );
    case EWhitelistingState.STOPPED:
    case EWhitelistingState.LIMIT_REACHED:
      return (
        <DashboardWidget
          data-test-id="bookbuilding-widget.closed"
          title={<FormattedMessage id="settings.book-building-widget.book-building-closed" />}
          text={<FormattedMessage id="settings.book-building-widget.book-building-closed-text" />}
          columnSpan={columnSpan}
        >
          <BookBuildingStats
            bookBuildingStats={bookBuildingStats}
            downloadCSV={downloadCSV}
            maxPledges={maxPledges}
          />
        </DashboardWidget>
      );
    case EWhitelistingState.LOADING:
      return <LoadingIndicator />;
    default:
      return assertNever(whitelistingState);
  }
};

const WidgetLoading: React.ComponentType<IPanelProps> = ({ columnSpan }) => (
  <WidgetPanel columnSpan={columnSpan}>
    <LoadingIndicator />
  </WidgetPanel>
);

const WidgetPanel: React.ComponentType<IPanelProps> = ({ columnSpan, headerText, children }) => (
  <Panel headerText={headerText} columnSpan={columnSpan}>
    {children}
  </Panel>
);

export const BookBuildingWidget = compose<TProps, IExternalProps>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = nonNullable(selectIssuerEtoId(state));

      return {
        etoId,
        bookBuildingEnabled: selectIsBookBuilding(state),
        bookBuildingStats: selectBookbuildingStats(state, etoId),
        maxPledges: selectMaxPledges(state),
        canEnableBookbuilding: selectCanEnableBookBuilding(state),
        onChainState: selectIssuerEtoOnChainState(state),
        minOffsetPeriod: selectIssuerEtoDateToWhitelistMinDuration(state),
      };
    },
    dispatchToProps: dispatch => ({
      startBookBuilding: etoId => {
        dispatch(actions.etoFlow.changeBookBuildingStatus(true));
        dispatch(actions.bookBuilding.bookBuildingStartWatch(etoId));
      },
      stopBookBuilding: etoId => {
        dispatch(actions.etoFlow.changeBookBuildingStatus(false));
        dispatch(actions.bookBuilding.bookBuildingStopWatch(etoId));
      },
      downloadCSV: () => {
        dispatch(actions.etoFlow.downloadBookBuildingStats());
      },
    }),
  }),
  onEnterAction<IStateProps>({
    actionCreator: (dispatch, props) => {
      if (props.bookBuildingEnabled) {
        dispatch(actions.bookBuilding.bookBuildingStartWatch(props.etoId));
      } else {
        dispatch(actions.bookBuilding.loadBookBuildingStats(props.etoId));
      }
    },
  }),
  onLeaveAction<IStateProps>({
    actionCreator: (dispatch, props) => {
      if (props.bookBuildingEnabled) {
        dispatch(actions.bookBuilding.bookBuildingStopWatch(props.etoId));
      }
    },
  }),
  branch<IStateProps>(props => !props.bookBuildingStats, renderComponent(WidgetLoading)),
  withProps<IWithProps, IStateProps>(
    ({ bookBuildingStats, maxPledges, canEnableBookbuilding, bookBuildingEnabled }) => {
      if (maxPledges === null || bookBuildingEnabled === undefined) {
        throw new InvariantError(
          "Max pledges and bookbuilding status should be defined at this point",
        );
      }

      const bookbuildingLimitReached = maxPledges - bookBuildingStats.investorsCount <= 0;

      return {
        whitelistingState: calculateWhitelistingState({
          canEnableBookbuilding: canEnableBookbuilding,
          whitelistingIsActive: bookBuildingEnabled,
          bookbuildingLimitReached,
          investorsCount: bookBuildingStats.investorsCount,
        }),
      };
    },
  ),
  branch<IStateProps & IWithProps>(props => {
    // show widget when bookbuilding can be enabled
    if (props.canEnableBookbuilding) {
      return false;
    }

    // show widget when limit reached or stopped up until end of presale
    if (
      [EWhitelistingState.LIMIT_REACHED, EWhitelistingState.STOPPED].includes(
        props.whitelistingState,
      )
    ) {
      return ![undefined, EETOStateOnChain.Setup, EETOStateOnChain.Whitelist].includes(
        props.onChainState,
      );
    }

    return true;
  }, renderNothing),
)(BookBuildingWidgetComponent);
