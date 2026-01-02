import { z } from "zod";

export const AttendanceCorrectionSchema = z.object({
  attendanceId: z.string().min(1, "Attendance ID is required"),
  requestedCheckIn: z.string().min(1, "Check-in time is required"), // Expecting HH:mm format
  requestedCheckOut: z.string().min(1, "Check-out time is required"), // Expecting HH:mm format
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

export type AttendanceCorrectionRequest = z.infer<
  typeof AttendanceCorrectionSchema
>;
