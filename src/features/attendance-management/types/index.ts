import { ATTENDANCE_STATUS } from "@/data/app.data";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";

export interface AttendanceCalendarProps {
  events: AttendanceEvent[];
  date: Date;
  onNavigate: (date: Date) => void;
  onSelectEvent?: (event: AttendanceEvent) => void;
  onSelectSlot?: (slotInfo: any) => void;
  holidays?: any[];
  weekOffDays?: number[];
  isSelectable?: boolean;
}

export interface TeamAttendanceCalendarProps {
  events: AttendanceEvent[];
  date: Date;
  onNavigate: (date: Date) => void;
  className?: string;
  holidays?: any[];
  weekOffDays?: number[];
}

export interface AttendanceRecord {
  attendanceId: string;
  date: string; // ISO date string
  firstCheckIn: string; // ISO date-time string
  lastCheckOut: string; // ISO date-time string
  status: ATTENDANCE_STATUS;
  // Add other relevant fields as needed
}

// Additional parameters for listing APIs
export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  [key: string]: unknown;
}

export interface AttendanceCorrection {
  correctionId: string;
  userId: string;
  organizationId: string;
  attendanceId: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCEL";
  approverId: string | null;
  rejectionReason: string | null;
  userTimeZone: string;
  createdDate: string;
  modifiedDate: string;
  deletedDate: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileUrl: string | null;
    phoneNumber: string;
    countryCode: string;
    jobTitle: string;
    departmentId: string;
    status: string;
    roleId: string;
    organizationID: string;
  };
  attendance: {
    attendanceId: string;
    userId: string;
    organizationId: string;
    date: string;
    firstCheckIn: string;
    lastCheckOut: string;
    totalWorkHours: number;
    overtimeHours: number;
    status: string;
    hadLateEntry: boolean;
    hadEarlyExit: boolean;
    leaveDeduction: number;
    createdBy: string;
    createdDate: string;
    modifiedDate: string;
  };
  approver: any | null;
}

export interface AttendanceCorrectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // The base attendance record we are correcting
  selectedAttendance: any | null;
  // If editing an existing request, this will be populated
  correctionToEdit: any | null;
}

export interface AttendanceCorrectionListResponse {
  statusCode: number;
  error: boolean;
  message: string;
  list: AttendanceCorrection[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface AttendanceApprovalRequest {
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCEL";
  rejectionReason?: string;
}

export interface AttendanceApprovalParams {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AttendanceEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    status: ATTENDANCE_STATUS;
    // For individual attendance
    checkIn?: string;
    checkOut?: string;
    // For team dashboard
    name?: string;
    leaveType?: string;
    halfDay?: boolean;
    halfDayType?: string;
    [key: string]: any;
  };
}

export interface EmployeeData {
  id: string;
  name: string;
}

export interface DashboardUserTableProps {
  data: any[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  defaultPageSize?: number;
  viewType?: "daily" | "range";
}
