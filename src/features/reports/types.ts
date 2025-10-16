import { DateRange } from "react-day-picker";

export type ReportsHeadProps = {
  title?: string;
  subtitle?: string;
};

export type ExpanseReportRow = {
  salesRep: string;
  expanse_date?: string;
  created_date?: string;
  date?: string;
  expense_category: string;
  status?: string;
  total_amount: string;
};

export interface CustomReportRow {
  id: number;
  type: string;
  format: string;
  createdByData: any;
  createdDate: string;
  fileUrl: string;
  fileSize: string;
  status: string;
  dateRange?: DateRange;
}

export interface expanseReportFilters {
  expanseDateRange?: DateRange;
  createdDateRange?: DateRange;
  salesRepresentativeUserId: string;
  category: string;
  format: string;
}

export interface CustomeReportFilter {
  dateRange?: DateRange;
  reportType?: string;
  salesRep: string;
  customerId: string;
  category: string;
  format: string;
  status: string;
}

export interface ExpanseReportFilterState {
  startDate?: string;
  endDate?: string;
  createdStartDate?: string;
  createdEndDate?: string;
  salesRepresentativeUserId?: string;
  expenseCategory?: string;
  isWebAdminSide?: boolean;
  sort?: "asc" | "desc";
  status?: string;
  type?: string;
  format: string;
}
