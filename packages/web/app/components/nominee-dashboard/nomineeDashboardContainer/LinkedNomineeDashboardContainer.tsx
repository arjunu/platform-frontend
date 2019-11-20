import * as React from "react";
import { compose } from "recompose";

import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { selectActiveNomineeEto } from "../../../modules/nominee-flow/selectors";
import { appConnect } from "../../../store";
import { NomineeEtoOverviewThumbnail } from "../../eto/overview/EtoOverviewThumbnail/EtoOverviewThumbnail";

import * as styles from "../NomineeDashboard.module.scss";

interface ILinkedNomineeStateProps {
  eto: TEtoWithCompanyAndContractReadonly | undefined;
}

interface ILinkedNomineeComponentProps {
  eto: TEtoWithCompanyAndContractReadonly;
}

const LinkedNomineeDashboardContainerLayout: React.FunctionComponent<ILinkedNomineeComponentProps> = ({
  children,
  eto,
}) => (
  <div data-test-id="nominee-dashboard" className={styles.linkedNomineeDashboardContainer}>
    <section className={styles.dashboardContentPanel}>{children}</section>
    {eto && <NomineeEtoOverviewThumbnail eto={eto} shouldOpenInNewWindow={false} />}
  </div>
);

export const LinkedNomineeDashboardContainer = compose<ILinkedNomineeComponentProps, {}>(
  appConnect<ILinkedNomineeStateProps, {}, {}>({
    stateToProps: state => ({
      eto: selectActiveNomineeEto(state),
    }),
  }),
)(LinkedNomineeDashboardContainerLayout);
