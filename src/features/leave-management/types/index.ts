export type LeaveType = "CL" | "SL" | "PL" | "LOP" | "MATERNITY" | "PATERNITY";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  documents?: string[];
  appliedOn: string;
  approvalRemarks?: string;
}

export interface LeaveBalance {
  userId: string;
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type: "PUBLIC" | "OPTIONAL";
}
