import { z } from "zod";

// Current date and time: August 04, 2025, 09:52 AM IST
const currentDate = new Date("2025-08-04T09:52:00+05:30");

const visitSchema = z.object({
  purpose: z.string().min(1, "Purpose of visit is required"),
  customer: z.string().min(1, "Customer is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Street Address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180"),
  reportType: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"], {
    required_error: "Priority is required",
  }),
  duration: z
    .string()
    .min(1, "Duration is required")
    .regex(/^\d+(\.\d+)?$/, "Duration must be a number"),
  preparationNotes: z.string().optional(),
});

export const formSchema = z.object({
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => {
      const selectedDate = new Date(val);
      selectedDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
      const normalizedCurrentDate = new Date(currentDate);
      normalizedCurrentDate.setHours(0, 0, 0, 0);
      return (
        selectedDate >= normalizedCurrentDate ||
        selectedDate.toDateString() === normalizedCurrentDate.toDateString()
      );
    }, "Date cannot be in the past"),
  salesRep: z.string().min(1, "Sales Representative is required"),
  visits: z.array(visitSchema).min(1, "At least one visit is required"),
});

export type TFormSchema = z.infer<typeof formSchema>;
