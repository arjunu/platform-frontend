import { Container } from "inversify";
import { Middleware, MiddlewareAPI } from "redux";

import { FunctionWithDeps } from "../utils/opaque-types/types";

export function createInjectMiddleware(
  container: Container,
  customizer?: (container: Container, middlewareApi: MiddlewareAPI<any>) => void,
): Middleware {
  return middlewareApi => {
    // allow caller to customize container with dispatcher
    if (customizer) {
      customizer(container, middlewareApi);
    }
    return next => (action: any) => {
      if (typeof action === "function") {
        const deps = getDependencies(action);

        depSanityCheck(deps);

        const injections = deps.map(dep => container.get(dep));

        return action(...injections);
      }

      return next(action);
    };
  };
}

const dependencyInfoSymbol = Symbol.for("REDUX-INJECTIFY-DEP");

export function depSanityCheck(deps: symbol[]): void {
  if (!deps.every(v => !!v)) {
    throw new Error("Circular dependency on symbols detected!");
  }
}

export function getDependencies(func: Function): symbol[] {
  // try to get deps from explicitly annotated function
  const anyFunc: any = func;
  if (anyFunc[dependencyInfoSymbol]) {
    return anyFunc[dependencyInfoSymbol];
  } else {
    throw new Error("Explicit dependency list required!");
  }
}

export function injectableFn<T extends Function>(
  func: T,
  dependencies: symbol[],
): FunctionWithDeps & T {
  (func as any)[dependencyInfoSymbol] = dependencies;

  return func as any;
}

// patch redux dispatch signature to support dispatching functions
declare module "redux" {
  // tslint:disable-next-line
  export interface Dispatch<A extends Action = AnyAction> {
    (asyncAction: Function): void;
  }
}
