import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../../modules/actions";
import { INomineeRequest } from "../../../../../modules/nominee-flow/types";
import { appConnect } from "../../../../../store";
import { Button, EButtonLayout, EButtonTheme } from "../../../../shared/buttons/Button";
import { FormHighlightGroup } from "../../../../shared/forms/FormHighlightGroup";
import { TWithNomineeProps, withNomineeRequests } from "../../../../issuer-dashboard/hocs/withNomineeRequests";
import { Section } from "../../Shared";
import { CopyEtoIdComponent } from "./CopyEtoIdComponent";
import { nomineeRequestsAreEmpty } from "./utils";

import * as styles from "./Nominee.module.scss";

interface IDispatchProps {
  acceptNominee: (nomineeId: string) => void;
  rejectNominee: (nomineeId: string) => void;
}

interface IPendingNomineeRequest {
  request: INomineeRequest;
  nomineeRequestsLength: number;
}

interface IFullButtonBlockProps {
  nomineeId: string;
}

interface IOneButtonBlockProps {
  acceptNominee: (nomineeId: string) => void;
  nomineeId: string;
}

const FullButtonBlock: React.FunctionComponent<IFullButtonBlockProps & IDispatchProps> = ({
  acceptNominee,
  rejectNominee,
  nomineeId,
}) => (
  <div className={styles.buttonBlock}>
    <Button
      layout={EButtonLayout.PRIMARY}
      theme={EButtonTheme.BRAND}
      onClick={() => acceptNominee(nomineeId)}
      data-test-id="eto-nominee-accept"
    >
      <FormattedMessage id="eto.form.section.eto-nominee.nominee-request.accept" />
    </Button>
    <Button
      layout={EButtonLayout.PRIMARY}
      onClick={() => rejectNominee(nomineeId)}
      data-test-id="eto-nominee-reject"
    >
      <FormattedMessage id="eto.form.section.eto-nominee.nominee-request.reject" />
    </Button>
  </div>
);

const OneButtonBlock: React.FunctionComponent<IOneButtonBlockProps> = ({
  acceptNominee,
  nomineeId,
}) => (
  <div className={styles.buttonBlock}>
    <Button
      layout={EButtonLayout.PRIMARY}
      onClick={() => acceptNominee(nomineeId)}
      theme={EButtonTheme.BRAND}
      data-test-id="eto-nominee-choose"
    >
      <FormattedMessage id="eto.form.section.eto-nominee.nominee-request.choose" />
    </Button>
  </div>
);

const PendingNomineeRequest: React.FunctionComponent<IPendingNomineeRequest & IDispatchProps> = ({
  request,
  nomineeRequestsLength,
  acceptNominee,
  rejectNominee,
}) => (
  <FormHighlightGroup key={request.nomineeId} className={styles.pendingNomineeRequest}>
    <p className={styles.pendingNomineeRequestText}>
      <FormattedMessage id="eto.form.section.eto-nominee.nominee-request-text" />
    </p>

    <div className={styles.pendingNomineeRequestInfo}>
      <section>
        <h5>
          <FormattedMessage id="eto.form.section.eto-nominee.nominee-request.company" />
        </h5>

        <p>{request.metadata.name}</p>
        <p>
          <FormattedMessage id="eto.form.section.eto-nominee.nominee-request.registration-number" />{" "}
          {request.metadata.registrationNumber}
        </p>
      </section>

      <section>
        <h5>
          <FormattedMessage id="eto.form.section.eto-nominee.nominee-request.address" />
        </h5>
        <p>{`${request.metadata.street}, ${request.metadata.zipCode} ${request.metadata.city}`}</p>
      </section>

      <section>
        <h5>
          <FormattedMessage id="eto.form.section.eto-nominee.nominee-request.nominee-address" />
        </h5>
        <p>{request.nomineeId}</p>
      </section>
    </div>

    {nomineeRequestsLength > 1 ? (
      <OneButtonBlock acceptNominee={acceptNominee} nomineeId={request.nomineeId} />
    ) : (
      <FullButtonBlock
        acceptNominee={acceptNominee}
        rejectNominee={rejectNominee}
        nomineeId={request.nomineeId}
      />
    )}
  </FormHighlightGroup>
);

const PendingNomineesComponent: React.FunctionComponent<TWithNomineeProps & IDispatchProps> = ({
  nomineeRequests,
  acceptNominee,
  rejectNominee,
}) => (
  <>
    <CopyEtoIdComponent />
    <Section>
      <div>
        <FormattedMessage id="eto.form.section.eto-nominee.nominee" />
      </div>
      {nomineeRequests.map(request => (
        <PendingNomineeRequest
          key={request.nomineeId}
          request={request}
          nomineeRequestsLength={nomineeRequests.length}
          acceptNominee={acceptNominee}
          rejectNominee={rejectNominee}
        />
      ))}
    </Section>
  </>
);

const ChooseNominee = compose<TWithNomineeProps & IDispatchProps, {}>(
  withNomineeRequests(),
  appConnect<{}, IDispatchProps>({
    dispatchToProps: dispatch => ({
      acceptNominee: (nomineeId: string) =>
        dispatch(actions.etoNominee.acceptNomineeRequest(nomineeId)),
      rejectNominee: (nomineeId: string) =>
        dispatch(actions.etoNominee.rejectNomineeRequest(nomineeId)),
    }),
  }),
  branch<TWithNomineeProps>(
    ({ nomineeRequests }) => nomineeRequestsAreEmpty(nomineeRequests),
    renderComponent(CopyEtoIdComponent),
  ),
)(PendingNomineesComponent);

export { ChooseNominee, PendingNomineesComponent };
