import { z } from 'zod'

export const roleFormSchema = z.object({
  roleName: z.string().min(1, 'Role name is required'),
  tierkey: z.string().min(1, 'Tier key is required'),
  menuIds: z
    .array(
      z.object({
        id: z.string(),
        permissionId: z.string().optional(),
        viewOwn: z.boolean().default(false).optional(),
        viewGlobal: z.boolean().default(false).optional(),
        add: z.boolean().default(false).optional(),
        edit: z.boolean().default(false).optional(),
        deleteValue: z.boolean().default(false).optional(),
      })
    )
    .optional(),
})

export type TRoleFormSchema = z.infer<typeof roleFormSchema>
