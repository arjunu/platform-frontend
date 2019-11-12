import { injectable } from "inversify";

/** Simple adapter on local storage */
@injectable()
export class Storage {
  constructor(private localStorage: WindowLocalStorage["localStorage"]) {}

  private inMemoryStorage: { [key: string]: string } = {};
  private isSupported: boolean | undefined = undefined;

  public checkIsSupported(): boolean {
    if (this.isSupported === undefined) {
      try {
        const testKey = "test value";
        this.localStorage.setItem(testKey, testKey);
        this.localStorage.removeItem(testKey);
        this.isSupported = true;
      } catch (e) {
        this.isSupported = false;
      }
    }
    return this.isSupported;
  }

  public setKey(key: string, value: string): void {
    if (this.checkIsSupported()) {
      this.localStorage.setItem(key, value);
    } else {
      this.inMemoryStorage[name] = value;
    }
  }

  public getKey(key: string): string | null {
    if (this.checkIsSupported()) {
      return this.localStorage.getItem(key);
    }

    if (this.inMemoryStorage.hasOwnProperty(name)) {
      return this.inMemoryStorage[name];
    }

    return null;
  }

  public removeKey(key: string): void {
    if (this.checkIsSupported()) {
      this.localStorage.removeItem(key);
    } else {
      delete this.inMemoryStorage[name];
    }
  }
}
