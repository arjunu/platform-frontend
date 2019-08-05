import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../modules/actions";
import { selectUserId } from "../../modules/auth/selectors";
import { selectEtoOfNominee } from "../../modules/eto/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/eto/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { NomineeEtoOverviewThumbnail } from "../eto/overview/EtoOverviewThumbnail/EtoOverviewThumbnail";
import { ENomineeTask } from "./NomineeTasksData";

import * as styles from "./NomineeDashboard.module.scss";

interface IExternalProps {
  nomineeTaskStep: ENomineeTask;
}

interface ILinkedNomineeStateProps {
  eto: TEtoWithCompanyAndContract | undefined;
}

interface ILinkedNomineeComponentProps {
  eto: TEtoWithCompanyAndContract;
}

export const AccountSetupContainer: React.FunctionComponent = ({ children }) => (
  <div data-test-id="nominee-dashboard" className={styles.accountSetupWrapper}>
    {children}
  </div>
);

const NotLinkedNomineeDashboardContainer: React.FunctionComponent = ({ children }) => (
  <div data-test-id="nominee-dashboard" className={styles.nomineeDashboardContainer}>
    {/*<section className={styles.dashboardContentPanel}>*/}
    {children}
    {/*</section>*/}
  </div>
);

const LinkedNomineeDashboardContainerLayout: React.FunctionComponent<
  ILinkedNomineeComponentProps
> = ({ children, eto }) => (
  <div data-test-id="nominee-dashboard" className={styles.linkedNomineeDashboardContainer}>
    <section className={styles.dashboardContentPanel}>{children}</section>
    {eto && <NomineeEtoOverviewThumbnail eto={eto} shouldOpenInNewWindow={false} />}
  </div>
);

const LinkedNomineeDashboardContainer = compose<ILinkedNomineeComponentProps, {}>(
  appConnect<ILinkedNomineeStateProps, {}, {}>({
    stateToProps: state => {
      const nomineeId = selectUserId(state);
      if (nomineeId) {
        return {
          eto: selectEtoOfNominee(state, nomineeId),
        };
      } else {
        throw new Error("linked nominee eto id is invalid");
      }
    },
  }),
  onEnterAction<{}>({
    actionCreator: dispatch => {
      dispatch(actions.eto.getNomineeEtos());
    },
  }),
)(LinkedNomineeDashboardContainerLayout);

const NomineeDashboardContainer: React.FunctionComponent<IExternalProps> = ({
  nomineeTaskStep,
  children,
}) => {
  switch (nomineeTaskStep) {
    case ENomineeTask.ACCOUNT_SETUP:
      return <AccountSetupContainer data-test-id={"nominee-dashboard"} children={children} />;
    case ENomineeTask.LINK_TO_ISSUER:
      return (
        <NotLinkedNomineeDashboardContainer
          data-test-id={"nominee-dashboard"}
          children={children}
        />
      );
    case ENomineeTask.LINK_BANK_ACCOUNT:
      return (
        <LinkedNomineeDashboardContainer data-test-id={"nominee-dashboard"} children={children} />
      );
    case ENomineeTask.ACCEPT_THA:
      return (
        <LinkedNomineeDashboardContainer data-test-id={"nominee-dashboard"} children={children} />
      );
    case ENomineeTask.REDEEM_SHARE_CAPITAL:
      return (
        <LinkedNomineeDashboardContainer data-test-id={"nominee-dashboard"} children={children} />
      );
    case ENomineeTask.ACCEPT_ISHA:
      return (
        <LinkedNomineeDashboardContainer data-test-id={"nominee-dashboard"} children={children} />
      );
    case ENomineeTask.NONE:
    default:
      return (
        <NotLinkedNomineeDashboardContainer
          data-test-id={"nominee-dashboard"}
          children={children}
        />
      );
  }
};

export { NomineeDashboardContainer, NotLinkedNomineeDashboardContainer };
