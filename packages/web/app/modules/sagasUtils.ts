import { isMatch } from "lodash/fp";
import { delay } from "redux-saga";
import {
  call,
  Effect,
  fork,
  getContext,
  race,
  spawn,
  take,
  takeEvery,
  takeLatest,
  throttle,
} from "redux-saga/effects";

import { TGlobalDependencies } from "../di/setupBindings";
import { TSingleOrArray } from "../types";
import { TActionPayload, TPattern } from "./actions";

type TSagaWithDeps = (deps: TGlobalDependencies, ...args: any[]) => any;
type TSagaWithDepsAndArgs<R, T extends any[]> = (deps: TGlobalDependencies, ...args: T) => R;

type TType = TSingleOrArray<TPattern>;

export function* neuTakeLatest(type: TType, saga: TSagaWithDeps): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  yield takeLatest(type, saga, deps);
}

export function* neuTakeEvery(type: TType, saga: TSagaWithDeps): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  yield takeEvery(type, saga, deps);
}

export function* neuFork<R, T extends any[]>(
  saga: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  return yield (fork as any)(saga, deps, ...args);
}

export function* neuSpawn<R, T extends any[]>(
  saga: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  return yield (spawn as any)(saga, deps, ...args);
}

export function* neuCall<R, T extends any[]>(
  saga: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  return yield (call as any)(saga, deps, ...args);
}

/**
 * Starts saga on `startAction`, cancels on `stopAction`, loops...
 */
export function* neuTakeUntil(startAction: TType, stopAction: TType, saga: TSagaWithDeps): any {
  while (true) {
    const action = yield take(startAction);
    // No direct concurrent requests like `fork` or `spawn` should be in the loop
    yield race({
      task: neuCall(saga, action),
      cancel: take(stopAction),
    });
  }
}

/**
 * Starts saga on `startAction`, cancels on `stopAction`, loops...
 */
export function* neuTakeLatestUntil(
  startAction: TType,
  stopAction: TType,
  saga: TSagaWithDeps,
): any {
  yield takeLatest(startAction, function*(payload): Iterator<any> {
    yield race({
      task: neuCall(saga, payload),
      cancel: take(stopAction),
    });
  });
}

/**
 *  Awaits an Action with specific payload.
 *  You can pass only a part of the payload that you want to match.
 */
export function* neuTakeOnly<T extends TPattern>(
  type: T,
  payload: Partial<TActionPayload<T>>,
): any {
  while (true) {
    const takenAction = yield take(type);
    if (isMatch(payload, takenAction.payload)) {
      return takenAction;
    }
  }
}

/**
 *  Executes the generator and repeats if repeatAction was dispatched. Exits when endAction
 *  is dispatched.
 */
export function* neuRepeatIf<R, T extends any[]>(
  repeatAction: TType,
  endAction: TType,
  saga: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): any {
  while (true) {
    yield neuCall(saga, ...args);

    const { repeat, end } = yield race({
      repeat: take(repeatAction),
      end: take(endAction),
    });
    if (repeat) {
      continue;
    }
    if (end) {
      return;
    }
  }
}

/**
 *  Executes the generator and restarts running job if a specific actions is fired
 */
export function* neuRestartIf<R, T extends any[]>(
  cancelAction: TType,
  saga: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): any {
  while (true) {
    yield race({
      task: neuCall(saga, ...args),
      cancel: take(cancelAction),
    });
  }
}

/**
 * Ignore incoming actions for a given period of time while processing a task.
 * After spawning a task, it's still accepting incoming actions into the underlying buffer, keeping at most 1.
 */
export function* neuThrottle(ms: number, type: TType, saga: TSagaWithDeps): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  yield throttle(ms, type, saga, deps);
}

function* next<R, T extends any[]>(
  ms: number,
  task: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): Iterator<any> {
  yield delay(ms);
  yield neuCall(task, ...args);
}

// TODO: Add tests for debounce
export function* neuDebounce<R, T extends any[]>(
  ms: number,
  pattern: TType,
  saga: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): Iterator<Effect> {
  yield (takeLatest as any)(pattern, next, ms, saga, ...args);
}
