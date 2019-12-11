import { nonNullable } from "@neufund/shared"
import { isEmpty } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { compose } from "recompose";

import { selectUserId } from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { etoRegisterRoutes } from "../../eto/registration/routes";
import { DashboardHeading } from "../../eto/shared/DashboardHeading";
import { TWithNomineeProps, withNomineeRequests } from "../../eto/shared/hocs/withNomineeRequests";
import { AccountAddress } from "../../shared/AccountAddress";

type TStateProps = {
  issuerId: string;
};

const LinkNomineeStepLayout: React.FunctionComponent<TWithNomineeProps & TStateProps> = ({
  nomineeRequests,
  issuerId,
}) => {
  const isAwaitingNomineeRequests = isEmpty(nomineeRequests);

  return (
    <>
      <DashboardHeading
        title={<FormattedMessage id="eto-dashboard.link-nominee" />}
        data-test-id={
          isAwaitingNomineeRequests ? "eto-dashboard-link-nominee" : "eto-dashboard-accept-nominee"
        }
      />

      {isAwaitingNomineeRequests ? (
        <>
          <p>
            <FormattedMessage id="eto-dashboard.link-nominee.description" />
          </p>
          <AccountAddress address={issuerId} data-test-id="issuer-id" />
        </>
      ) : (
        <p className="mb-0">
          <FormattedMessage
            id="eto-dashboard.link-nominee.nominee-available-description"
            values={{
              form: (
                <Link to={etoRegisterRoutes.etoVotingRights}>
                  <FormattedMessage id="eto.form.section.token-holders-rights.title" />
                </Link>
              ),
            }}
          />
        </p>
      )}
    </>
  );
};

const LinkNomineeStep = compose<TWithNomineeProps & TStateProps, {}>(
  withNomineeRequests(),
  appConnect<TStateProps>({
    stateToProps: s => ({
      issuerId: nonNullable(selectUserId(s)),
    }),
  }),
)(LinkNomineeStepLayout);

export { LinkNomineeStep };
