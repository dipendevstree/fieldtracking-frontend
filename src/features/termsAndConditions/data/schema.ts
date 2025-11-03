import { z } from "zod";
import { TERMS_TYPE } from "../types";

export const formSchemaTerms = z.object({
  type: z.nativeEnum(TERMS_TYPE, {
    required_error: "Please select a document type.",
  }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters long." }),
});

export type TFormSchemaTerms = z.infer<typeof formSchemaTerms>;
