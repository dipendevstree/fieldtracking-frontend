import { z } from 'zod'

export const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(100, { message: 'Name cannot exceed 100 characters.' })
    .trim(),
  industry: z.string().min(1, { message: 'Industry is required.' }),
  employeeRange: z.string().min(1, { message: 'Employee range is required.' }),
  isSeparateSchema: z.boolean().optional(),
  
  // Admin/Contact Information
  adminName: z.string().min(1, { message: 'Admin name is required.' }),
  adminEmail: z
    .string()
    .min(1, { message: 'Admin email is required.' })
    .email({ message: 'Enter a valid email address.' }),
  adminPhone: z.string().min(1, { message: 'Phone number is required.' }),
  adminJobTitle: z.string().optional(),
  adminPhoneCountryCode: z.string().optional(),
  
  // Menu Access
  menuIds: z.array(z.string()),
  
  // Additional Customer Fields
  streetAddress: z.string().min(1, { message: 'Street address is required.' }),
  city: z.string().min(1, { message: 'City is required.' }),
  state: z.string(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
  customerType: z.string().optional()
})

export type TFormSchema = z.infer<typeof formSchema>

// Default values helper
export const defaultFormValues: TFormSchema = {
  name: '',
  industry: '',
  employeeRange: '',
  isSeparateSchema: false,
  adminName: '',
  adminEmail: '',
  adminPhone: '',
  adminJobTitle: '',
  adminPhoneCountryCode: '',
  menuIds: [],
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  notes: '',
  customerType: ''
}
