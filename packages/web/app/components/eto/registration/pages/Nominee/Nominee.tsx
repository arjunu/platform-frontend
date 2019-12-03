import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../../modules/actions";
import { selectIssuerEtoLoading } from "../../../../../modules/eto-flow/selectors";
import { selectEtoNomineeIsLoading } from "../../../../../modules/eto-nominee/selectors";
import { appConnect } from "../../../../../store";
import { Button, EButtonLayout } from "../../../../shared/buttons/index";
import { LoadingIndicator } from "../../../../shared/loading-indicator/LoadingIndicator";
import { ChooseNominee } from "./ChooseNominee";

import * as styles from "./Nominee.module.scss";

interface IExternalProps {
  readonly: boolean;
  currentNomineeId: string | undefined;
  currentNomineeName: string | undefined;
}

interface IStateProps {
  isLoading: boolean;
}

interface IDispatchProps {
  deleteNomineeRequest: () => void;
}

interface ILayoutProps {
  readonly: boolean;
  currentNomineeId: string;
  currentNomineeName: string;
  deleteNomineeRequest: () => void;
}

const NomineeChosenLayout: React.FunctionComponent<ILayoutProps> = ({
  readonly,
  currentNomineeName,
  currentNomineeId,
  deleteNomineeRequest,
}) => (
  <div className={styles.nomineeChosenSection} data-test-id={`chosen-nominee-${currentNomineeId}`}>
    <p className={styles.text}>
      <FormattedMessage id="eto.form.eto-nominee.text" />
    </p>
    <section className={styles.nomineeBlock}>
      <span className={styles.nomineeName}>{currentNomineeName}</span>
      <span className={styles.nomineeAddress}>{currentNomineeId}</span>
    </section>
    {!readonly && (
      <Button
        className={styles.button}
        layout={EButtonLayout.OUTLINE}
        data-test-id="delete-nominee-request"
        onClick={deleteNomineeRequest}
      >
        <FormattedMessage id="eto.form.eto-nominee.cancel-request" />
      </Button>
    )}
  </div>
);

const Nominee = compose<IExternalProps & ILayoutProps, IExternalProps>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      isLoading: selectEtoNomineeIsLoading(s) || selectIssuerEtoLoading(s),
    }),
    dispatchToProps: dispatch => ({
      deleteNomineeRequest: () => dispatch(actions.etoNominee.deleteNomineeRequest()),
    }),
  }),
  branch<IStateProps>(({ isLoading }) => isLoading, renderComponent(LoadingIndicator)),
  branch<IStateProps & IExternalProps>(
    ({ currentNomineeId }) => currentNomineeId === undefined,
    renderComponent(ChooseNominee),
  ),
)(NomineeChosenLayout);

export { NomineeChosenLayout, Nominee };
