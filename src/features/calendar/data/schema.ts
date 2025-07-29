import { z } from "zod";

// Current date and time: July 08, 2025, 03:59 PM IST
const currentDate = new Date("2025-07-08T15:59:00+05:30");

export const formSchema = z.object({
  purpose: z.string().min(1, "Purpose of visit is required"),
  customer: z.string().min(1, "Customer is required"),
  salesRep: z.string().min(1, "Sales Representative is required"),
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
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  reportType: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"], {
    required_error: "Priority is required",
  }),
  duration: z
    .string()
    .min(1, "Duration is required")
    .regex(/^\d+$/, "Duration must be a number"),
  preparationNotes: z.string().optional(),
});

export type TFormSchema = z.infer<typeof formSchema>;
