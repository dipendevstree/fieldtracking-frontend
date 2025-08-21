import { z } from "zod";

export const expenseTypeSchema = z
  .object({
    expensesLevelId: z.string().optional(),
    type: z.string().min(1, "Expense type is required"),
    tier: z.string().min(1, "Tier is required"),
    minAmount: z
      .string()
      .min(1, "Min amount is required")
      .refine((val) => !isNaN(Number(val)), {
        message: "Min amount must be a number",
      }),
    maxAmount: z
      .string()
      .min(1, "Max amount is required")
      .refine((val) => !isNaN(Number(val)), {
        message: "Max amount must be a number",
      }),
  })
  .refine((data) => Number(data.minAmount) < Number(data.maxAmount), {
    message: "Min amount must be less than Max amount",
    path: ["minAmount"],
  });

export const levelSchema = z.object({
  user: z.string().min(1, "User is required"),
  expenseTypes: z.array(expenseTypeSchema).min(1),
});

export const formSchema = z.object({
  defaultApprover: z.string().min(1, "Default First Approver is required"),
  selectedUser: z.string().min(1, "User is required"),
  levels: z.array(levelSchema).optional(),
});

export type FormValues = z.infer<typeof formSchema>;
