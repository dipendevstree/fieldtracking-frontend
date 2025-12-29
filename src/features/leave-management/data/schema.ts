import { z } from "zod";

// --- 1. Leave Type ---
export const LeaveTypeSchema = z.object({
  name: z.string().min(1, "Leave name is required"),
  leaveBalance: z.coerce.number().min(0, "Balance cannot be negative"),
  allocationPeriod: z.enum(["Yearly", "Monthly", "Quarterly"]),
  requiresAttachment: z.boolean().default(false),
  description: z.string().optional(),
});

export type LeaveType = z.infer<typeof LeaveTypeSchema> & { id: string };

// --- 2. Leave Rules ---
export const LeaveRulesSchema = z.object({
  // Sandwich
  sandwichLeaveRuleActive: z.boolean(),
  maximumSandwichLeaveDays: z.coerce.number().min(0),

  // Cross Leave
  crossLeaveDeductionRuleActive: z.boolean(),
  primaryLeaveType: z.string().optional(),
  secondaryLeaveTypes: z.array(z.string()).optional(),

  // Carry Forward
  leaveCarryForwardRuleActive: z.boolean(),
  maximumCarryForwardDays: z.coerce.number().min(0),
  carryForwardExpiryMonths: z.coerce.number().min(0),

  // Encashment
  leaveEncashmentRuleActive: z.boolean(),
  maximumEncashmentDays: z.coerce.number().min(0),
  minimumEncashmentDaysRequired: z.coerce.number().min(0),
});

export type LeaveRules = z.infer<typeof LeaveRulesSchema>;

// --- 3. User Tier ---
export const UserTierSchema = z.object({
  tierName: z.string().min(1, "Name is required"),
  leaveConfigs: z.array(
    z.object({
      leaveTypeId: z.string(),
      allowedDays: z.coerce.number().min(0),
    })
  ),
  userIds: z.array(z.string()).default([]),
});

export type UserTierFormValues = z.infer<typeof UserTierSchema>;

// --- 4. Apply Leave (DYNAMIC VALIDATION) ---
export const getApplyLeaveSchema = (requiredAttachmentIds: string[] = []) =>
  z
    .object({
      leaveTypeId: z.string().min(1, "Leave type is required"),
      startDate: z.date({ required_error: "Start date is required" }),
      endDate: z.date({ required_error: "End date is required" }),
      reason: z.string().min(1, "Reason is required"),
      halfDay: z.boolean().default(false),
      halfDayType: z.string().optional(),
      attachments: z.array(z.any()).optional(),
    })
    .superRefine((data, ctx) => {
      // 1. Half Day Validation
      if (data.halfDay && !data.halfDayType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Half day type is required when half day is selected",
          path: ["halfDayType"],
        });
      }

      // 2. Attachment Validation
      if (requiredAttachmentIds.includes(data.leaveTypeId)) {
        if (!data.attachments || data.attachments.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Proof/Attachment is required for this leave type",
            path: ["attachments"],
          });
        }
      }
    });

export type ApplyLeaveFormValues = z.infer<
  ReturnType<typeof getApplyLeaveSchema>
>;
