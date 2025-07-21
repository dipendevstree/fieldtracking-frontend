import { z } from "zod";

export const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(100, { message: "Name cannot exceed 100 characters." })
        .regex(/^[a-zA-Z\s'-]+$/, {
            message: "Name can only contain letters, spaces, hyphens, and apostrophes.",
        })
        .trim(),

    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Please enter a valid email address." })
        .max(255, { message: "Email cannot exceed 255 characters." })
        .toLowerCase(),

    mobile: z
        .string()
        .min(1, { message: "Mobile number is required." })
        .regex(/^\+?[1-9]\d{1,14}$/, {
            message: "Please enter a valid mobile number (e.g., +1234567890 or 1234567890).",
        })
        .max(15, { message: "Mobile number cannot exceed 15 digits." }),

    gender: z
        .string()
        .transform((val) => val.toLowerCase()) // Convert input to lowercase for consistency
        .pipe(
            z.enum(["male", "female", "other"], {
                errorMap: () => ({
                    message: "Please select a valid gender option (male, female, or other).",
                }),
            })
        ),
    isEdit: z.boolean().optional(),
});

export type TFormSchema = z.infer<typeof formSchema>;