import { END, eventChannel, fork, put, take } from "@neufund/sagas";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { TKycOnfidoUploadRequest } from "../../../../lib/api/kyc/KycApi.interfaces";
import { EOnfidoSDKEvents } from "../../../../lib/dependencies/onfido/OnfidoSDK";
import { actions } from "../../../actions";
import { neuCall, neuTakeUntil } from "../../../sagasUtils";
import { loadClientData } from "../../sagas";

type TChannelTypes = {
  type: EOnfidoSDKEvents;
};

function* initOnfidoSdk({
  onfidoSDK,
  apiKycService,
}: TGlobalDependencies): Generator<any, any, any> {
  try {
    yield put(actions.fullPageLoading.showFullPageLoading());

    const uploadRequest: TKycOnfidoUploadRequest = yield apiKycService.putOnfidoUploadRequest();

    // Update kyc status after starting onfido request
    yield neuCall(loadClientData);

    yield onfidoSDK.init({
      token: uploadRequest.webtoken,
    });
  } catch (e) {
    onfidoSDK.tearDown();

    // it's important to rethrow here so we can catch and react inside onfido start saga
    throw e;
  } finally {
    yield put(actions.fullPageLoading.hideFullPageLoading());
  }
}

function* checkOnfidoRequest({ apiKycService }: TGlobalDependencies): Generator<any, any, any> {
  try {
    yield put(actions.fullPageLoading.showFullPageLoading());

    yield apiKycService.putOnfidoCheckRequest();

    // Update kyc status after successful check request
    yield neuCall(loadClientData);
  } finally {
    yield put(actions.fullPageLoading.hideFullPageLoading());
  }
}

function* handleOnfidoSdkEvents({ onfidoSDK }: TGlobalDependencies): Generator<any, any, any> {
  const channel = eventChannel<TChannelTypes>(emit => {
    onfidoSDK.on(EOnfidoSDKEvents.DISCARDED, () => {
      emit({ type: EOnfidoSDKEvents.DISCARDED });
    });

    onfidoSDK.on(EOnfidoSDKEvents.COMPLETED, () => {
      emit({ type: EOnfidoSDKEvents.COMPLETED });
    });

    onfidoSDK.on(EOnfidoSDKEvents.FAILED, () => {
      emit({ type: EOnfidoSDKEvents.FAILED });
    });

    return () => {
      onfidoSDK.removeAllListeners();
    };
  });

  try {
    while (true) {
      const event: TChannelTypes | END = yield take(channel);

      switch (event.type) {
        case EOnfidoSDKEvents.DISCARDED:
          // in case onfido flow was discarded by the user just clean up
          return;
        case EOnfidoSDKEvents.COMPLETED:
          yield neuCall(checkOnfidoRequest);
          return;
        case EOnfidoSDKEvents.FAILED:
          throw new Error("Failed to process onfido event");
      }
    }
  } finally {
    channel.close();

    // clean up Onfido sdk
    onfidoSDK.tearDown();
  }
}

function* startOnfidoRequest({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    yield neuCall(initOnfidoSdk);

    yield neuCall(handleOnfidoSdkEvents);
  } catch (e) {
    logger.error("Failed to start onfido request", e);

    yield put(actions.kyc.startOnfidoRequestError(e));
  }
}

export function* kycOnfidoSagas(): Generator<any, any, any> {
  yield fork(
    neuTakeUntil,
    actions.kyc.startOnfidoRequest,
    actions.kyc.stopOnfidoRequest,
    startOnfidoRequest,
  );
}
