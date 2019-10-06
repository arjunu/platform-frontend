import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { branch, renderComponent } from "recompose";
import { compose } from "redux";

import { DAY } from "../../../config/constants";
import { IBookBuildingStats } from "../../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { actions } from "../../../modules/actions";
import { selectBookbuildingStats } from "../../../modules/bookbuilding-flow/selectors";
import {
  selectCanEnableBookBuilding,
  selectIsBookBuilding,
  selectIssuerEtoDateToWhitelistMinDuration,
  selectIssuerEtoId,
  selectMaxPledges,
} from "../../../modules/eto-flow/selectors";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { onLeaveAction } from "../../../utils/OnLeaveAction";
import { EColumnSpan } from "../../layouts/Container";
import { ButtonArrowRight } from "../../shared/buttons/index";
import { DashboardWidget } from "../../shared/dashboard-widget/DashboardWidget";
import { Document } from "../../shared/Document";
import { DocumentTemplateButton } from "../../shared/DocumentLink";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryPanel } from "../../shared/errorBoundary/ErrorBoundaryPanel";
import { Money } from "../../shared/formatters/Money";
import { ECurrency, ENumberInputFormat, ENumberOutputFormat } from "../../shared/formatters/utils";
import { LoadingIndicator } from "../../shared/loading-indicator/index";
import { Panel } from "../../shared/Panel";

import * as styles from "./BookBuildingWidget.module.scss";

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
  columnSpan?: EColumnSpan;
  minOffsetPeriod: number;
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
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

interface ILayoutProps {
  onClick: () => void;
  headerText: TTranslatedString;
  text: TTranslatedString;
  buttonText: TTranslatedString;
  canEnableBookbuilding: boolean;
  columnSpan?: EColumnSpan;
}

type IProps = IDispatchProps & IStateProps;

const BookBuildingStats = ({ bookBuildingStats, maxPledges, downloadCSV }: IBookBuilding) => (
  <>
    <div className={styles.groupWrapper}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.amount-backed" />
      </span>
      <Money
        value={bookBuildingStats.pledgedAmount}
        inputFormat={ENumberInputFormat.FLOAT}
        valueType={ECurrency.EUR}
        outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
      />
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.investors-backed" />
      </span>
      <span data-test-id="eto-bookbuilding-investors-backed">
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

const BookBuildingWidgetLayout: React.FunctionComponent<ILayoutProps> = ({
  children,
  onClick,
  headerText,
  text,
  buttonText,
  canEnableBookbuilding,
  columnSpan,
}) => (
  <DashboardWidget
    title={headerText}
    text={
      canEnableBookbuilding ? (
        text
      ) : (
        <FormattedMessage id="eto-bookbuilding-widget.button-disabled" />
      )
    }
    columnSpan={columnSpan}
  >
    {children}

    {canEnableBookbuilding && (
      <div className="m-auto">
        <ButtonArrowRight onClick={onClick} data-test-id="eto-flow-start-bookbuilding">
          {buttonText}
        </ButtonArrowRight>
      </div>
    )}
  </DashboardWidget>
);

export const BookBuildingWidgetComponent: React.FunctionComponent<IProps> = ({
  startBookBuilding,
  bookBuildingEnabled,
  maxPledges,
  stopBookBuilding,
  bookBuildingStats,
  downloadCSV,
  minOffsetPeriod,
  etoId,
  canEnableBookbuilding,
  columnSpan,
}) => {
  if (!bookBuildingEnabled && bookBuildingStats.investorsCount === 0) {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.start-book-building" />}
        text={<FormattedMessage id="settings.book-building-widget.proposal-accepted" />}
        buttonText={<FormattedMessage id="settings.book-building-widget.start-book-building" />}
        onClick={() => startBookBuilding(etoId)}
        canEnableBookbuilding={canEnableBookbuilding}
        columnSpan={columnSpan}
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
        onClick={() => startBookBuilding(etoId)}
        canEnableBookbuilding={canEnableBookbuilding}
        columnSpan={columnSpan}
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
        text={
          <FormattedHTMLMessage
            tagName="span"
            id="settings.book-building-widget.book-building-enabled-text"
            values={{ minOffsetPeriod: minOffsetPeriod / DAY }}
          />
        }
        buttonText={<FormattedMessage id="settings.book-building-widget.stop-book-building" />}
        onClick={() => stopBookBuilding(etoId)}
        canEnableBookbuilding={canEnableBookbuilding}
        columnSpan={columnSpan}
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

export const BookBuildingWidget = compose<React.FunctionComponent<IExternalProps>>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectIssuerEtoId(state);

      if (!etoId) {
        throw new Error("Eto id is required for bookbuilding");
      }

      return {
        etoId,
        bookBuildingEnabled: selectIsBookBuilding(state),
        bookBuildingStats: selectBookbuildingStats(state, etoId),
        maxPledges: selectMaxPledges(state),
        canEnableBookbuilding: selectCanEnableBookBuilding(state),
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
)(BookBuildingWidgetComponent);
