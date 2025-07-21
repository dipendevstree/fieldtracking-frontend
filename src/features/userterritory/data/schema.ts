import { z } from 'zod'

export const formSchema = z.object({
  name: z.string().min(1, 'Territory is required'),
})

export type TFormSchema = z.infer<typeof formSchema>
