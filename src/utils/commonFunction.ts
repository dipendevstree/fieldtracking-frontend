import { format } from "date-fns";

export function jsonToFormData(
  json: Record<string, any>,
  prefix: string = "",
): FormData {
  const formData = new FormData();

  function appendFormData(key: string, value: any, currentPrefix: string) {
    const formKey = currentPrefix ? `${currentPrefix}.${key}` : key;

    if (value === null || value === undefined) {
      formData.append(formKey, "");
      return;
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(formKey, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        appendFormData(`${key}[${index}]`, item, currentPrefix);
      });
      return;
    }

    if (typeof value === "object" && !(value instanceof Date)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        appendFormData(nestedKey, nestedValue, formKey);
      });
      return;
    }

    formData.append(
      formKey,
      value instanceof Date ? value.toISOString() : String(value),
    );
  }

  Object.entries(json).forEach(([key, value]) => {
    appendFormData(key, value, prefix);
  });

  return formData;
}

/**
 * Reverse geocodes latitude and longitude into a full formatted address string.
 *
 * @param lat - Latitude coordinate
 * @param lng - Longitude coordinate
 * @returns A Promise that resolves to the formatted address or null if not found
 */
export const getFormattedAddress = (
  lat: number,
  lng: number,
): Promise<string | null> => {
  return new Promise((resolve) => {
    new google.maps.Geocoder().geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === "OK" && results?.length) {
          resolve(results[0].formatted_address);
        } else {
          resolve(null);
        }
      },
    );
  });
};

/**
 * Formats a string by:
 * - Removing special characters (e.g., _, -, @, #)
 * - Replacing them with spaces
 * - Capitalizing the first letter of each word
 * - Converting the rest of the characters to lowercase
 *
 * Example:
 *   "TRAVEL_ALLOWANCE" → "Travel Allowance"
 *   "daily-expense"    → "Daily Expense"
 *
 * @param input - The string to be formatted (usually from enum keys)
 * @returns A human-readable, title-cased string
 */
export function formatDropDownLabel(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Returns user initials based on first and last name.
 *
 * Examples:
 * - "John", "Doe" => "JD"
 * - "Alice", undefined => "A"
 *
 * @param firstName - The user's first name
 * @param lastName - The user's last name
 * @returns Uppercase initials as a string
 */
export function getUserInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.trim()?.[0] || "";
  const last = lastName?.trim()?.[0] || "";

  return (first + last).toUpperCase();
}

/**
 * Returns the full name of the user.
 * If both first and last names are provided, they are joined with a space.
 * If only one is provided, it returns just that one.
 *
 * Example:
 * - "John", "Doe" => "John Doe"
 * - "Alice", undefined => "Alice"
 *
 * @param firstName The user's first name
 * @param lastName The user's last name
 * @returns The full name as a single string
 */
export function getFullName(firstName?: string, lastName?: string): string {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

/**
 * Formats a date range into a human-readable string.
 *
 * - If only the start date is provided, returns the formatted start date.
 * - If both dates are the same, returns the single date.
 * - If both dates differ, returns a formatted range: "dd-MM-yyyy - dd-MM-yyyy".
 * - If no start date is provided, returns "-".
 *
 * @param {string | undefined} startDate - The start date in ISO string format.
 * @param {string | undefined} endDate - The end date in ISO string format.
 * @returns {string} A formatted date or date range string.
 */
export function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate) return "-";

  const formattedStart = format(new Date(startDate), "dd-MM-yyyy");

  if (!endDate || startDate === endDate) {
    return formattedStart;
  }

  const formattedEnd = format(new Date(endDate), "dd-MM-yyyy");
  return `${formattedStart} To ${formattedEnd}`;
}

export function formatName(value: string): string {
  if (!value) return "";

  return (
    value
      // convert camelCase → words
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // collapse multiple spaces
      .replace(/\s+/g, " ")
      .trim()
      // capitalize each word
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
}

/**
 * Check if a given file URL is an image
 */
export const isImage = (file: string) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const ext = file.split(".").pop()?.toLowerCase();
  return imageExtensions.includes(ext ?? "");
};

/**
 * Convert a file size in bytes into a human-readable string (starting from KB, with decimals).
 *
 * Sizes are accurately converted — e.g. 500 bytes → "0.49 KB".
 *
 * @param {number} bytes - The size in bytes to format.
 * @param {number} [decimals=2] - Number of decimal places to include.
 * @returns {string} The formatted file size string with an appropriate unit.
 *
 * @example
 * formatFileSize(500);          // "0.49 KB"
 * formatFileSize(2048);         // "2.00 KB"
 * formatFileSize(1048576);      // "1.00 MB"
 * formatFileSize(3145728000);   // "2.93 GB"
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (!bytes || bytes <= 0) return "-";

  const units = ["KB", "MB", "GB", "TB"];
  let size = bytes / 1024; // Start from KB
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(decimals)} ${units[index]}`;
}

/**
 * Convert decimal work hours into HH:mm format.
 *
 * @param {number | string | undefined} hours - Total worked hours in decimal format.
 * Example:
 *  - 2.5   => "02:30"
 *  - 3.19  => "03:11"
 *  - "1.75" => "01:45"
 *
 * @returns {string} Formatted time string in "HH:mm".
 *
 * @description
 * This utility is intended for **duration formatting** (worked hours),
 * NOT real calendar dates. It avoids timezone issues and is safe for
 * attendance, reports, and data tables.
 */
export const formatWorkHours = (hours?: number | string): string => {
  const value = Number(hours);

  // Return default if empty, null, NaN, or 0
  if (!value) return "00:00";

  const totalMinutes = Math.round(value * 60);
  const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const mm = String(totalMinutes % 60).padStart(2, "0");

  return `${hh}:${mm}`;
};
