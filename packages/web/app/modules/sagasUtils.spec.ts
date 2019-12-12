import { cancelled, delay, expectSaga, put } from "@neufund/sagas";

import { TPattern } from "./actions";
import { neuRepeatIf, neuRestartIf, neuTakeOnly, neuTakeUntil } from "./sagasUtils";

describe("sagasUtils", () => {
  describe("neuTakeUntil", () => {
    const SAGA_DELAY = 30;

    function* baseSaga(): any {
      try {
        yield delay(SAGA_DELAY);
      } finally {
        if (yield cancelled()) {
          yield put({ type: "SAGA_CANCELLED" });
        }
      }
    }

    it("should call base saga after start action", () =>
      expectSaga(neuTakeUntil, "INIT_START", "INIT_ERROR", baseSaga)
        .dispatch({ type: "INIT_START" })
        .call.fn(baseSaga)
        .silentRun());

    it("should cancel task when stop action was dispatched", () =>
      expectSaga(neuTakeUntil, "INIT_START", "INIT_ERROR", baseSaga)
        .put({ type: "SAGA_CANCELLED" })
        .dispatch({ type: "INIT_START" })
        .delay(SAGA_DELAY - 10)
        .dispatch({ type: "INIT_ERROR" })
        .silentRun());

    it("should loop", () =>
      expectSaga(neuTakeUntil, "INIT_START", "INIT_ERROR", baseSaga)
        .take("INIT_START")
        .dispatch({ type: "INIT_START" })
        .call.fn(baseSaga)
        .delay(SAGA_DELAY + 10)
        .take("INIT_START")
        .dispatch({ type: "INIT_START" })
        .call.fn(baseSaga)
        .silentRun());
  });

  describe("neuTakeOnly", () => {
    it("should return action on payload match", () => {
      const action = { type: "INIT_START", payload: { init: "app", foo: "bar" } };

      return (expectSaga(neuTakeOnly as any, "INIT_START", { init: "app" } as any) as any)
        .dispatch(action)
        .returns(action)
        .silentRun();
    });

    it("should try to take action again when payload doesn't match", () => {
      const action = { type: "INIT_START", payload: { init: "smartcontracts" } };

      return (expectSaga(neuTakeOnly as any, "INIT_START", { init: "app" } as any) as any)
        .dispatch(action)
        .take("INIT_START")
        .take("INIT_START")
        .silentRun();
    });
  });

  describe("neuRepeatIf", () => {
    function* baseSaga(): any {
      yield delay(10);
    }

    it("should repeat when repeat action was dispatched", () =>
      expectSaga(neuRepeatIf, "INIT_START", "INIT_END" as TPattern, baseSaga)
        .call.fn(baseSaga)
        .dispatch({ type: "INIT_START" })
        .call.fn(baseSaga)
        .silentRun());

    it("should exit when repeat action was dispatched", () =>
      expectSaga(neuRepeatIf, "INIT_START", "INIT_END" as TPattern, baseSaga)
        .call.fn(baseSaga)
        .dispatch({ type: "INIT_END" })
        .not.call.fn(baseSaga)
        .silentRun());

    it("should pass args to base saga", () =>
      expectSaga(neuRepeatIf, "INIT_START", "INIT_END" as TPattern, baseSaga, "foo", "bar")
        .call.like({ fn: baseSaga, args: ["foo", "bar"] })
        .silentRun());
  });

  describe("neuRestartIf", () => {
    function* baseSaga(): any {
      yield delay(10);
    }

    it("should repeat when repeat action was dispatched", () =>
      expectSaga(neuRestartIf, "INIT_END" as TPattern, baseSaga)
        .call.fn(baseSaga)
        .dispatch({ type: "INIT_END" })
        .call.fn(baseSaga)
        .silentRun());

    it("should pass args to base saga", () =>
      expectSaga(neuRestartIf, "INIT_END" as TPattern, baseSaga, "foo", "bar")
        .call.like({ fn: baseSaga, args: ["foo", "bar"] })
        .silentRun());
  });
});
