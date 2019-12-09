import { put } from "@neufund/sagas";

import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";

export function* detectUserAgent({ detectBrowser }: TGlobalDependencies): any {
  const userAgentInfo = detectBrowser();
  yield put(actions.userAgent.loadUserAgentInfo(userAgentInfo.name, userAgentInfo.version));
}
