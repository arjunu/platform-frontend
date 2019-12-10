import { EventEmitter } from "events";

export class DummyBlockTracker extends EventEmitter {
  public async start(): Promise<void> {}

  public async stop(): Promise<void> {}
}
