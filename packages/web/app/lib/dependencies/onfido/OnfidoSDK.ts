import { EventEmitter } from "events";
import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { IntlWrapper } from "../../intl/IntlWrapper";
import { ILogger } from "../logger";
import {
  OnfidoSDKError,
  OnfidoSDKInitError,
  OnfidoSDKNotSupportedBrowserError,
  OnfidoSDKTearDownError,
  OnfidoSDKTearDownWithoutInitError,
} from "./errors";
import { getOnfidoSteps } from "./onfidoSteps";

export enum EOnfidoSDKEvents {
  DISCARDED = "discarded",
  COMPLETED = "completed",
  FAILED = "failed",
}

type TInitOptions = {
  token: string;
};

type OnfidoSDKType = typeof import("onfido-sdk-ui");

export const loadOnfidoSdk = (): Promise<OnfidoSDKType> => import("onfido-sdk-ui");

@injectable()
export class OnfidoSDK extends EventEmitter {
  protected onfido: ReturnType<OnfidoSDKType["init"]> | undefined;

  constructor(
    @inject(symbols.logger) private readonly logger: ILogger,
    @inject(symbols.intlWrapper) private readonly intlWrapper: IntlWrapper,
  ) {
    super();
  }

  private onCompleteHandler = () => {
    try {
      this.logger.info("Onfido request completed");

      if (!this.onfido) {
        throw new OnfidoSDKError();
      }

      this.onfido.setOptions({ isModalOpen: false });

      this.emit(EOnfidoSDKEvents.COMPLETED);
    } catch (e) {
      this.logger.error("Onfido sdk completing failed", e);

      this.emit(EOnfidoSDKEvents.FAILED);
    }
  };

  private onModalCloseHandler = () => {
    try {
      this.logger.info("Onfido modal close by the user");

      if (!this.onfido) {
        throw new OnfidoSDKError();
      }

      this.onfido.setOptions({ isModalOpen: false });

      this.emit(EOnfidoSDKEvents.DISCARDED);
    } catch (e) {
      this.logger.error("Onfido sdk closing modal failed", e);

      this.emit(EOnfidoSDKEvents.FAILED);
    }
  };

  public async init({ token }: TInitOptions): Promise<void> {
    try {
      this.logger.info("Initializing onfido request");

      // check if onfido sdk was already started
      if (this.onfido) {
        throw new OnfidoSDKInitError();
      }

      // check if we support the browser before starting
      if (!this.isSupported()) {
        throw new OnfidoSDKNotSupportedBrowserError();
      }

      // Onfido sdk is pretty huge so load lazily when truly needed
      const onfidoSDK = await loadOnfidoSdk();

      const steps = getOnfidoSteps(this.logger, this.intlWrapper.intl);

      this.onfido = onfidoSDK.init({
        token,
        steps,
        useModal: true,
        shouldCloseOnOverlayClick: false,
        isModalOpen: true,
        onModalRequestClose: this.onModalCloseHandler,
        onComplete: this.onCompleteHandler,
      });

      this.logger.info("Onfido SDK initialized");
    } catch (e) {
      this.logger.error("Failed to initialize Onfido SDK", e);

      throw new OnfidoSDKInitError();
    }
  }

  public tearDown(): void {
    try {
      this.logger.info("Removing Onfido SDK");

      if (!this.onfido) {
        this.logger.warn(
          "Onfido SDK was not initialized or was already cleaned up. Please check for a duplicated `tearDown` function call",
          new OnfidoSDKTearDownWithoutInitError(),
        );

        return;
      }

      this.onfido.tearDown();

      this.logger.info("Onfido SDK Removed");
    } catch (e) {
      this.logger.error("Failed to tear down Onfido SDK", e);

      throw new OnfidoSDKTearDownError();
    } finally {
      // reset onfido to undefined even if it failed to tear down properly
      this.onfido = undefined;
    }
  }

  /**
   * Check if Onfido is supported by the browser.
   * Browsers that don't have yet `MediaRecorder` API are not supported
   */
  public isSupported(): boolean {
    return !!(window as any).MediaRecorder;
  }
}
