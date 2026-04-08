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
  // Make reporting fields optional and accept null (some API responses use null)
  reportingToRoleId: z.string().nullable().optional(),
  reportingToIds: z.array(z.string()).nullable().optional(),

  // A flag that the component will set so the schema can conditionally require fields
  // Accept null/undefined as well just in case
  hideReportingToField: z.boolean().nullable().optional(),

  // Flag to indicate if territory filtering is enabled for the organization
  allowTerritoryFilter: z.boolean().nullable().optional(),

  permissions: z.array(z.string()).optional(),

  jobTitle: z.string().optional(),
  id: z.string().optional(),
  departmentId: z
    .string({
      required_error: "Department is required",
      invalid_type_error: "Department is required",
    })
    .min(1, "Department is required"),
  isWebUser: z.boolean().optional(),
  shiftId: z.string().min(1, "Shift is required"),
  joiningDate: z.string().min(1, "Joining date is required"),
});

// Conditionally require the reporting fields when hideReportingToField is false/undefined
// Alternative to `superRefine`: build two schema variants and use a union.
// - When `hideReportingToField` is true (or explicitly set), reporting fields are optional.
// - Otherwise (visible/default) reporting fields are required.

// Schema variant when reporting fields are hidden/irrelevant and territory is optional
export const formSchemaHidden = formSchema.extend({
  hideReportingToField: z.literal(true).nullable().optional(),
  // keep reporting fields optional/null when hidden
  reportingToRoleId: z.string().nullable().optional(),
  reportingToIds: z.array(z.string()).nullable().optional(),
  // territory is optional when filter is not enabled
  allowTerritoryFilter: z
    .union([z.literal(false), z.undefined(), z.null()])
    .optional(),
  territoryId: z.string().optional(),
});

// Schema variant when reporting fields should be present and territory is optional
export const formSchemaShown = formSchema.extend({
  // hideReportingToField can be false/undefined/null in this branch
  hideReportingToField: z
    .union([z.literal(false), z.undefined(), z.null()])
    .optional(),
  // coerce null -> undefined then require a non-empty string
  reportingToRoleId: z.preprocess(
    (v) => (v === null ? undefined : v),
    z.string().min(1, "Reporting To Role is required"),
  ),
  // coerce null -> undefined then require non-empty array
  reportingToIds: z.preprocess(
    (v) => (v === null ? undefined : v),
    z.array(z.string()).min(1, "Reporting to is required"),
  ),
  // territory is optional when filter is not enabled
  allowTerritoryFilter: z
    .union([z.literal(false), z.undefined(), z.null()])
    .optional(),
  territoryId: z.string().optional(),
});

// Schema variant when reporting fields are hidden but territory is required
export const formSchemaHiddenTerritoryRequired = formSchema.extend({
  hideReportingToField: z.literal(true).nullable().optional(),
  reportingToRoleId: z.string().nullable().optional(),
  reportingToIds: z.array(z.string()).nullable().optional(),
  allowTerritoryFilter: z.literal(true).nullable().optional(),
  territoryId: z.string().min(1, "Territory is required"),
});

// Schema variant when reporting fields are shown and territory is required
export const formSchemaShownTerritoryRequired = formSchema.extend({
  hideReportingToField: z
    .union([z.literal(false), z.undefined(), z.null()])
    .optional(),
  reportingToRoleId: z.preprocess(
    (v) => (v === null ? undefined : v),
    z.string().min(1, "Reporting To Role is required"),
  ),
  reportingToIds: z.preprocess(
    (v) => (v === null ? undefined : v),
    z.array(z.string()).min(1, "Reporting to is required"),
  ),
  allowTerritoryFilter: z.literal(true).nullable().optional(),
  territoryId: z.string().min(1, "Territory is required"),
});

// Union of all variants to handle all combinations
export const formSchemaConditional = z.union([
  formSchemaHidden,
  formSchemaShown,
  formSchemaHiddenTerritoryRequired,
  formSchemaShownTerritoryRequired,
]);

export type TFormSchema = z.infer<typeof formSchema>;
export type TFormSchemaConditional = z.infer<typeof formSchemaConditional>;
