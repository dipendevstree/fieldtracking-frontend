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

// --- Attendance Rules ---
export const AttendanceRulesSchema = z.object({
  gracePeriodMinutes: z.coerce
    .number()
    .min(0, "Grace period must be 0 or greater"),
  calculateOvertime: z.boolean(),
  lateMarkLimit: z.coerce
    .number()
    .min(0, "Late mark limit must be 0 or greater"),
  leaveDeductionCount: z.coerce
    .number()
    .min(0, "Leave deduction count must be 0 or greater"),
  weekOffDays: z
    .array(z.coerce.number().min(0).max(6))
    .min(1, "At least one week off day is required"),
});

export type AttendanceRules = z.infer<typeof AttendanceRulesSchema>;
