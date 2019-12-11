import { createBrowserHistory } from "history";
import * as React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "redux";
import configureStore, { MockStore } from "redux-mock-store";

import { TAction } from "../../modules/actions";
import { generateRootReducer, IAppState } from "../../store";
import { DeepPartial } from "../../types";

const mockStore = configureStore();

const rootReducer = generateRootReducer(createBrowserHistory());

export const withStore = (initialState?: DeepPartial<IAppState>) => (
  story: () => React.ReactNode,
): any => {
  const store = createStore<IAppState, TAction, unknown, unknown>(rootReducer, initialState as any);

  return <ReduxProvider store={store}>{story()}</ReduxProvider>;
};

export const withMockStore = (initialState?: DeepPartial<IAppState>) => (
  node: React.ReactNode,
): {
  store: MockStore;
  node: React.ReactElement<ReduxProvider>;
} => {
  const store = mockStore(initialState);

  return {
    store,
    node: <ReduxProvider store={store}>{node}</ReduxProvider>,
  };
};

export const withSuspense = () => (story: () => React.ReactNode): React.ReactNode => (
  <React.Suspense fallback={() => "Loading chunks..."}>{story()}</React.Suspense>
);
