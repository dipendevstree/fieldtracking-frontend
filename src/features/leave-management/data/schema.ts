import { z } from "zod";

// --- 1. Leave Type ---
export const LeaveTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Leave name is required"),
  balance: z.coerce.number().min(0, "Balance cannot be negative"),
  allocationPeriod: z.enum(["yearly", "monthly", "quarterly"]),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
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
});

export const HolidayTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Template name is required"),
  region: z.string().min(1, "Region/Category is required"),
  description: z.string().optional(),
  holidays: z.array(HolidaySchema).default([]),
});

export type Holiday = z.infer<typeof HolidaySchema> & { id: string };
export type HolidayTemplate = z.infer<typeof HolidayTemplateSchema> & {
  id: string;
};

// --- 3. Leave Rules ---
export const LeaveRulesSchema = z.object({
  sandwich: z.object({
    enabled: z.boolean(),
    maxDays: z.coerce.number().min(0),
  }),
  carryForward: z.object({
    enabled: z.boolean(),
    maxDays: z.coerce.number().min(0),
    expiryMonths: z.coerce.number().min(0),
  }),
  encashment: z.object({
    enabled: z.boolean(),
    maxDays: z.coerce.number().min(0),
    minBalance: z.coerce.number().min(0),
  }),
});

export type LeaveRules = z.infer<typeof LeaveRulesSchema>;

// --- 4. Employee Tier ---
export const EmployeeTierSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tier name is required"),
  leaveAllocations: z.array(
    z.object({
      leaveTypeId: z.string(),
      days: z.coerce.number().min(0),
    })
  ),
});

export type EmployeeTier = z.infer<typeof EmployeeTierSchema> & { id: string };

export const ApplyLeaveSchema = z.object({
  leaveTypeId: z.string().min(1, "Leave type is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

export type ApplyLeave = z.infer<typeof ApplyLeaveSchema>;
