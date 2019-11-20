import { createActionFactory } from "@neufund/shared";

export const jwtActions = {
  setJWT: createActionFactory("AUTH_SET_JWT", (jwt: string) => ({ jwt })),
  jwtTimeout: createActionFactory("AUTH_JWT_TIMEOUT"),
};
