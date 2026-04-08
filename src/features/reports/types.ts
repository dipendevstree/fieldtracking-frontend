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

export type ProductivityReportRow = {
  date: string;
  salesRepresentative: string;
  punchIn: string;
  punchOut: string;
  vehicleType: string;
  vehicleCategory: string;
  odometer: string;
  totalDistance: string;
  dayStartAddress: string;
  dayEndAddress: string;
  status: string;
  isOnBreak: string;
  workingHours: string;
  totalBreakTime: string;
};

export type CustomerReportRow = {
  customerName: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  totalVisitScheduled: string;
  visitsCompleted: string;
  pendingVisits: string;
  completionRate: string;
  totalVisitDuration: string;
  cancelledVisits: string;
  rescheduledVisits: string;
  additionalNotes?: string;
};

export type VisitReportRow = {
  date: string;
  priority: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  visitCheckInTime: string;
  visitCheckOutTime: string;
  duration: string;
  feedBackDescription: string;
  meetingNotes: string;
  meetingOutcomes: string;
  followUpDate: string;
  nextActions: string;
  salesRepresentativeUserName: string;
  customerName: string;
  status: string;
  purpose: string;
  feedBackStar: string;
};
