import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { IBookBuildingStats } from "../../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { EColumnSpan } from "../../layouts/Container";
import { DashboardWidget } from "../../shared/dashboard-widget/DashboardWidget";
import { BookBuildingStats } from "./BookBuildingStats";

type TExternalProps = {
  bookBuildingStats: IBookBuildingStats;
  columnSpan: EColumnSpan | undefined;
  downloadCSV: () => void;
  maxPledges: number | null;
};

const BookBuildingStoppedWidget: React.FunctionComponent<TExternalProps> = ({
  bookBuildingStats,
  columnSpan,
  downloadCSV,
  maxPledges,
}) => (
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

export { BookBuildingStoppedWidget };
