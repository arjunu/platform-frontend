import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { IBookBuildingStats } from "../../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { EColumnSpan } from "../../layouts/Container";
import { ButtonArrowRight } from "../../shared/buttons";
import { DashboardWidget } from "../../shared/dashboard-widget/DashboardWidget";
import { BookBuildingStats } from "./BookBuildingStats";

type TExternalProps = {
  bookBuildingStats: IBookBuildingStats;
  columnSpan: EColumnSpan | undefined;
  downloadCSV: () => void;
  etoId: string;
  maxPledges: number | null;
  startBookBuilding: (etoId: string) => void;
};

const BookBuildingSuspendedWidget: React.FunctionComponent<TExternalProps> = ({
  bookBuildingStats,
  columnSpan,
  downloadCSV,
  etoId,
  maxPledges,
  startBookBuilding,
}) => (
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

export { BookBuildingSuspendedWidget };
