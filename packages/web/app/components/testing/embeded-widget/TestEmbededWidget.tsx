import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import {
  selectEtoWidgetError,
  selectInvestorEtoWithCompanyAndContract,
} from "../../../modules/eto/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { etoWidgetViewLink } from "../../appRouteUtils";

interface IStateProps {
  eto: TEtoWithCompanyAndContractReadonly | undefined;
  widgetError: boolean | undefined;
}

interface IRouterParams {
  previewCode: string;
}

const EmbeddedWidgetLayout: React.FunctionComponent<IStateProps> = ({ eto, widgetError }) => (
  <>
    <h3>Eto widget testing page</h3>
    {eto && eto.previewCode && (
      <iframe width="100%" height={215} src={etoWidgetViewLink(eto.previewCode)} />
    )}

    {widgetError && <iframe width="100%" height={215} src={etoWidgetViewLink("error-id")} />}
  </>
);

const EmbeddedWidget = compose<IStateProps, IRouterParams>(
  appConnect<IStateProps, {}, IRouterParams & IRouterParams>({
    stateToProps: (state, props) => ({
      eto: selectInvestorEtoWithCompanyAndContract(state, props.previewCode),
      widgetError: selectEtoWidgetError(state.eto),
    }),
  }),
  onEnterAction<IRouterParams>({
    actionCreator: (dispatch, props) => {
      dispatch(actions.eto.loadEtoPreview(props.previewCode, true));
    },
  }),
)(EmbeddedWidgetLayout);

export { EmbeddedWidget };
