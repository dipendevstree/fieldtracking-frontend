import { z } from 'zod'

export const formSchema = z.object({
  typeName: z.string().min(1, 'Customer Type is required'),
})

export type TFormSchema = z.infer<typeof formSchema>
