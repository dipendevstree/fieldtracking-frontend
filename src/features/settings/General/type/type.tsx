export interface GeneralSettings {
  settingsId: string;
  companyInformation: {
    companyName: string;
    defaultTimezone: string;
  };
  currencyAndFormatting: {
    defaultCurrency: string;
    dateFormat: string;
    distanceUnit: string;
  };
  securitySettings: {
    requireTwoFactorAuth: boolean;
    autoLogoutOnInactivity: boolean;
    sessionTimeoutMinutes: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyInfo {
  infoId: string;
  companyName: string;
  defaultTimezone: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemPreferences {
  preferenceId: string;
  defaultCurrency: string;
  dateFormat: string;
  distanceUnit: string;
  language: string;
  theme: "light" | "dark" | "auto";
  createdAt?: string;
  updatedAt?: string;
}

export interface DeletionState {
  onConfirm: () => void;
  itemName: string;
  itemIdentifierValue: string;
}

export type FixedDayExpensesProps = {
  setSubmitFixedExpenseForm: Function;
  onDirtyStateChange: (isDirty: boolean) => void;
};

export type FixedDayTierExpenseRowProps = {
  levelIdx: number;
  removeFixedDayTierExpense: (index: number) => void;
  canDelete: boolean;
  tierOptions: { label: string; value: string }[];
  isDeleting: boolean;
  initiateDelete: (state: DeletionState) => void;
  deleteApprovalLevel: any;
  isFirstLevel: boolean;
};

export type FixedDayExpense = {
  id: string;
  tierKey: string;
  dailyExpense: string;
};
