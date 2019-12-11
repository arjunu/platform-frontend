import { compose } from "recompose";

import { actions } from "../../../../modules/actions";
import { selectNomineeRequests } from "../../../../modules/eto-nominee/selectors";
import { INomineeRequest } from "../../../../modules/nominee-flow/types";
import { appConnect } from "../../../../store";
import { THocProps } from "../../../../types";
import { onEnterAction } from "../../../../utils/react-connected-components/OnEnterAction";
import { onLeaveAction } from "../../../../utils/react-connected-components/OnLeaveAction";

type TStateProps = {
  nomineeRequests: INomineeRequest[];
};

export type TWithNomineeProps = THocProps<typeof withNomineeRequests>;

export const withNomineeRequests = () =>
  compose<TStateProps, {}>(
    appConnect<TStateProps>({
      stateToProps: s => ({
        nomineeRequests: selectNomineeRequests(s),
      }),
    }),
    onEnterAction({
      actionCreator: d => d(actions.etoNominee.startNomineeRequestsWatcher()),
    }),
    onLeaveAction({
      actionCreator: d => d(actions.etoNominee.stopNomineeRequestsWatcher()),
    }),
  );
