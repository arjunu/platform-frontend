import { TLogLevels } from "./ILogger";

export const isLevelAllowed = (loglevel: TLogLevels) => {
  if (!process.env.NF_LOG_LEVEL) {
    return true;
  }

  const priority: TLogLevels[] = ["fatal", "error", "warn", "debug", "verbose", "info"];

  const allowedLogLevel = process.env.NF_LOG_LEVEL as TLogLevels;

  const allowedLogLevelIndex = priority.indexOf(allowedLogLevel);
  const currentLogLevelIndex = priority.indexOf(loglevel);

  return currentLogLevelIndex <= allowedLogLevelIndex;
};

const hashQueryParam = (name: string, url: string) =>
  url.replace(new RegExp(`(${name})(=|%3D).+?(&|#|%26)`), "$1$2******$3");

export const hashBlacklistedQueryParams = (blackListedParams: string[], url: string) =>
  blackListedParams.reduce((prevUrl, param) => hashQueryParam(param, prevUrl), url);
