// schema.ts
import { z } from 'zod'

// Strong password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  )

// Base schemas without refinements for merging
const step1BaseSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  email: z.string().email('Email is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  phoneNumber: z.string().nonempty('Phone number is required'),
  jobTitle: z.string().nonempty('Job title is required'),
  department: z.string().optional(),
  PhoneCountryCode: z.string().nonempty('PhoneCountryCode is required'),
})

// Step 1 schema with password confirmation validation
export const step1Schema = step1BaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }
)

export const step2Schema = z.object({
  organizationName: z.string().nonempty('Organization name is required'),
  organizationTypes: z.string().nonempty('Organization type is required'),
  website: z
    .string()
    .refine((val) => val === '' || z.string().url().safeParse(val).success, {
      message: 'Website must be a valid URL',
    }),
  description: z.string().optional(),
  timeZone: z.string().optional(),
})

export const step3Schema = z.object({
  streetAddress: z.string().nonempty('Street address is required'),
  city: z
    .string()
    .nonempty('City is required')
    .regex(/^[a-zA-Z\s]+$/, 'City must contain only letters and spaces'),
  state: z
    .string()
    .nonempty('State is required')
    .regex(/^[a-zA-Z\s]+$/, 'State must contain only letters and spaces'),
  postalCode: z
    .string()
    .min(4, 'Postal code must be at least 4 characters')
    .max(10, 'Postal code must be at most 10 characters')
    .regex(/^\d+$/, 'Postal code must contain only numbers'),
  country: z.string().nonempty('Country is required'),
})

export const step4Schema = z.object({
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Terms of Service' }),
  }),
  privacy: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Privacy Policy' }),
  }),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to data processing' }),
  }),
})

// Combined form schema with all validations
export const formSchema = step1BaseSchema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type TFormSchema = z.infer<typeof formSchema>

export const getStepSchema = (step: number) => {
  switch (step) {
    case 1:
      return step1Schema
    case 2:
      return step2Schema
    case 3:
      return step3Schema
    case 4:
      return step4Schema
    default:
      return formSchema
  }
}

// Helper function to check password strength (for UI components)
export const checkPasswordStrength = (password: string) => {
  if (!password) return { strength: 0, label: '', color: '' }

  let score = 0
  const checks = [
    { regex: /.{8,}/, label: 'At least 8 characters' },
    { regex: /[A-Z]/, label: 'Uppercase letter' },
    { regex: /[a-z]/, label: 'Lowercase letter' },
    { regex: /[0-9]/, label: 'Number' },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, label: 'Special character' },
  ]

  checks.forEach((check) => {
    if (check.regex.test(password)) score++
  })

  if (score < 3) return { strength: score, label: 'Weak', color: 'bg-red-500' }
  if (score < 5)
    return { strength: score, label: 'Medium', color: 'bg-yellow-500' }
  return { strength: score, label: 'Strong', color: 'bg-green-500' }
}

// Password requirement checks for UI components
export const passwordRequirements = [
  { regex: /.{8,}/, label: 'At least 8 characters' },
  { regex: /[A-Z]/, label: 'One uppercase letter' },
  { regex: /[a-z]/, label: 'One lowercase letter' },
  { regex: /[0-9]/, label: 'One number' },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, label: 'One special character' },
]
