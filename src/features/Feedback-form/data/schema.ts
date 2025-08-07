import { z } from "zod";

export const feedbackFormSchema = z.object({
  behaviorRating: z
    .number()
    .min(1, "Please rate the sales rep behavior (1-5 stars)")
    .max(5, "Rating cannot exceed 5 stars")
    .int("Rating must be a whole number"),

  punctualityRating: z
    .number()
    .min(1, "Please rate the punctuality (1-5 stars)")
    .max(5, "Rating cannot exceed 5 stars")
    .int("Rating must be a whole number"),

  knowledgeRating: z
    .number()
    .min(1, "Please rate the skills and knowledge (1-5 stars)")
    .max(5, "Rating cannot exceed 5 stars")
    .int("Rating must be a whole number"),

  comments: z
    .string()
    .min(1, "Please describe your experience")
    .min(10, "Please provide at least 10 characters describing your experience")
    .max(500, "Comments must be less than 500 characters")
    .transform((val) => val.trim()),

  // Optional fields that might be useful for feedback tracking
  visitId: z.string().optional(),
  submittedAt: z.date().optional(),
  customerSatisfaction: z
    .enum([
      "Very Dissatisfied",
      "Dissatisfied",
      "Neutral",
      "Satisfied",
      "Very Satisfied",
    ])
    .optional(),
  wouldRecommend: z.boolean().optional(),
});

export type TFeedbackFormSchema = z.infer<typeof feedbackFormSchema>;
