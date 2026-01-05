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
