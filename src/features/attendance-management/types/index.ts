import { ATTENDANCE_STATUS } from "@/data/app.data";

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
