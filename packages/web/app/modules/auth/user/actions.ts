import { createActionFactory } from "@neufund/shared";

import { IUser } from "../../../lib/api/users/interfaces";
import { ELogoutReason } from "../types";

type TLogoutActionOptions = {
  logoutType?: ELogoutReason;
};

export const authUserActions = {
  setUser: createActionFactory("AUTH_SET_USER", (user: IUser) => ({ user })),
  finishSigning: createActionFactory("AUTH_FINISH_SIGNING"),
  logout: createActionFactory("AUTH_LOGOUT", (options: TLogoutActionOptions = {}) => options),
  userActive: createActionFactory("AUTH_USER_ACTIVE"),
  userActivityTimeout: createActionFactory("AUTH_USER_TIMEOUT"),
  refreshTimer: createActionFactory("AUTH_REFRESH_TIMER"),
  reset: createActionFactory("AUTH_RESET"),
};
