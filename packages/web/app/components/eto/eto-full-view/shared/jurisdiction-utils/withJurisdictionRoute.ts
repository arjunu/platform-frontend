import { actions } from "../../../../../modules/actions";
import { onEnterAction } from "../../../../../utils/OnEnterAction";

export const withJurisdictionRoute = <P extends object>(
  getProps: (props: P) => { previewCode: string; jurisdiction: string },
) =>
  onEnterAction<P>({
    actionCreator: (dispatch, props) => {
      const { previewCode, jurisdiction } = getProps(props);
      dispatch(actions.eto.ensureEtoJurisdiction(previewCode, jurisdiction.toUpperCase()));
    },
  });
