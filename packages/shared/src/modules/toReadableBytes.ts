const UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

/**
 * Converts a long string of bytes into a readable format e.g KB, MB, GB, TB, PB
 */
export const toReadableBytes = (bytes: number) => {
  if (bytes < 0) {
    throw new Error("Negative values are not allowed");
  }

  if (bytes < 1) {
    return `0 ${UNITS[0]}`;
  }

  const exponent = Math.floor(Math.log(bytes) / Math.log(1000));
  const allowedExponent = Math.min(exponent, UNITS.length - 1);

  return (bytes / Math.pow(1000, exponent)).toFixed(2) + " " + UNITS[allowedExponent];
};
