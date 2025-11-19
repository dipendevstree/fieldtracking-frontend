import { useLocation } from "@tanstack/react-router";

const MODULE_NAME_MAP: Record<string, string> = {
  customers: "Customer Management",
  livetracking: "Live Tracking",
  roles: "Roles Management",
  calendar: "Calendar & Visit Management",
  approvals: "Expense Approvals",
  "reports-analytics": "Reports & Analytics",
  reports: "All Reports",
  settings: "Settings & Configuration",
  "view-territorywise-user": "User In Territory"
};

const isIdLike = (segment: string) => {
  // UUID v4 or purely numeric
  return /^[0-9a-fA-F-]{8,}$/.test(segment) || /^\d+$/.test(segment);
};

export const useModuleName = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return "Dashboard";

  let targetSegment = segments[segments.length - 1];

  if (isIdLike(targetSegment) && segments.length > 1) {
    targetSegment = segments[segments.length - 2];
  }

  return (
    MODULE_NAME_MAP[targetSegment] ??
    targetSegment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
};
