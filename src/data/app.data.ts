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
  DRAFT = "draft",
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
