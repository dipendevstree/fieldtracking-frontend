import { ATTENDANCE_RULE_FREQUENCY } from "@/data/app.data";
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
export const HoursDeductionRuleSchema = z.object({
  shortageMin: z.coerce.number().min(1, "Min 1"),
  shortageMax: z.coerce.number().min(1, "Min 1"),
  deductionCount: z.coerce.number().min(0, "Min 0"),
});

export const AttendanceRulesSchema = z.object({
  gracePeriodMinutes: z.coerce
    .number()
    .min(0, "Grace period must be 0 or greater"),
  enableOvertime: z.boolean().optional(),
  enableGracePeriod: z.boolean().optional(),
  enableLateMarkRule: z.boolean().optional(),
  enableHoursBasedDeduction: z.boolean().optional(),
  lateMarkLimit: z.coerce
    .number()
    .min(0, "Late mark limit must be 0 or greater"),
  leaveDeductionCount: z.coerce
    .number()
    .min(0, "Leave deduction count must be 0 or greater"),
  weekOffDays: z
    .array(z.coerce.number().min(0).max(6))
    .min(1, "At least one week off day is required"),
  latemarkApplicableTiers: z.array(z.string()).optional(),
  frequency: z.nativeEnum(ATTENDANCE_RULE_FREQUENCY).optional(),
  // --- Enhanced Validation for Hours Based Rules ---
  hoursDeductionRules: z
    .array(HoursDeductionRuleSchema)
    .optional()
    .superRefine((rules, ctx) => {
      if (!rules || rules.length === 0) return;

      rules.forEach((rule, index) => {
        const min = Number(rule.shortageMin);
        const max = Number(rule.shortageMax);

        // 1. Validate Row: Max > Min
        if (max <= min && max !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Must be greater than Min",
            path: [index, "shortageMax"],
          });
        }

        // 2. Validate Sequence: Current Min > Previous Max
        if (index > 0) {
          const prevRule = rules[index - 1];
          const prevMax = Number(prevRule.shortageMax);
          if (prevMax > 0 && min <= prevMax) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Must start after ${prevMax}`,
              path: [index, "shortageMin"],
            });
          }
        }
      });
    }),
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
