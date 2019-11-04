import { expectSaga } from 'redux-saga-test-plan';
import { startRouteBasedSagas } from "./sagas";
import { TGlobalDependencies } from "../../di/setupBindings";
import { LocationChangeAction } from "connected-react-router";
import { EAuthStatus } from "../auth/reducer";
import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../actions";

const globalDependencies = {} as TGlobalDependencies;

const routerAction = {
  type: "@@router/LOCATION_CHANGE",
  payload:
    {
      action: "POP",
      isFirstRendering: false,
      location: {
        hash: "",
        key: "4cn578",
        pathname: "/dashboard",
        search: "",
        state: undefined,
      }
    }
} as LocationChangeAction;

const state = {
  auth: {
    jwt: "bla",
    user: {
      type: EUserType.NOMINEE
    },
    status: EAuthStatus.AUTHORIZED
  },
  init:{
    appInit: {
      done: true
    }
  }
};

describe.only("startRouteBasedSagas", () => {
  //todo expand to test with different state data
  it("runs nomineeDashboardView when going to /dashboard as Nominee", () => {

    return expectSaga(startRouteBasedSagas,globalDependencies, routerAction)
      .withState(state)
      .put(actions.nomineeFlow.nomineeDashboardView())
      .run()
  });
  it("doesn't run nomineeDashboardView when location is not /dashboard", () => {
    routerAction.payload.location.pathname = "/";

    return expectSaga(startRouteBasedSagas,globalDependencies, routerAction)
      .withState(state)
      .not.put(actions.nomineeFlow.nomineeDashboardView())
      .run()
  });
});
