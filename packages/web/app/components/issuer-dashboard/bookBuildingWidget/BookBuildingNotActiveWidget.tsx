import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EColumnSpan } from "../../layouts/Container";
import { ButtonArrowRight } from "../../shared/buttons";
import { DashboardWidget } from "../../shared/dashboard-widget/DashboardWidget";

type TExternalProps = {
  columnSpan: EColumnSpan | undefined;
  etoId: string;
  startBookBuilding: (etoId: string) => void;
};

const BookBuildingNotActiveWidget: React.FunctionComponent<TExternalProps> = ({
  columnSpan,
  etoId,
  startBookBuilding,
}) => (
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

export { BookBuildingNotActiveWidget };
