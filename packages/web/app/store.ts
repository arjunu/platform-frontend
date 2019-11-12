import { connectRouter, LocationChangeAction, RouterState } from "connected-react-router";
import { History } from "history";
import { connect, InferableComponentEnhancerWithProps, Options } from "react-redux";
import { combineReducers, Reducer } from "redux";

import { actions, TAction } from "./modules/actions";
import { initInitialState } from "./modules/init/reducer";
import { appReducers } from "./modules/reducer";
import { DeepReadonly } from "./types";
import { FunctionWithDeps } from "./utils/opaque-types/types";

export interface IAppAction {
  type: string;
  payload?: any;
}
export type ActionType<T extends IAppAction> = T["type"];
export type ActionPayload<T extends IAppAction> = T["payload"];

export type AppDispatch = (a: AppActionTypes | FunctionWithDeps) => void;

export type AppReducer<S> = Reducer<DeepReadonly<S>, AppActionTypes>;

// add new external actions here
export type AppActionTypes = DeepReadonly<TAction | LocationChangeAction>;

// base on reducers we can infer type of app state
type TReducersMapToReturnTypes<T extends Record<string, (...args: any[]) => any>> = {
  [P in keyof T]: ReturnType<T[P]>
};

export type IAppState = TReducersMapToReturnTypes<typeof appReducers> & {
  router: RouterState;
};

const generateAppReducer = (history: History) =>
  combineReducers<IAppState>({
    ...appReducers,
    router: connectRouter(history),
  });

// All states that should remain even after logout
const staticValues = (state: IAppState | undefined): Partial<IAppState> | undefined => {
  if (state) {
    return {
      router: state.router,
      init: { ...initInitialState, smartcontractsInit: state.init.smartcontractsInit },
      contracts: { ...state.contracts },
      // TODO: Think about the state and where smart contracts should be
    };
  }

  return undefined;
};

export const generateRootReducer = (history: History) => {
  const appReducer = generateAppReducer(history);

  return (state: IAppState | undefined, action: TAction) => {
    switch (action.type) {
      case actions.auth.logout.getType():
        return appReducer(staticValues(state) as IAppState, action);
    }
    return appReducer(state, action);
  };
};

/**
 * If react-redux connection function receive `undefined` as a `dispatchToProps` method it then pass `dispatch` method to wrapped component.
 * Often it's not needed as it leads to problems when wrapped component spread all props to any dom element
 * @param omitDispatch
 */
const getDispatchToProps = (omitDispatch: boolean) => (omitDispatch ? () => ({}) : undefined);

type TCustomOptions = {
  omitDispatch?: boolean;
};

interface IAppConnectOptions<S, D, O> {
  stateToProps?: (state: IAppState, ownProps: O) => S;
  dispatchToProps?: (dispatch: AppDispatch, ownProps: O) => D;
  options?: Options<IAppState, S, O> & TCustomOptions;
}

// helper to use instead of redux connect. It's bound with our app state and it uses dictionary to pass arguments
export function appConnect<S = {}, D = {}, O = {}>({
  stateToProps,
  dispatchToProps,
  options = {},
}: IAppConnectOptions<S, D, O>): InferableComponentEnhancerWithProps<S & D, O> {
  const { omitDispatch = false, ...connectOptions } = options;

  return connect<S, D, O, IAppState>(
    stateToProps,
    dispatchToProps || (getDispatchToProps(omitDispatch) as any),
    undefined,
    connectOptions,
  );
}
