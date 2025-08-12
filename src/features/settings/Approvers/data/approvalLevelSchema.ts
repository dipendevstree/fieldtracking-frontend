import { z } from "zod";

export const expenseTypeSchema = z.object({
  expensesLevelId: z.string().optional(),
  type: z.string().min(1, "Expense type is required"),
  tier: z.string().min(1, "Tier is required"),
  minAmount: z.string().min(1, "Min amount is required"),
  maxAmount: z.string().min(1, "Max amount is required"),
});

export const levelSchema = z.object({
  user: z.string().min(1, "User is required"),
  expenseTypes: z.array(expenseTypeSchema).min(1),
});

export const formSchema = z.object({
  defaultApprover: z.string().min(1, "Default First Approver is required"),
  selectedUser: z.string().min(1, "User is required"),
  levels: z.array(levelSchema).min(1, "At least one level is required"),
});

export type FormValues = z.infer<typeof formSchema>;
