import { LocationChangeAction } from "connected-react-router";
import { expectSaga } from "redux-saga-test-plan";

import { appRoutes } from "../../components/appRoutes";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../actions";
import { EAuthStatus } from "../auth/reducer";
import { startRouteBasedSagas } from "./sagas";

const globalDependencies = {
  //todo write out the full context, move to utils
  logger: {
    info: (_: string) => {},
    error: (_: string) => {},
  },
} as TGlobalDependencies;

const routerAction = {
  type: "@@router/LOCATION_CHANGE",
  payload: {
    action: "POP",
    isFirstRendering: false,
    location: {
      hash: "",
      key: "4cn578",
      pathname: appRoutes.dashboard,
      search: "",
      state: undefined,
    },
  },
} as LocationChangeAction;

const state = {
  auth: {
    jwt: "bla",
    user: {
      type: EUserType.NOMINEE,
    },
    status: EAuthStatus.AUTHORIZED,
  },
  init: {
    appInit: {
      done: true,
    },
  },
};

describe("startRouteBasedSagas", () => {
  //todo expand to test with different state data
  it("runs nomineeDashboardView when going to /dashboard as Nominee", () =>
    expectSaga(startRouteBasedSagas, globalDependencies, routerAction)
      .withState(state)
      .put(actions.nomineeFlow.nomineeDashboardView())
      .run());
  it("doesn't run nomineeDashboardView when location is not /dashboard", () => {
    routerAction.payload.location.pathname = "/";

    return expectSaga(startRouteBasedSagas, globalDependencies, routerAction)
      .withState(state)
      .not.put(actions.nomineeFlow.nomineeDashboardView())
      .run();
  });
  it("runs nomineeDashboardView when going to /eto/view as Nominee", () => {
    routerAction.payload.location.pathname = appRoutes.etoIssuerView;

    return expectSaga(startRouteBasedSagas, globalDependencies, routerAction)
      .withState(state)
      .put(actions.nomineeFlow.loadNomineeEtoView())
      .run();
  });
  it("runs nomineeDashboardView when going to /documents as Nominee", () => {
    routerAction.payload.location.pathname = appRoutes.documents;

    return expectSaga(startRouteBasedSagas, globalDependencies, routerAction)
      .withState(state)
      .put(actions.nomineeFlow.nomineeDocumentsView())
      .run();
  });
});
