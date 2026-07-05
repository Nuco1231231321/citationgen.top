import type { DateParts } from "./types";

export function dateFromParts(parts?: unknown): DateParts | undefined {
  if (!Array.isArray(parts) || !Array.isArray(parts[0])) return undefined;
  const [year, month, day] = parts[0] as Array<number | undefined>;
  if (!year) return undefined;
  return {
    year,
    month,
    day
  };
}

export function dateFromString(value?: string | null): DateParts | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    const year = trimmed.match(/\b(18|19|20)\d{2}\b/)?.[0];
    return year ? { year: Number(year) } : undefined;
  }
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate()
  };
}

export function todayDateParts(): DateParts {
  const now = new Date();
  return {
    year: now.getUTCFullYear(),
    month: now.getUTCMonth() + 1,
    day: now.getUTCDate()
  };
}

export function compactDateParts(date?: DateParts) {
  if (!date?.year) return "";
  return [date.year, date.month, date.day].filter(Boolean).join("-");
}
