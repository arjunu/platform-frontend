import { toPairs, zip } from "lodash";
import { fork, put, select } from "redux-saga/effects";

import { tripleZip } from "../../../../typings/modifications";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { LedgerNotAvailableError } from "../../../lib/web3/ledger-wallet/errors";
import { IAppState } from "../../../store";
import { actions, TAction, TActionFromCreator } from "../../actions";
import { neuTakeEvery, neuTakeLatestUntil } from "../../sagasUtils";
import { mapLedgerErrorToErrorMessage } from "./errors";

export const LEDGER_WIZARD_SIMPLE_DERIVATION_PATHS = ["44'/60'/0'/0", "44'/60'/0'/0/0"]; // TODO this should be taken from config

export function* tryEstablishingConnectionWithLedger({
  ledgerWalletConnector,
}: TGlobalDependencies): IterableIterator<any> {
  try {
    yield ledgerWalletConnector.connect();

    yield put(actions.walletSelector.ledgerConnectionEstablished());
  } catch (e) {
    yield put(
      actions.walletSelector.ledgerConnectionEstablishedError(mapLedgerErrorToErrorMessage(e)),
    );
  }
}

export function* loadLedgerAccounts({
  ledgerWalletConnector,
  web3Manager,
  contractsService,
}: TGlobalDependencies): IterableIterator<any> {
  const state: IAppState = yield select();
  const {
    advanced,
    index,
    numberOfAccountsPerPage,
    derivationPathPrefix,
  } = state.ledgerWizardState;

  try {
    const derivationPathToAddressMap = advanced
      ? yield ledgerWalletConnector.getMultipleAccountsFromDerivationPrefix(
          derivationPathPrefix,
          index,
          numberOfAccountsPerPage,
        )
      : yield ledgerWalletConnector.getMultipleAccounts(LEDGER_WIZARD_SIMPLE_DERIVATION_PATHS);

    const derivationPathsArray = toPairs<string>(derivationPathToAddressMap).map(pair => ({
      derivationPath: pair[0],
      address: pair[1],
    }));

    const balancesETH: string[] = yield Promise.all(
      derivationPathsArray.map(dp =>
        web3Manager.internalWeb3Adapter.getBalance(dp.address).then(bn => bn.toString()),
      ),
    );

    const balancesNEU: string[] = yield Promise.all(
      derivationPathsArray.map(dp =>
        contractsService.neumark.balanceOf(dp.address).then(bn => bn.toString()),
      ),
    );

    const accounts = (zip as tripleZip)(derivationPathsArray, balancesETH, balancesNEU).map(
      ([dp, balanceETH, balanceNEU]) => ({
        ...dp,
        balanceETH: balanceETH,
        balanceNEU: balanceNEU,
      }),
    );
    yield put(actions.walletSelector.setLedgerAccounts(accounts, derivationPathPrefix));
  } catch (e) {
    yield put(
      actions.walletSelector.ledgerConnectionEstablishedError(mapLedgerErrorToErrorMessage(e)),
    );
  }
}

export function* setDerivationPathPrefix(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "LEDGER_SET_DERIVATION_PATH_PREFIX") return;
  const state: IAppState = yield select();
  const currDp = state.ledgerWizardState.derivationPathPrefix;
  const { derivationPathPrefix } = action.payload;

  if (currDp !== derivationPathPrefix) {
    yield put(actions.walletSelector.setLedgerWizardDerivationPathPrefix(derivationPathPrefix));
    yield put(actions.walletSelector.ledgerLoadAccounts());
  }
}

export function* goToNextPageAndLoadData(): any {
  yield put(actions.walletSelector.ledgerWizardAccountsListNextPage());
  yield put(actions.walletSelector.ledgerLoadAccounts());
}

export function* goToPreviousPageAndLoadData(): any {
  yield put(actions.walletSelector.ledgerWizardAccountsListPreviousPage());
  yield put(actions.walletSelector.ledgerLoadAccounts());
}

export function* finishSettingUpLedgerConnector(
  { ledgerWalletConnector, web3Manager }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.walletSelector.ledgerFinishSettingUpLedgerConnector>,
): IterableIterator<any> {
  try {
    const ledgerWallet = yield ledgerWalletConnector.finishConnecting(
      action.payload.derivationPath,
      web3Manager.networkId,
    );

    yield web3Manager.plugPersonalWallet(ledgerWallet);

    yield put(actions.walletSelector.connected());
  } catch (e) {
    yield put(
      actions.walletSelector.ledgerConnectionEstablishedError(
        mapLedgerErrorToErrorMessage(new LedgerNotAvailableError()),
      ),
    );
  }
}

export function* ledgerSagas(): Iterator<any> {
  yield fork(
    neuTakeLatestUntil,
    "LEDGER_TRY_ESTABLISHING_CONNECTION",
    actions.walletSelector.reset,
    tryEstablishingConnectionWithLedger,
  );
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.ledgerLoadAccounts,
    actions.walletSelector.reset,
    loadLedgerAccounts,
  );
  yield fork(neuTakeEvery, "LEDGER_SET_DERIVATION_PATH_PREFIX", setDerivationPathPrefix);
  yield fork(neuTakeEvery, "LEDGER_GO_TO_NEXT_PAGE_AND_LOAD_DATA", goToNextPageAndLoadData);
  yield fork(neuTakeEvery, "LEDGER_GO_TO_PREVIOUS_PAGE_AND_LOAD_DATA", goToPreviousPageAndLoadData);
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.ledgerFinishSettingUpLedgerConnector,
    actions.walletSelector.reset,
    finishSettingUpLedgerConnector,
  );
}
