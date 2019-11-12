import { interfaces } from "inversify";

import { symbols } from "../di/symbols";
import { ILogger } from "../lib/dependencies/logger";
import { isPromise } from "./PromiseUtils";

/**
 * Like setInterval but works with both async and sync functions. It makes sure that callback is called exactly interval microseconds after function execution was finished (async functions need to return promise).
 * It can be started, stopped multiple times.
 */
export class AsyncIntervalScheduler {
  private cancelId?: number;
  private isCanceled: boolean = true;
  constructor(
    private readonly logger: ILogger,
    private readonly callback: Function,
    private readonly interval: number,
  ) {}

  public start(): void {
    if (!this.isCanceled) {
      return;
    }
    this.isCanceled = false;
    this.schedule();
  }

  public stop(): void {
    this.isCanceled = true;
    window.clearTimeout(this.cancelId!);
  }

  private schedule(): void {
    if (this.isCanceled) {
      return;
    }

    this.cancelId = window.setTimeout(async () => {
      try {
        const response = this.callback();
        if (isPromise(response)) {
          await response;
        }
      } catch (e) {
        this.logger.error("Uncaught error in AsyncIntervalScheduler: ", e);
      }

      this.schedule();
    }, this.interval);
  }
}

export type AsyncIntervalSchedulerFactoryType = (
  cb: () => void,
  interval: number,
) => AsyncIntervalScheduler;

export const AsyncIntervalSchedulerFactory: (
  context: interfaces.Context,
) => AsyncIntervalSchedulerFactoryType = context => {
  const logger = context.container.get<ILogger>(symbols.logger);
  return (callback, interval) => new AsyncIntervalScheduler(logger, callback, interval);
};
