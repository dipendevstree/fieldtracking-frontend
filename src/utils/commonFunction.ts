export function jsonToFormData(
  json: Record<string, any>,
  prefix: string = ""
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
      value instanceof Date ? value.toISOString() : String(value)
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
  lng: number
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
      }
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
