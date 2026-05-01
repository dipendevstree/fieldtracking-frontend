import { addMinutes, format, isValid, parse } from "date-fns";

/**
 * Calculates threshold expiry time from shift end time + threshold minutes.
 *
 * Accepted endTime formats:
 * - "HH:mm"
 * - "HH:mm:ss"
 *
 * If thresholdMinutes is missing, default shift threshold is used.
 * Returns "-" when values are invalid.
 */
export const getShiftThresholdExpiryTime = (
  endTime?: string | null,
  thresholdMinutes?: number | null,
): string => {
  if (!endTime) return "-";

  const threshold = Number(thresholdMinutes ?? 0);
  if (!threshold || threshold <= 0) {
    return "-";
  }

  const parsedWithSeconds = parse(endTime, "HH:mm:ss", new Date());
  const parsedWithoutSeconds = parse(endTime, "HH:mm", new Date());
  const parsedEndTime = isValid(parsedWithSeconds)
    ? parsedWithSeconds
    : parsedWithoutSeconds;
  if (!isValid(parsedEndTime)) return "-";

  return format(addMinutes(parsedEndTime, threshold), "hh:mm a");
};
