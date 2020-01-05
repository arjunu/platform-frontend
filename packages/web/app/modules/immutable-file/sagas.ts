import { put } from "redux-saga-test-plan/matchers";
import { call, fork } from "redux-saga/effects";

import { IpfsMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions, TActionFromCreator } from "../actions";
import { neuTakeEvery } from "../sagasUtils";
import { downloadLink } from "./utils";

export function* downloadFile(
  { apiImmutableStorage, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.immutableStorage.downloadImmutableFile>,
): Generator<any, any, any> {
  try {
    const immutableFileId = action.payload.immutableFileId;
    const downloadedFile = yield apiImmutableStorage.getFile(immutableFileId);
    const extension = immutableFileId.asPdf ? ".pdf" : ".doc";

    yield call(downloadLink, downloadedFile, action.payload.fileName, extension);
  } catch (e) {
    logger.error("Failed to download file from IPFS", e);
    notificationCenter.error(createMessage(IpfsMessage.IPFS_FAILED_TO_DOWNLOAD_IPFS_FILE)); //Failed to download file from IPFS
  } finally {
    yield put(
      actions.immutableStorage.downloadImmutableFileDone(action.payload.immutableFileId.ipfsHash),
    );
  }
}

export function* immutableFileSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.immutableStorage.downloadImmutableFile, downloadFile);
}
