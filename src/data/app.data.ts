export const ALL_PAGE_META_DATA = {
  buyers: {
    title: "Buyers/Clients",
    description: "Manage your buyers/clients",
  },
  sellers: {
    title: "Sellers",
    description: "Manage your sellers",
  },
  drivers: {
    title: "Drivers",
    description: "Manage your drivers",
  },
  settings: {
    title: "Settings",
    description: "Manage your settings",
  },
};

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZES = [10, 20, 30, 40, 50, 100];
export const DEFAULT_PAGE_NUMBER = 1;

export enum Priority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum EXPENSE_TYPE {
  DAILY = "daily",
  TRAVEL = "travel",
}

export enum EXPENSE_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  PARTIALLY_APPROVED = "partially_approved",
  REJECT = "reject",
}

export enum EXPENSE_SUB_TYPE {
  TRAVEL_LUMP_SUM = "travel_lump_sum",
  TRAVEL_ROUTE = "travel_route",
  DAILY_LOCAL = "daily_local",
  DAILY_OUTSTATION = "daily_outstation",
}

export enum TIER {
  TIER_1 = "tier_1",
  TIER_2 = "tier_2",
  TIER_3 = "tier_3",
  TIER_4 = "tier_4",
  TIER_5 = "tier_5",
  TIER_6 = "tier_6",
  TIER_7 = "tier_7",
  TIER_8 = "tier_8",
  TIER_9 = "tier_9",
  TIER_10 = "tier_10",
}

export enum PRIORITY {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum REPORT_TYPE {
  VISIT_REPORTS = "Visit Reports",
  PRODUCTIVITY_REPORT = "Productivity Report",
  CUSTOMER_REPORT = "Customer Report",
  FIELD_ACTIVITY_REPORT = "Field Activity Report",
}

export enum REPORT_FORMAT {
  PDF = "pdf",
  EXCEL = "excel",
  CSV = "csv",
}

export enum VISIT_STATUS {
  PENDING = "pending",
  CHECKIN = "checkin",
  COMPLETED = "completed",
  PARTIAL_COMPLETED = "partial_completed",
  CANCEL = "cancel",
}
