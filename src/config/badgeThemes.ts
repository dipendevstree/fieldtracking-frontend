/**
 * Badge Theme Tokens
 *
 * Reusable color palettes for status badges.
 * To add a new theme: add a key here, then map statuses to it in statusConfig.ts.
 */

/** Tailwind class triplet that styles one badge variant. */
export type ThemeColors = {
  text: string;
  bg: string;
  dot: string;
};

export const THEMES = {
  orange: {
    text: "text-orange-600",
    bg: "bg-orange-100",
    dot: "bg-orange-500",
  },
  yellow: {
    text: "text-yellow-600",
    bg: "bg-yellow-100",
    dot: "bg-yellow-500",
  },
  yellowDark: {
    text: "text-yellow-700",
    bg: "bg-yellow-100",
    dot: "bg-yellow-500",
  },
  amber: { text: "text-amber-700", bg: "bg-amber-100", dot: "bg-amber-600" },
  amberLight: {
    text: "text-amber-600",
    bg: "bg-amber-100",
    dot: "bg-amber-500",
  },
  green: { text: "text-green-600", bg: "bg-green-100", dot: "bg-green-500" },
  emerald: {
    text: "text-emerald-600",
    bg: "bg-emerald-100",
    dot: "bg-emerald-500",
  },
  blue: { text: "text-blue-600", bg: "bg-blue-100", dot: "bg-blue-500" },
  purple: {
    text: "text-purple-600",
    bg: "bg-purple-100",
    dot: "bg-purple-500",
  },
  red: { text: "text-red-600", bg: "bg-red-100", dot: "bg-red-500" },
  gray: { text: "text-gray-600", bg: "bg-gray-100", dot: "bg-gray-500" },
  slate: { text: "text-slate-600", bg: "bg-slate-100", dot: "bg-slate-400" },
} as const satisfies Record<string, ThemeColors>;

export type ThemeName = keyof typeof THEMES;

/** Fallback when a status has no matching config entry. */
export const FALLBACK_THEME: ThemeColors = THEMES.gray;
