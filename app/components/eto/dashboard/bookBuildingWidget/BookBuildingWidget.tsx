import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { IBookBuildingStats } from "../../../../lib/api/eto/EtoPledgeApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectBookbuildingStats } from "../../../../modules/bookbuilding-flow/selectors";
import {
  selectEtoId,
  selectIsBookBuilding,
  selectMaxPledges,
} from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { TTranslatedString } from "../../../../types";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { onLeaveAction } from "../../../../utils/OnLeaveAction";
import { ButtonArrowRight } from "../../../shared/buttons";
import { Document } from "../../../shared/Document";
import { DocumentTemplateButton } from "../../../shared/DocumentLink";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import { ECurrencySymbol, EMoneyFormat, Money } from "../../../shared/Money";
import { Panel } from "../../../shared/Panel";

import * as styles from "../../etoContentWidget.module.scss";

interface IDispatchProps {
  startBookBuilding: (etoId: string) => void;
  stopBookBuilding: (etoId: string) => void;
  downloadCSV: () => void;
}

interface IStateProps {
  bookBuildingEnabled?: boolean;
  bookBuildingStats: IBookBuildingStats;
  maxPledges: number | null;
  etoId?: string;
}

interface IBookBuilding {
  bookBuildingStats: IBookBuildingStats;
  downloadCSV: () => void;
  maxPledges: number | null;
}

interface ILayoutProps {
  onClick: (etoId: string) => void;
  headerText: TTranslatedString;
  text: TTranslatedString;
  buttonText: TTranslatedString;
}

type IProps = IDispatchProps & IStateProps;

const BookBuildingStats = ({ bookBuildingStats, maxPledges, downloadCSV }: IBookBuilding) => (
  <>
    <div className={styles.groupWrapper}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.amount-backed" />
      </span>
      <span className={styles.value}>
        <Money
          value={bookBuildingStats.pledgedAmount}
          currency="eur"
          format={EMoneyFormat.FLOAT}
          currencySymbol={ECurrencySymbol.SYMBOL}
        />
      </span>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.investors-backed" />
      </span>
      <span className={styles.value} data-test-id="eto-bookbuilding-investors-backed">
        {maxPledges !== null ? (
          <FormattedMessage
            id="settings.book-building-stats-widget.number-of-pledges"
            values={{ pledges: bookBuildingStats.investorsCount, maxPledges }}
          />
        ) : null}
      </span>
    </div>
    {bookBuildingStats.investorsCount > 0 ? (
      <DocumentTemplateButton
        onClick={downloadCSV}
        title={<FormattedMessage id="eto-bookbuilding-widget.download-bookbuilding-stats" />}
        altIcon={<Document extension="csv" />}
      />
    ) : null}
  </>
);

const BookBuildingWidgetLayout: React.SFC<ILayoutProps> = ({
  children,
  onClick,
  headerText,
  text,
  buttonText,
}) => (
  <Panel headerText={headerText}>
    <div className={styles.content}>
      <p className={cn(styles.text)}>{text}</p>
      {children}
      <div className={styles.widgetButton}>
        <ButtonArrowRight
          onClick={onClick}
          data-test-id="eto-flow-start-bookbuilding"
          className={styles.buttonOverride}
        >
          {buttonText}
        </ButtonArrowRight>
      </div>
    </div>
  </Panel>
);

export const BookBuildingWidgetComponent: React.SFC<IProps> = ({
  startBookBuilding,
  bookBuildingEnabled,
  maxPledges,
  stopBookBuilding,
  bookBuildingStats,
  downloadCSV,
  etoId,
}) => {
  if (bookBuildingStats === undefined) {
    //TODO data loading state
    return <LoadingIndicator className={styles.loading} />;
  } else if (!bookBuildingEnabled && bookBuildingStats.investorsCount === 0) {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.start-book-building" />}
        text={<FormattedMessage id="settings.book-building-widget.proposal-accepted" />}
        buttonText={<FormattedMessage id="settings.book-building-widget.start-book-building" />}
        onClick={() => startBookBuilding(etoId as string)}
      />
    );
  } else if (!bookBuildingEnabled && bookBuildingStats.investorsCount) {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.book-building-disabled" />}
        text={<FormattedMessage id="settings.book-building-widget.book-building-disabled-text" />}
        buttonText={
          <FormattedMessage id="settings.book-building-widget.reactivate-book-building" />
        }
        onClick={() => startBookBuilding(etoId as string)}
      >
        <BookBuildingStats
          bookBuildingStats={bookBuildingStats}
          downloadCSV={downloadCSV}
          maxPledges={maxPledges}
        />
      </BookBuildingWidgetLayout>
    );
  } else {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.book-building-enabled" />}
        text={<FormattedMessage id="settings.book-building-widget.book-building-enabled-text" />}
        buttonText={<FormattedMessage id="settings.book-building-widget.stop-book-building" />}
        onClick={() => stopBookBuilding(etoId as string)}
      >
        <BookBuildingStats
          bookBuildingStats={bookBuildingStats}
          downloadCSV={downloadCSV}
          maxPledges={maxPledges}
        />
      </BookBuildingWidgetLayout>
    );
  }
};

export const BookBuildingWidget = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      bookBuildingEnabled: selectIsBookBuilding(state),
      bookBuildingStats: selectBookbuildingStats(selectEtoId(state) as string, state),
      maxPledges: selectMaxPledges(state),
      etoId: selectEtoId(state),
    }),
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
  onEnterAction({
    actionCreator: (dispatch, props) => {
      if (props.bookBuildingEnabled) {
        dispatch(actions.bookBuilding.bookBuildingStartWatch(props.etoId));
      } else {
        dispatch(actions.bookBuilding.loadBookBuildingStats(props.etoId));
      }
    },
  }),
  onLeaveAction({
    actionCreator: (dispatch, props) => {
      if (props.bookBuildingEnabled) {
        dispatch(actions.bookBuilding.bookBuildingStopWatch(props.etoId));
      }
    },
  }),
)(BookBuildingWidgetComponent);
