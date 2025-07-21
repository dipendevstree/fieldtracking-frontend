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
    merchant_id: z
        .string()
        .min(2, { message: "merchant_id must be at least 2 characters long." })
        .max(100, { message: "merchant_id cannot exceed 100 characters." })
        .trim(),
    user_name: z
        .string()
        .min(2, { message: "Username must be at least 2 characters long." })
        .max(100, { message: "Username cannot exceed 100 characters." }).trim(),

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
        .enum(["male", "female", "other"], {
            errorMap: () => ({ message: "Please select a valid gender option (male, female, or other)." }),
        }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(50, { message: "Password cannot exceed 50 characters." })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            }
        ),

    isEdit: z.boolean(),
});

export type TFormSchema = z.infer<typeof formSchema>;
