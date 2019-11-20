import { all, call, Effect, fork, getContext } from "redux-saga/effects";

import { TGlobalDependencies } from "../di/setupBindings";
import { actions } from "./actions";
import { authSagas } from "./auth/sagas";
import { bankTransferFlowSaga } from "./bank-transfer-flow/sagas";
import { bookBuildingFlowSagas } from "./bookbuilding-flow/sagas";
import { etoDocumentsSagas } from "./eto-documents/sagas";
import { etoFlowSagas } from "./eto-flow/sagas";
import { etoNomineeSagas } from "./eto-nominee/sagas";
import { etoSagas } from "./eto/sagas";
import { gasApiSagas } from "./gas/sagas";
import { icbmWalletGetDataSagas } from "./icbm-wallet-balance-modal/sagas";
import { immutableFileSagas } from "./immutable-file/sagas";
import { initSagas } from "./init/sagas";
import { investmentFlowSagas } from "./investment-flow/sagas";
import { investorTicketsSagas } from "./investor-portfolio/sagas";
import { kycSagas } from "./kyc/sagas";
import { marketingEmailsSagas } from "./marketing-emails/sagas";
import { nomineeFlowSagas } from "./nominee-flow/sagas";
import { notificationModalSagas } from "./notification-modal/sagas";
import { profileSagas } from "./profile/sagas";
import { routingSagas } from "./routing/sagas";
import { neuRestartIf } from "./sagasUtils";
import { formSingleFileUploadSagas } from "./shared/formSingleFileUpload/sagas";
import { remoteFileSagas } from "./shared/remoteFile/sagas";
import { tokenPriceSagas } from "./shared/tokenPrice/sagas";
import { termsOfServiceSagas } from "./terms-of-service-modal/sagas";
import { txHistorySaga } from "./tx-history/sagas";
import { txMonitorSagas } from "./tx/monitor/sagas";
import { txSenderSagasWatcher } from "./tx/sender/sagas";
import { txTransactionsSagasWatcher } from "./tx/transactions/sagas";
import { txUserFlowSagasWatcher } from "./tx/user-flow/sagas";
import { txValidatorSagasWatcher } from "./tx/validator/sagas";
import { browserWalletSagas } from "./wallet-selector/browser-wizard/sagas";
import { ledgerSagas } from "./wallet-selector/ledger-wizard/sagas";
import { lightWalletSagas } from "./wallet-selector/light-wizard/sagas";
import { walletSelectorSagas } from "./wallet-selector/sagas";
import { walletSagas } from "./wallet/sagas";
import { web3Sagas } from "./web3/sagas";

/**
 * Restart all sagas on error and report error to sentry
 */
function* allSagas(): Iterator<Effect> {
  yield all([
    // Sagas that should keep running even after logout
    fork(initSagas),
    fork(authSagas),
    fork(walletSelectorSagas),
    fork(lightWalletSagas),
    fork(browserWalletSagas),
    fork(ledgerSagas),
    fork(routingSagas),
    fork(tokenPriceSagas),
    fork(notificationModalSagas),
    fork(marketingEmailsSagas),
    // Sagas that should be restarted immediately when logout occurs
    fork(neuRestartIf, actions.auth.logout, termsOfServiceSagas),
    fork(neuRestartIf, actions.auth.logout, bankTransferFlowSaga),
    fork(neuRestartIf, actions.auth.logout, txSenderSagasWatcher),
    fork(neuRestartIf, actions.auth.logout, txUserFlowSagasWatcher),
    fork(neuRestartIf, actions.auth.logout, kycSagas),
    fork(neuRestartIf, actions.auth.logout, investorTicketsSagas),
    fork(neuRestartIf, actions.auth.logout, profileSagas),
    fork(neuRestartIf, actions.auth.logout, web3Sagas),
    fork(neuRestartIf, actions.auth.logout, walletSagas),
    fork(neuRestartIf, actions.auth.logout, icbmWalletGetDataSagas),
    fork(neuRestartIf, actions.auth.logout, etoFlowSagas),
    fork(neuRestartIf, actions.auth.logout, immutableFileSagas),
    fork(neuRestartIf, actions.auth.logout, etoSagas),
    fork(neuRestartIf, actions.auth.logout, etoNomineeSagas),
    fork(neuRestartIf, actions.auth.logout, bookBuildingFlowSagas),
    fork(neuRestartIf, actions.auth.logout, formSingleFileUploadSagas),
    fork(neuRestartIf, actions.auth.logout, remoteFileSagas),
    fork(neuRestartIf, actions.auth.logout, txValidatorSagasWatcher),
    fork(neuRestartIf, actions.auth.logout, txTransactionsSagasWatcher),
    fork(neuRestartIf, actions.auth.logout, gasApiSagas),
    fork(neuRestartIf, actions.auth.logout, etoDocumentsSagas),
    fork(neuRestartIf, actions.auth.logout, txMonitorSagas),
    fork(neuRestartIf, actions.auth.logout, investmentFlowSagas),
    fork(neuRestartIf, actions.auth.logout, txHistorySaga),
    fork(neuRestartIf, actions.auth.logout, nomineeFlowSagas),
  ]);
}

function* handleRootError(error: Error): Iterator<Effect> {
  const { logger }: TGlobalDependencies = yield getContext("deps");

  logger.error(error);
}

export function* rootSaga(): Iterator<Effect> {
  while (true) {
    try {
      yield call(allSagas);
    } catch (e) {
      yield call(handleRootError, e);
    }
  }
}
