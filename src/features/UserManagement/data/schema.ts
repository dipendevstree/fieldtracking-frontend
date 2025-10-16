import { z } from "zod";

export const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Must be a valid email address"),
  phoneNumber: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long"),
  countryCode: z.string().min(1, "Country code is required"),

  territoryId: z.string().optional(),
  roleId: z.string().min(1, "Role is required"),
  reportingToRoleId: z.string().min(1, "Reporting To Role is required"),
  reportingToIds: z.array(z.string()).min(1, "Reporting to is required"),

  tierkey: z.string().min(1, "Tier to is required"),

  permissions: z.array(z.string()).optional(),

  jobTitle: z.string().optional(),
  id: z.string().optional(),
  departmentId: z.string({
    required_error: "Department is required",
    invalid_type_error: "Department is required"
  }).min(1, "Department is required"),
  isWebUser: z.boolean().optional(),
});

export type TFormSchema = z.infer<typeof formSchema>;
