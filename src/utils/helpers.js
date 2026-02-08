/**
 * ============================================================
 *  Utility helpers
 * ============================================================
 */

/** Convert a UNIX timestamp to a short day name (Mon, Tue …) */
export function toDayName(unix) {
  return new Date(unix * 1000).toLocaleDateString("en-US", { weekday: "short" });
}

/** Convert a UNIX timestamp to a readable date string */
export function toDateString(unix) {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Convert a UNIX timestamp to a time string (e.g. 06:42 AM) */
export function toTimeString(unix, timezoneOffset = 0) {
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

/** Map wind degrees to a compass direction */
export function windDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

/** Convert m/s to km/h */
export function msToKmh(ms) {
  return (ms * 3.6).toFixed(1);
}

/** Comfort-score colour (green → yellow → red) */
export function comfortColor(score) {
  if (score >= 70) return "#22c55e";
  if (score >= 45) return "#eab308";
  return "#ef4444";
}
