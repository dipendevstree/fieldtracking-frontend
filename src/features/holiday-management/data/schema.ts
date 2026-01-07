import { z } from "zod";

export const HolidaySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Holiday name is required"),
  date: z.date({ required_error: "Date is required" }),
  description: z.string().optional(),
  holidayTypeId: z.string().min(1, "Holiday Type is required"),
  isSpecial: z.boolean().default(false),
  holidayTemplateId: z.array(z.string()).optional(),
});

export const HolidayTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Template name is required"),
  territoryId: z.string().optional(),
  description: z.string().optional(),
  specialHolidayIds: z.array(z.string()).default([]),
  userIds: z.array(z.string()).optional(),
});

export type Holiday = z.infer<typeof HolidaySchema> & { id: string };
export type HolidayTemplate = z.infer<typeof HolidayTemplateSchema> & {
  id: string;
};

export const HolidayTypeSchema = z.object({
  id: z.string().optional(),
  holidayTypeName: z.string().min(1, "Holiday Type name is required"),
});

export type HolidayType = z.infer<typeof HolidayTypeSchema>;
