import { createActionFactory } from "@neufund/shared";

import { IUser } from "../../lib/api/users/interfaces";
import { ELogoutReason } from "./types";

type TLogoutActionOptions = {
  logoutType?: ELogoutReason;
};

export const authActions = {
  loadJWT: createActionFactory("AUTH_LOAD_JWT", (jwt: string) => ({ jwt })),
  setUser: createActionFactory("AUTH_SET_USER", (user: IUser) => ({ user })),
  logout: createActionFactory("AUTH_LOGOUT", (options: TLogoutActionOptions = {}) => options),
  verifyEmail: createActionFactory("AUTH_VERIFY_EMAIL"),
  reset: createActionFactory("AUTH_RESET"),
};
