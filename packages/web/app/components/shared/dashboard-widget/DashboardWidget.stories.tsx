import { storiesOf } from "@storybook/react";
import * as React from "react";

import { appRoutes } from "../../appRoutes";
import { ButtonArrowRight, ButtonGroup, ButtonLink } from "../buttons";
import {
  DashboardCenteredWidget,
  DashboardLinkWidget,
  DashboardLoadingWidget,
  DashboardWidget,
} from "./DashboardWidget";

storiesOf("DashboardWidget", module)
  .add("link (with 'to' and 'buttonText')", () => (
    <DashboardLinkWidget
      title="Est germanus guttus, cesaris."
      text="Pess ire in magnum tectum! Poetas sunt assimilatios de rusticus bubo. Cadunt aegre ducunt ad emeritis cotta."
      to="/"
      buttonText="Random text"
    />
  ))
  .add("custom content", () => (
    <DashboardWidget
      title="Est germanus guttus, cesaris."
      text="Sunt domuses talem raptus, audax cobaltumes. Est placidus lura, cesaris."
    >
      <ButtonGroup>
        <ButtonLink to={appRoutes.documents} component={ButtonArrowRight}>
          Summary
        </ButtonLink>
        <ButtonLink to={appRoutes.documents} component={ButtonArrowRight}>
          Upload
        </ButtonLink>
      </ButtonGroup>
    </DashboardWidget>
  ))
  .add("custom content (centered)", () => (
    <DashboardCenteredWidget
      title="Est germanus guttus, cesaris."
      text="Sunt domuses talem raptus, audax cobaltumes. Est placidus lura, cesaris."
    >
      <ButtonGroup>
        <ButtonLink to={appRoutes.documents} component={ButtonArrowRight}>
          Summary
        </ButtonLink>
        <ButtonLink to={appRoutes.documents} component={ButtonArrowRight}>
          Upload
        </ButtonLink>
      </ButtonGroup>
    </DashboardCenteredWidget>
  ))
  .add("loading", () => <DashboardLoadingWidget title="Est germanus guttus, cesaris." />);
