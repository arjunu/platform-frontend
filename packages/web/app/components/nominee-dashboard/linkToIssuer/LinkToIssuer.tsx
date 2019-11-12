import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, renderNothing, withProps } from "recompose";

import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import {
  selectNomineeEtoWithCompanyAndContract,
  selectNomineeRequests,
  selectNomineeStateError,
} from "../../../modules/nominee-flow/selectors";
import {
  ENomineeRequestError,
  ENomineeRequestStatus,
  INomineeRequest,
} from "../../../modules/nominee-flow/types";
import { takeLatestNomineeRequest } from "../../../modules/nominee-flow/utils";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { withContainer } from "../../../utils/withContainer.unsafe";
import { NomineeLinkRequestForm } from "./LinkToIssuerForm";
import { NomineeRequestPending } from "./NomineeRequestPending";
import { ENomineeRequestComponentState } from "./types";
import { getNomineeRequestComponentState } from "./utils";

import * as styles from "./LinkToIssuer.module.scss";

interface IStateProps {
  nomineeRequest: INomineeRequest | undefined;
  nomineeRequestError: ENomineeRequestError;
  nomineeEto: TEtoWithCompanyAndContractReadonly | undefined;
}

interface IRepeatRequestProps {
  nomineeRequest: INomineeRequest;
  nomineeRequestError: ENomineeRequestError;
}

interface IBranchProps {
  nextState: ENomineeRequestComponentState;
  nomineeRequest: INomineeRequest | undefined;
  nomineeRequestError: ENomineeRequestError;
}

const getErrorText = (
  requestStatus: INomineeRequest,
  nomineeRequestError: ENomineeRequestError,
): TTranslatedString => {
  if (
    requestStatus.state === ENomineeRequestStatus.REJECTED &&
    (nomineeRequestError === ENomineeRequestError.NONE ||
      nomineeRequestError === ENomineeRequestError.REQUEST_EXISTS)
  ) {
    return (
      <FormattedHTMLMessage
        tagName="span"
        id="nominee-flow.link-with-issuer.error-request-rejected"
        values={{ etoId: requestStatus.etoId }}
      />
    );
  } else if (nomineeRequestError === ENomineeRequestError.REQUEST_EXISTS) {
    return (
      <FormattedHTMLMessage
        tagName="span"
        id="nominee-flow.link-with-issuer.error-request-exists"
        values={{ etoId: requestStatus.etoId }}
      />
    );
  } else if (nomineeRequestError === ENomineeRequestError.ISSUER_ID_ERROR) {
    return <FormattedMessage id="nominee-flow.link-with-issuer.issuer-id-error-text" />;
  } else if (nomineeRequestError === ENomineeRequestError.GENERIC_ERROR) {
    return <FormattedMessage id="nominee-flow.link-with-issuer.generic-error-text" />;
  } else {
    throw new Error("invalid nominee request status ");
  }
};

export const RepeatNomineeRequestLayout: React.FunctionComponent<IRepeatRequestProps> = ({
  nomineeRequest,
  nomineeRequestError,
}) => (
  <>
    <h1 className={styles.title}>
      <FormattedMessage id="nominee-flow.link-with-issuer.link-with-issuer" />
    </h1>
    <p className={cn(styles.text, styles.error)}>
      {getErrorText(nomineeRequest, nomineeRequestError)}
    </p>
  </>
);

export const CreateNomineeRequestLayout: React.FunctionComponent = () => (
  <>
    <h1 className={styles.title}>
      <FormattedMessage id="nominee-flow.link-with-issuer.link-with-issuer" />
    </h1>
    <p className={styles.text}>
      <FormattedMessage id="nominee-flow.link-with-issuer.enter-wallet-address" />
    </p>
  </>
);

export const RepeatCreateNomineeRequestLayout: React.FunctionComponent<IRepeatRequestProps> = ({
  nomineeRequest,
}) => (
  <>
    <h1 className={styles.title}>
      <FormattedMessage id="nominee-flow.link-with-issuer.link-with-issuer" />
    </h1>
    <p
      className={cn(styles.text, styles.error)}
      data-test-id={`nominee-dashboard-request-rejected-${nomineeRequest.etoId}`}
    >
      <FormattedMessage
        id="nominee-flow.link-with-issuer.error-request-rejected"
        values={{ etoId: nomineeRequest.etoId }}
      />
    </p>
  </>
);

export const NomineeRequestContainer: React.FunctionComponent = ({ children }) => (
  <section className={styles.linkToIssuerContentPanel}>
    {children}
    <NomineeLinkRequestForm />
  </section>
);

export const LinkToIssuer = compose<IStateProps, {}>(
  appConnect<IStateProps>({
    stateToProps: state => ({
      nomineeEto: selectNomineeEtoWithCompanyAndContract(state),
      nomineeRequest: takeLatestNomineeRequest(selectNomineeRequests(state)), //only take the latest one for now
      nomineeRequestError: selectNomineeStateError(state),
    }),
  }),
  withProps<{ nextState: ENomineeRequestComponentState }, IStateProps>(
    ({ nomineeRequest, nomineeRequestError, nomineeEto }) => ({
      nextState: getNomineeRequestComponentState(nomineeRequest, nomineeRequestError, nomineeEto),
    }),
  ),
  branch<IBranchProps>(
    ({ nextState }) => nextState === ENomineeRequestComponentState.SUCCESS,
    renderNothing,
  ), //this state should have been caught way before, here it's just for completeness sake
  branch<IBranchProps>(
    ({ nextState }) => nextState === ENomineeRequestComponentState.WAIT_WHILE_RQUEST_PENDING,
    renderComponent(NomineeRequestPending),
  ),
  withContainer(NomineeRequestContainer),
  branch<IBranchProps>(
    ({ nextState }) => nextState === ENomineeRequestComponentState.REPEAT_REQUEST,
    renderComponent(RepeatNomineeRequestLayout),
  ),
  branch<IBranchProps>(
    ({ nextState }) => nextState === ENomineeRequestComponentState.CREATE_ANOTHER_REQUEST,
    renderComponent(RepeatCreateNomineeRequestLayout),
  ),
)(CreateNomineeRequestLayout);
