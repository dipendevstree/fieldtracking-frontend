/**
 * Status Configuration
 *
 * Maps normalised status keys → theme + optional display label.
 * To add a new status: add an entry below with { theme, label? }.
 */

import {
  BADGE_THEMES,
  BADGE_FALLBACK_THEME,
  type BadgeThemeColors,
  type BadgeThemeName,
} from "@/theme/badge-themes";

interface StatusEntry {
  theme: BadgeThemeName;
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
  expired: { theme: "red", label: "Expired" },
  suspended: { theme: "red", label: "Suspended" },

  // 🟡 Yellow — Partial / Caution
  partially_approved: { theme: "yellow" },
  work_from_home: { theme: "yellow" },
  late: { theme: "yellowDark" },
  medium: { theme: "yellowDark" },
  grace_period: { theme: "yellowDark", label: "Grace Period" },

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
  trial: { theme: "green", label: "Trial" },

  // 🔵 Blue — Informational
  national: { theme: "blue" },
  "half day": { theme: "blue", label: "Half Day" },
  half_day: { theme: "blue", label: "Half Day" },
  upcoming: { theme: "blue" },
  register_via_app: { theme: "blue", label: "Register via App" },

  // 🟣 Purple — Special / Event
  festival: { theme: "purple" },
  regional: { theme: "purple" },
  "in-progress": { theme: "purple", label: "In-progress" },
  created_via_super_admin: {
    theme: "purple",
    label: "Created via Super Admin",
  },

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

/** Pre-computed flat map: status key → BadgeThemeColors (for direct usage outside StatusBadge). */
export const statusColors: Record<string, BadgeThemeColors> =
  Object.fromEntries(
    Object.entries(statusConfig).map(([key, entry]) => [
      key,
      BADGE_THEMES[entry.theme] ?? BADGE_FALLBACK_THEME,
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

/** Resolve BadgeThemeColors for a normalised status. Falls back to gray. */
export const resolveTheme = (normalized: string): BadgeThemeColors =>
  BADGE_THEMES[statusConfig[normalized]?.theme] ?? BADGE_FALLBACK_THEME;

/** Resolve label override. Returns undefined if no override exists. */
export const resolveLabel = (normalized: string): string | undefined =>
  statusConfig[normalized]?.label;
