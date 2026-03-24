import { z } from "zod";
import { PlanFrequency } from "@/data/app.data";

export const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name cannot exceed 100 characters." })
    .trim(),
  industry: z.string().min(1, { message: "Industry is required." }),
  employeeRange: z.string().min(1, { message: "Employee range is required." }),
  isSeparateSchema: z.boolean().optional(),
  adminName: z.string().min(1, { message: "Admin name is required." }),
  adminEmail: z
    .string()
    .min(1, { message: "Admin email is required." })
    .email({ message: "Enter a valid email address." }),
  adminPhone: z.string().optional(),
  // .refine((val) => !val || /^[0-9]{10,15}$/.test(val), {
  //   message: 'Phone number must be 10 to 15 digits.',
  // }),
  adminJobTitle: z.string().optional(),
  menuIds: z.array(z.string()),

  // .min(1, { message: 'At least one
  adminPhoneCountryCode: z.string().optional(),
  maxUsers: z.coerce
    .number()
    .min(1, { message: "Max users must be at least 1." }),
});

export type TFormSchema = z.infer<typeof formSchema>;

export const planAssignmentSchema = z.object({
  planId: z.string().min(1, { message: "Plan is required." }),
  planStartDate: z.string().min(1, { message: "Plan start date is required." }),
  frequency: z.nativeEnum(PlanFrequency, {
    errorMap: () => ({ message: "Frequency is required." }),
  }),
  notes: z.string().optional(),
});

export type TPlanAssignmentSchema = z.infer<typeof planAssignmentSchema>;

export const suspendSchema = z.object({
  suspendReason: z.string().min(1, { message: "Reason is required." }),
});

export type TSuspendSchema = z.infer<typeof suspendSchema>;

export const extendGracePeriodSchema = z.object({
  extendByDays: z.coerce
    .number()
    .min(1, { message: "Days must be at least 1." }),
  notes: z.string().min(1, { message: "Notes are required." }),
});

export type TExtendGracePeriodSchema = z.infer<typeof extendGracePeriodSchema>;
