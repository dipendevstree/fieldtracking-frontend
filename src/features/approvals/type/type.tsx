export interface Territory {
  id?: string;
  territory: string;
  createdAt?: string;
  updatedAt?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface Category {
  expensesCategoryId?: string;
  categoryName: string;
  createdDate?: string;
}

export type TravelLumpSum = {
  date: string;
  amount: number;
  approvedAmount: number;
  mode: string;
  status: string;
};

export type TravelRoute = {
  date: string;
  fromLocation: string;
  toLocation: string;
  vehicleCategory: string;
  amount: number;
  approvedAmount: number;
  notes?: string;
  status: string;
};

export type TravelExpanseDetailsProps = {
  expenseSubType: string;
  travelLumpSums?: TravelLumpSum[];
  travelRoutes?: TravelRoute[];
};


export type DailyAllowance = {
  dailyAllowanceId: string;
  status: string;
  tripType: "local" | "outstation";
  amount: string;
  isDayEnable: boolean;
  approvedAmount: string;
  startDate: string;
  endDate: string;
  expensesDate: string;
  salesRepresentativeUserId: string;
  organizationId: string;
  expensesId: string;
  createdBy: string;
  updatedBy: string | null;
  deletedDate: string | null;
  createdDate: string;
  modifiedDate: string;
  dailyAllowancesDetails: DailyAllowanceDetail[];
};


export type DailyAllowanceDetail = {
  id: string;
  status: string;
  tripType: "local" | "outstation";
  amount: number;
  startDate: string;
  endDate: string;
  expensesDate: string;
  notes: string;
  isDayEnable: boolean;
  salesRepresentativeUserId: string;
  dailyAllowanceId: string;
  expensesCategoryId: string;
  organizationId: string;
  expensesId: string;
  createdBy: string;
  updatedBy: string | null;
  deletedDate: string | null;
  createdDate: string;
  modifiedDate: string;
  expensesCategory?: ExpensesCategory;
  receiptUrls: string[];
};


export type ExpensesCategory = {
  expensesCategoryId: string;
  categoryName: string;
  organizationId: string;
  createdBy: string;
  updatedBy: string;
  deletedDate: string | null;
  createdDate: string;
  modifiedDate: string;
};

export type DailyAllowanseDetailsProps = {
  dailyAllowances?: DailyAllowance[];
  expenseSubType?: string;
};

