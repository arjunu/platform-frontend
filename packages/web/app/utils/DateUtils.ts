import { DAY } from "../config/constants";

/**
 *  Formats date to dd-mm-yyyy format
 *
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("de", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function isLessThanNDays(d1: Date, d2: Date, n: number): boolean {
  return d2.getTime() - d1.getTime() < 1000 * DAY * n;
}

export function isLessThanNHours(d1: Date, d2: Date, n: number): boolean {
  return d2.getTime() - d1.getTime() < 1000 * 60 * 60 * n;
}

export function isLessThanNMinutes(d1: Date, d2: Date, n: number): boolean {
  return d2.getTime() - d1.getTime() < 1000 * 60 * n;
}

export function minutesToMs(minutes: number): number {
  return minutes * 6 * 10 * 1000;
}

export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

export const getCurrentUTCTimestamp = (): number => Math.floor(Date.now() / 1000);
