import { minutesToMs, secondsToMs } from "../../utils/DateUtils";

export const AUTH_TOKEN_REFRESH_THRESHOLD = minutesToMs(1);
export const AUTH_JWT_TIMING_THRESHOLD = secondsToMs(10);

export const AUTH_INACTIVITY_THRESHOLD =
  process.env.NF_CYPRESS_RUN === "1" ? minutesToMs(5) : minutesToMs(10);
export const INACTIVITY_THROTTLE_THRESHOLD = secondsToMs(5);
