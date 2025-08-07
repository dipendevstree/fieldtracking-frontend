export function formatExpenseType(type: string): string {
  const map: Record<string, string> = {
    travel: "Travel Allowance",
    daily: "Daily Allowance",
  };

  return map[type.toLowerCase()] || type;
}

export function formatExpenseSubType(type: string): string {
  const map: Record<string, string> = {
    travel_lump_sum: "Lump Sum Entry",
    travel_route: "Route-wise Details",
    daily_local: "Local",
    daily_outstation: "Outstation",
  };

  return map[type.toLowerCase()] || "Unknown";
}
