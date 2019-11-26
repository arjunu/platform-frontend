import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EColumnSpan } from "../../layouts/Container";
import { Button, EButtonLayout } from "../../shared/buttons";
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
    title={<FormattedMessage id="settings.book-building-widget.enable-whitelist" />}
    text={<FormattedMessage id="settings.book-building-widget.whitelist-description" />}
    columnSpan={columnSpan}
  >
    <div className="m-auto">
      <Button
        layout={EButtonLayout.SECONDARY}
        type="button"
        onClick={() => startBookBuilding(etoId)}
        data-test-id="eto-flow-start-bookbuilding"
      >
        <FormattedMessage id="settings.book-building-widget.enable-whitelisting-button" />
      </Button>
    </div>
  </DashboardWidget>
);

export { BookBuildingNotActiveWidget };
