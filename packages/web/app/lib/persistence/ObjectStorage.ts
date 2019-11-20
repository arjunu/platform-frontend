import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import { ILogger } from "../dependencies/logger";
import { Storage } from "./Storage";

@injectable()
export class ObjectStorage<T> {
  constructor(
    @inject(symbols.storage) private readonly storage: Storage,
    @inject(symbols.logger) private readonly logger: ILogger,
    private readonly key: string,
  ) {}

  public set(value: T): void {
    this.logger.info(`Setting key: ${this.key} on storage`);
    this.storage.setKey(this.key, JSON.stringify(value));
  }

  public get(): T | undefined {
    this.logger.info(`Getting key: ${this.key} from storage`);
    const value = this.storage.getKey(this.key);
    if (!value) {
      return undefined;
    } else {
      return JSON.parse(value);
    }
  }

  public clear(): void {
    this.logger.info(`Clearing storage for key ${this.key}`);
    this.storage.removeKey(this.key);
  }
}
