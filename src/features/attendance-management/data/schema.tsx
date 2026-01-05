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

// --- Shifts ---
export const ShiftSchema = z.object({
  name: z.string().min(1, "Shift name is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  breakMinutes: z.coerce.number().min(0, "Break minutes cannot be negative"),
  fullDayHours: z.coerce.number().min(0, "Full day hours cannot be negative"),
  halfDayHours: z.coerce.number().min(0, "Half day hours cannot be negative"),
  isDefault: z.boolean().default(false),
});

export type Shift = z.infer<typeof ShiftSchema> & { id: string };
