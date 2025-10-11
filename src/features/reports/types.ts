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
  generatedBy: string;
  date: string;
  time: string;
  size: string;
  status: string;
  dateRange?: DateRange;
}

export interface expanseReportFilters {
  expanseDateRange?: DateRange;
  createdDateRange?: DateRange;
  salesRep: string;
  category: string;
}

export interface CustomeReportFilter {
  dateRange?: DateRange;
  salesRep?: string;
  territory?: string;
}


