/**
 * Status Configuration
 *
 * Maps normalised status keys → theme + optional display label.
 * To add a new status: add an entry below with { theme, label? }.
 */

import {
  THEMES,
  FALLBACK_THEME,
  type ThemeColors,
  type ThemeName,
} from "./badgeThemes";

interface StatusEntry {
  theme: ThemeName;
  label?: string;
}

export const statusConfig: Record<string, StatusEntry> = {
  // 🟠 Orange — Waiting / In-progress
  pending: { theme: "orange", label: "Pending" },
  in_progress: { theme: "orange" },
  processing: { theme: "orange" },
  weekend: { theme: "orange" },
  leave: { theme: "orange" },
  partial_completed: { theme: "orange", label: "Partial Completed" },

  // 🟡 Yellow — Partial / Caution
  partially_approved: { theme: "yellow" },
  work_from_home: { theme: "yellow" },
  late: { theme: "yellowDark" },
  medium: { theme: "yellowDark" },

  // 🟢 Green — Success / Positive
  approved: { theme: "green" },
  complete: { theme: "green" },
  completed: { theme: "green", label: "Completed" },
  success: { theme: "green" },
  verified: { theme: "green" },
  active: { theme: "green" },
  present: { theme: "green" },
  over: { theme: "green" },
  normal: { theme: "green" },
  credit: { theme: "green" },
  confirmed: { theme: "green", label: "Confirmed" },
  low: { theme: "green" },

  // 🔵 Blue — Informational
  national: { theme: "blue" },
  "half day": { theme: "blue", label: "Half Day" },
  half_day: { theme: "blue", label: "Half Day" },

  // 🟣 Purple — Special / Event
  festival: { theme: "purple" },
  regional: { theme: "purple" },
  "in-progress": { theme: "purple", label: "In-progress" },

  // 🔴 Red — Rejected / Negative
  rejected: { theme: "red" },
  reject: { theme: "red" },
  failure: { theme: "red" },
  cancel: { theme: "red" },
  absent: { theme: "red" },
  under: { theme: "red" },
  debit: { theme: "red" },
  cancelled: { theme: "red", label: "Cancelled" },
  high: { theme: "red" },

  // ⚪ Gray — Inactive / Neutral
  inactive: { theme: "gray" },
  first_half: { theme: "gray", label: "First Half" },
  second_half: { theme: "gray", label: "Second Half" },

  // 🟩 Emerald / 🟠 Amber — Misc
  optional: { theme: "emerald" },
  "early exit": { theme: "amber", label: "Early Exit" },
  early_exit: { theme: "amber", label: "Early Exit" },
  checkin: { theme: "amberLight", label: "Check In" },

  // 🔘 Slate — Off-duty / Holiday
  "week off / holiday": { theme: "slate", label: "Week Off / Holiday" },
  week_off: { theme: "slate", label: "Week Off" },
  holiday: { theme: "slate" },
  checkout: { theme: "slate", label: "Check Out" },
};

/** Pre-computed flat map: status key → ThemeColors (for direct usage outside StatusBadge). */
export const statusColors: Record<string, ThemeColors> = Object.fromEntries(
  Object.entries(statusConfig).map(([key, entry]) => [
    key,
    THEMES[entry.theme] ?? FALLBACK_THEME,
  ]),
);

/** Values treated as invalid — renders a neutral "-" badge. */
const INVALID_VALUES = new Set([
  "-",
  "--",
  "---",
  "n/a",
  "na",
  "null",
  "undefined",
  "none",
]);

/** Returns true if the value is empty, nullish, or a placeholder. */
export const isInvalidOrPlaceholder = (val?: string | null): boolean => {
  if (!val) return true;
  return INVALID_VALUES.has(val.trim().toLowerCase());
};

/** Resolve ThemeColors for a normalised status. Falls back to gray. */
export const resolveTheme = (normalized: string): ThemeColors =>
  THEMES[statusConfig[normalized]?.theme] ?? FALLBACK_THEME;

/** Resolve label override. Returns undefined if no override exists. */
export const resolveLabel = (normalized: string): string | undefined =>
  statusConfig[normalized]?.label;
