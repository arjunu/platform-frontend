import { delay, put, select, takeLatest } from "redux-saga/effects";

import { Q18 } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";
import { numericValuesToString } from "../../contracts/utils";
import { selectIsSmartContractInitDone } from "../../init/selectors";
import { neuCall } from "../../sagasUtils";
import { ITokenPriceStateData } from "./reducer";

const TOKEN_PRICE_MONITOR_DELAY = 120000;
const TOKEN_PRICE_MONITOR_SHORT_DELAY = 1000;

export async function loadTokenPriceDataAsync({
  contractsService,
}: TGlobalDependencies): Promise<ITokenPriceStateData> {
  return contractsService.rateOracle
    .getExchangeRates(
      [
        contractsService.etherToken.address,
        contractsService.neumark.address,
        contractsService.euroToken.address,
      ],
      [
        contractsService.euroToken.address,
        contractsService.euroToken.address,
        contractsService.etherToken.address,
      ],
    )
    .then(r =>
      Object.assign(
        numericValuesToString({
          etherPriceEur: r[0][0].div(Q18),
          neuPriceEur: r[0][1].div(Q18),
          eurPriceEther: r[0][2].div(Q18),
        }),
        { priceOutdated: false },
      ),
    );
}

function* tokenPriceMonitor({ logger }: TGlobalDependencies): any {
  const isSmartContractInitDone: boolean = yield select(selectIsSmartContractInitDone);

  if (!isSmartContractInitDone) return;

  while (true) {
    try {
      logger.info("Querying for tokenPrice");
      const tokenPriceData = yield neuCall(loadTokenPriceDataAsync);
      yield put(actions.tokenPrice.saveTokenPrice(tokenPriceData));
    } catch (e) {
      logger.error("Token Price Oracle Failed", e);
      yield delay(TOKEN_PRICE_MONITOR_SHORT_DELAY);
      continue;
    }
    yield delay(TOKEN_PRICE_MONITOR_DELAY);
  }
}

export function* tokenPriceSagas(): any {
  yield takeLatest(actions.init.done, neuCall, tokenPriceMonitor);
}
