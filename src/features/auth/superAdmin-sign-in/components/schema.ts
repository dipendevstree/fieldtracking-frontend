import { z } from "zod";

export const formSchema = z.object({
  username: z.string().min(1, { message: "Please enter your name" }).trim(),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    })
    .trim(),
});

export type TFormSchema = z.infer<typeof formSchema>;
