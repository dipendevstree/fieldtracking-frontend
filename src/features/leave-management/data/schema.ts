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

// --- 2. Holiday Template ---
export const HolidaySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Holiday name is required"),
  date: z.date({ required_error: "Date is required" }),
  type: z
    .enum(["National", "Regional", "Festival", "Optional"])
    .default("National"),
  holidayTemplateId: z.array(z.string()).optional(),
});

export const HolidayTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Template name is required"),
  region: z.string().min(1, "Region/Category is required"),
  description: z.string().optional(),
  holidayIds: z.array(z.string()).default([]),
});

export type Holiday = z.infer<typeof HolidaySchema> & { id: string };
export type HolidayTemplate = z.infer<typeof HolidayTemplateSchema> & {
  id: string;
};

// --- 3. Leave Rules ---
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

// --- 4. Employee Tier ---
export const EmployeeTierSchema = z.object({
  tierName: z.string().min(1, "Name is required"),
  leaveConfigs: z.array(
    z.object({
      leaveTypeId: z.string(),
      allowedDays: z.coerce.number().min(0),
    })
  ),
});

export type EmployeeTierFormValues = z.infer<typeof EmployeeTierSchema>;

// --- 5. Apply Leave ---
export const ApplyLeaveSchema = z
  .object({
    leaveTypeId: z.string().min(1, "Leave type is required"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    reason: z.string().min(1, "Reason is required"),
    halfDay: z.boolean().default(false),
    halfDayType: z.string().optional(),
    attachments: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.halfDay && !data.halfDayType) return false;
      return true;
    },
    {
      message: "Half day type is required when half day is selected",
      path: ["halfDayType"],
    }
  );

export type ApplyLeaveFormValues = z.infer<typeof ApplyLeaveSchema>;
