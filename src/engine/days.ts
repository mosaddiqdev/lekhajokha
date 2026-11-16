// Dates are plain YYYY-MM-DD strings in the shop's own day, never UTC.

// Local date, not UTC: an entry made at 1am in India is still that day's.
export function today(): string {
  return new Date().toLocaleDateString("en-CA");
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// "today", "yesterday", "16 Nov", or "16 Nov 2025" for another year.
export function describeDay(date: string, now: string): string {
  const days = dayNumber(now) - dayNumber(date);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";

  const [year = "", month = "", day = ""] = date.split("-");
  const label = `${Number(day)} ${MONTHS[Number(month) - 1]}`;
  return year === now.slice(0, 4) ? label : `${label} ${year}`;
}

// Whole days since 1970, so two dates subtract cleanly across month ends.
function dayNumber(date: string): number {
  const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}
