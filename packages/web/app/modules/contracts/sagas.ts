import { all, put } from "@neufund/sagas";

import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";
import { IPlatformTermsConstants } from "./reducer";

export async function initializeContracts({
  contractsService,
}: TGlobalDependencies): Promise<void> {
  await contractsService.init();
}

export function* populatePlatformTermsConstants({ contractsService }: TGlobalDependencies): any {
  const contract = contractsService.platformTerms;

  // These are constants from Universe contract no need for polling
  const terms: IPlatformTermsConstants = yield all({
    IS_ICBM_INVESTOR_WHITELISTED: contract.IS_ICBM_INVESTOR_WHITELISTED,
    PLATFORM_NEUMARK_SHARE: contract.PLATFORM_NEUMARK_SHARE,
    TOKEN_PARTICIPATION_FEE_FRACTION: contract.TOKEN_PARTICIPATION_FEE_FRACTION,
    PLATFORM_FEE_FRACTION: contract.PLATFORM_FEE_FRACTION,
    TOKEN_RATE_EXPIRES_AFTER: contract.TOKEN_RATE_EXPIRES_AFTER,
  });

  yield put(actions.contracts.setPlatformTermConstants(terms));
}
