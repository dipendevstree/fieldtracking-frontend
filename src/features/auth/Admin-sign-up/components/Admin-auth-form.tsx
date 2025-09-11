import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Separator } from '@radix-ui/react-separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import parsePhoneNumberFromString from 'libphonenumber-js'
import { Building } from 'lucide-react'
import moment from 'moment-timezone'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useSelectOptions } from '@/hooks/use-select-option'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  getStepSchema,
  TFormSchema,
  formSchema,
  checkPasswordStrength,
  passwordSchema, // <-- Add this import
} from '../data/schema'
import {
  useGetDepartment,
  useGetOrganizationTypes,
  useGetUserByToken,
  useSingUp,
} from '../services/sign-up-services'

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const { data, isLoading } = useGetUserByToken(token ?? '')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  if (data) {
    if (data.status === 'pending') {
      navigate({ to: '/watingforapproval' })
    } else if (data.status === 'rejected') {
      navigate({ to: '/watingforapproval' })
    } else if (data.status === 'verified') {
      navigate({ to: '/sign-in' })
    }
  }

  const { data: departmentList } = useGetDepartment()
  const department = useSelectOptions<any>({
    listData: departmentList ?? [],
    labelKey: 'departmentName',
    valueKey: 'departmentId',
  })

  const { data: organizationTypesList } = useGetOrganizationTypes()
  const organizationTypes = useSelectOptions<any>({
    listData: organizationTypesList ?? [],
    labelKey: 'organizationTypeName',
    valueKey: 'organizationTypeId',
  })
  const systemTimeZone = moment.tz.guess()

  const TimeZoneList = moment.tz.names().map((timezone) => ({
    value: timezone,
    label: `${timezone} ${moment.tz(timezone).format('z (Z)')}`,
  }))

  const countryOptions = [
    { label: 'United States', value: 'United States' },
    { label: 'United Kingdom', value: 'United Kingdom' },
    { label: 'Canada', value: 'Canada' },
    { label: 'Australia', value: 'Australia' },
    { label: 'Germany', value: 'Germany' },
    { label: 'France', value: 'France' },
    { label: 'India', value: 'India' },
    { label: 'China', value: 'China' },
    { label: 'Japan', value: 'Japan' },
    { label: 'Brazil', value: 'Brazil' },
    { label: 'Russia', value: 'Russia' },
    { label: 'Italy', value: 'Italy' },
    { label: 'Spain', value: 'Spain' },
    { label: 'Mexico', value: 'Mexico' },
    { label: 'South Korea', value: 'South Korea' },
    { label: 'Netherlands', value: 'Netherlands' },
    { label: 'Switzerland', value: 'Switzerland' },
    { label: 'Sweden', value: 'Sweden' },
    { label: 'Singapore', value: 'Singapore' },
    { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  ]

  // Make sure formSchema is imported or defined above this usage:

  const { control, setValue, watch, trigger, formState, handleSubmit } =
    useForm<TFormSchema>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        jobTitle: '',
        department: '',
        organizationName: '',
        organizationTypes: '',
        website: '',
        description: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        timeZone: systemTimeZone,
      },
    })
  const { errors } = formState

  useEffect(() => {
    if (data) {
      if (data.firstName) setValue('firstName', data.firstName)
      if (data.lastName) setValue('lastName', data.lastName)
      if (data.email) setValue('email', data.email)
      const phoneNumberE164 =
        data.countryCode && data.phoneNumber
          ? `${data.countryCode}${data.phoneNumber}`
          : ''
      setValue('phoneNumber', phoneNumberE164)
      setValue('PhoneCountryCode', data.countryCode)
      setValue('organizationName', data.organization.organizationName)
      setValue('jobTitle', data.jobTitle)
    }
  }, [data, setValue])

  const validateCurrentStep = async () => {
    const currentStepSchema = getStepSchema(currentStep)
    // If the schema is wrapped in ZodEffects, use .innerType() to access the underlying object
    const schemaObject =
      'innerType' in currentStepSchema
        ? (currentStepSchema as any).innerType()
        : currentStepSchema
    const currentStepFields = Object.keys(schemaObject.shape)

    // Trigger validation only for current step fields
    const isValid = await trigger(currentStepFields as any)
    return isValid
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  const { mutate: createUser, isError, isSuccess } = useSingUp()

  useEffect(() => {
    if (isSuccess && !isError) {
      // Navigate to waiting for approval page
      navigate({ to: '/watingforapproval' })
    }
  }, [isSuccess, isError, navigate])

  const handleCreateAdmin = (values: any) => {
    const fullPhone = values.phoneNumber || values.adminPhone || ''
    const nationalNumber = fullPhone.replace(
      values.PhoneCountryCode || values.adminPhoneCountryCode || '',
      ''
    )

    const payload = {
      email: values.email || values.adminEmail,
      token: token,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: nationalNumber,
      departmentId: values.department,
      countryCode: values.PhoneCountryCode,
      jobTitle: values.jobTitle,
      orgName: values.organizationName,
      orgWebsite: values.website,
      orgDescription: values.description,
      orgAddress: values.streetAddress,
      orgCountry: values.country,
      orgCity: values.city,
      orgState: values.state,
      orgZipcode: values.postalCode,
      orgTypeId: values.organizationTypes,
      password: values.password,
      timeZone: values.timeZone,
    }
    createUser(payload)
  }

  const onSubmit = (value: any) => {
    handleCreateAdmin(value)
  }
  const getFieldError = (fieldName: keyof TFormSchema) => {
    return errors[fieldName]?.message
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <div className='mx-auto w-full max-w-4xl'>
        <Card className='shadow-lg'>
          {isLoading ? (
            <div>Loading ..</div>
          ) : (
            <CardContent className='p-8'>
              <div className='mb-8'>
                <div className='mb-4 flex items-center justify-between'>
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                        step <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <div className='h-2 w-full rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-blue-600 transition-all duration-300'
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {currentStep === 1 && (
                  <div className='space-y-6'>
                    <div className='mb-6 text-center'>
                      <h2 className='text-3xl font-bold text-gray-900'>
                        Personal Information
                      </h2>
                      <p className='mt-2 text-gray-600'>
                        Tell us about yourself
                      </p>
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='firstName'>
                          First Name <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                          name='firstName'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder='Enter first name'
                              className={
                                getFieldError('firstName')
                                  ? 'border-red-500'
                                  : ''
                              }
                            />
                          )}
                        />
                        {getFieldError('firstName') && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('firstName')}
                          </p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='lastName'>
                          Last Name <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                          name='lastName'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder='Enter last name'
                              className={
                                getFieldError('lastName')
                                  ? 'border-red-500'
                                  : ''
                              }
                            />
                          )}
                        />
                        {getFieldError('lastName') && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('lastName')}
                          </p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='email'>
                          Email <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                          name='email'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id='email'
                              type='email'
                              placeholder='admin@company.com'
                              className={
                                getFieldError('email') ? 'border-red-500' : ''
                              }
                            />
                          )}
                        />
                        {getFieldError('email') && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('email')}
                          </p>
                        )}
                        <p className='text-xs text-gray-500'>
                          This email was provided in your invitation
                        </p>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='phoneNumber'>
                          Phone <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                          name='phoneNumber'
                          control={control}
                          render={({ field }) => (
                            <PhoneInput
                              {...field}
                              international
                              countryCallingCodeEditable={false}
                              defaultCountry='IN'
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                                const phoneNumber = parsePhoneNumberFromString(
                                  value || ''
                                )
                                if (phoneNumber) {
                                  setValue(
                                    'PhoneCountryCode',
                                    `+${phoneNumber.countryCallingCode}`,
                                    {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    }
                                  )
                                } else {
                                  setValue('PhoneCountryCode', '', {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  })
                                }
                              }}
                              className={`w-full rounded-md border px-3 py-2 ${
                                getFieldError('phoneNumber')
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                            />
                          )}
                        />
                        {getFieldError('phoneNumber') && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('phoneNumber')}
                          </p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='jobTitle'>
                          Job Title <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                          name='jobTitle'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder='e.g., IT Director, Operations Manager'
                              className={
                                getFieldError('jobTitle')
                                  ? 'border-red-500'
                                  : ''
                              }
                            />
                          )}
                        />
                        {getFieldError('jobTitle') && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('jobTitle')}
                          </p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='department'>Department </Label>
                        <Controller
                          name='department'
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className={`w-full ${
                                  getFieldError('department')
                                    ? 'border-red-500'
                                    : ''
                                }`}
                              >
                                <SelectValue placeholder='Select department' />
                              </SelectTrigger>
                              <SelectContent className='z-50 !w-full'>
                                {department.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={String(option.value)}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {getFieldError('department') && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('department')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='space-y-4'>
                      {/* Password Field */}
                      <div className='space-y-4'>
                        {/* Password Field */}
                        <div className='space-y-2'>
                          <div className='flex items-center space-x-2'>
                            <Label htmlFor='password'>
                              Password <span className='text-red-500'>*</span>
                            </Label>
                            <div className='group relative'>
                              <svg
                                className='h-4 w-4 cursor-help text-gray-400'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <circle cx='12' cy='12' r='10'></circle>
                                <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'></path>
                                <path d='M12 17h.01'></path>
                              </svg>
                              <div className='pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-gray-800 px-3 py-2 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                                <div className='text-center'>
                                  <p className='mb-1 font-semibold'>
                                    Password Requirements:
                                  </p>
                                  <ul className='space-y-1 text-left'>
                                    <li>• Minimum 8 characters</li>
                                    <li>
                                      • At least one uppercase letter (A-Z)
                                    </li>
                                    <li>
                                      • At least one lowercase letter (a-z)
                                    </li>
                                    <li>• At least one number (0-9)</li>
                                    <li>
                                      • At least one special character
                                      (!@#$%^&*)
                                    </li>
                                  </ul>
                                </div>
                                <div className='absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent border-t-gray-800'></div>
                              </div>
                            </div>
                          </div>

                          <div className='relative'>
                            <Controller
                              name='password'
                              control={control}
                              rules={{
                                required: 'Password is required',
                                validate: (value) => {
                                  try {
                                    passwordSchema.parse(value)
                                    return true
                                  } catch (error) {
                                    if (
                                      typeof error === 'object' &&
                                      error !== null &&
                                      'errors' in error &&
                                      Array.isArray((error as any).errors)
                                    ) {
                                      return (
                                        (error as any).errors[0]?.message ||
                                        'Invalid password'
                                      )
                                    }
                                    return 'Invalid password'
                                  }
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                   placeholder="Enter your password"
                                  id='password'
                                  type={showPassword ? 'text' : 'password'}
                                  className={
                                    getFieldError('password')
                                      ? 'border-red-500 pr-10'
                                      : 'pr-10'
                                  }
                                />
                              )}
                            />

                            {/* Eye Icon for Password */}
                            <button
                              type='button'
                              className='absolute inset-y-0 right-0 flex items-center pr-3'
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <svg
                                  className='h-5 w-5 text-gray-400 hover:text-gray-600'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className='h-5 w-5 text-gray-400 hover:text-gray-600'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                  />
                                </svg>
                              )}
                            </button>
                          </div>

                          {/* Password Strength Indicator */}
                          {watch('password') && (
                            <div className='space-y-2'>
                              <div className='flex items-center space-x-2'>
                                <div className='h-2 flex-1 rounded-full bg-gray-200'>
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${checkPasswordStrength(watch('password')).color}`}
                                    style={{
                                      width: `${(checkPasswordStrength(watch('password')).strength / 5) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                                <span
                                  className={`text-xs font-medium ${
                                    checkPasswordStrength(watch('password'))
                                      .label === 'Strong'
                                      ? 'text-green-600'
                                      : checkPasswordStrength(watch('password'))
                                            .label === 'Medium'
                                        ? 'text-yellow-600'
                                        : 'text-red-600'
                                  }`}
                                >
                                  {
                                    checkPasswordStrength(watch('password'))
                                      .label
                                  }
                                </span>
                              </div>

                              {/* Password Requirements Checklist */}
                              <div className='space-y-1'>
                                {[
                                  {
                                    regex: /.{8,}/,
                                    label: 'At least 8 characters',
                                  },
                                  {
                                    regex: /[A-Z]/,
                                    label: 'One uppercase letter',
                                  },
                                  {
                                    regex: /[a-z]/,
                                    label: 'One lowercase letter',
                                  },
                                  { regex: /[0-9]/, label: 'One number' },
                                  {
                                    regex: /[!@#$%^&*(),.?":{}|<>]/,
                                    label: 'One special character',
                                  },
                                ].map((check, index) => (
                                  <div
                                    key={index}
                                    className='flex items-center space-x-2'
                                  >
                                    <div
                                      className={`h-3 w-3 rounded-full ${
                                        check.regex.test(watch('password'))
                                          ? 'bg-green-500'
                                          : 'bg-gray-300'
                                      }`}
                                    >
                                      {check.regex.test(watch('password')) && (
                                        <svg
                                          className='h-3 w-3 text-white'
                                          fill='currentColor'
                                          viewBox='0 0 20 20'
                                        >
                                          <path
                                            fillRule='evenodd'
                                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                            clipRule='evenodd'
                                          ></path>
                                        </svg>
                                      )}
                                    </div>
                                    <span
                                      className={`text-xs ${
                                        check.regex.test(watch('password'))
                                          ? 'text-green-600'
                                          : 'text-gray-500'
                                      }`}
                                    >
                                      {check.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {getFieldError('password') && (
                            <p className='text-sm text-red-500'>
                              {getFieldError('password')}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className='space-y-2'>
                          <Label htmlFor='confirmPassword'>
                            Confirm Password{' '}
                            <span className='text-red-500'>*</span>
                          </Label>

                          <div className='relative'>
                            <Controller
                              name='confirmPassword'
                              control={control}
                              rules={{
                                required: 'Please confirm your password',
                                validate: (value) => {
                                  const password = watch('password')
                                  if (value !== password) {
                                    return "Passwords don't match"
                                  }
                                  return true
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id='confirmPassword'
                                  placeholder="Enter your confirm password"
                                  type={
                                    showConfirmPassword ? 'text' : 'password'
                                  }
                                  className={
                                    getFieldError('confirmPassword')
                                      ? 'border-red-500 pr-10'
                                      : field.value &&
                                          field.value === watch('password')
                                        ? 'border-green-500 pr-10'
                                        : 'pr-10'
                                  }
                                />
                              )}
                            />

                            {/* Eye Icon for Confirm Password */}
                            <button
                              type='button'
                              className='absolute inset-y-0 right-0 flex items-center pr-3'
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <svg
                                  className='h-5 w-5 text-gray-400 hover:text-gray-600'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className='h-5 w-5 text-gray-400 hover:text-gray-600'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                  />
                                </svg>
                              )}
                            </button>
                          </div>

                          {/* Password Match Indicator */}
                          {watch('confirmPassword') && (
                            <div className='flex items-center space-x-2'>
                              {watch('confirmPassword') ===
                              watch('password') ? (
                                <>
                                  <svg
                                    className='h-4 w-4 text-green-500'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                  >
                                    <path
                                      fillRule='evenodd'
                                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                      clipRule='evenodd'
                                    ></path>
                                  </svg>
                                  <span className='text-xs text-green-600'>
                                    Passwords match
                                  </span>
                                </>
                              ) : (
                                <>
                                  <svg
                                    className='h-4 w-4 text-red-500'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                  >
                                    <path
                                      fillRule='evenodd'
                                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                      clipRule='evenodd'
                                    ></path>
                                  </svg>
                                  <span className='text-xs text-red-600'>
                                    Passwords don't match
                                  </span>
                                </>
                              )}
                            </div>
                          )}

                          {getFieldError('confirmPassword') && (
                            <p className='text-sm text-red-500'>
                              {getFieldError('confirmPassword')}
                            </p>
                          )}
                          <p className='text-xs text-gray-500'>
                            Please re-enter your password to confirm
                          </p>
                        </div>
                      </div>
                    </div>
                    <Alert>
                      <Building className='h-4 w-4' />
                      <AlertDescription>
                        You are registering as an admin for{' '}
                        <strong>{watch('organizationName')}</strong>. This
                        organization was set up by the Super Admin and you were
                        invited to manage it.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className='space-y-8'>
                    <div className='text-center'>
                      <h2 className='text-3xl font-bold text-gray-900'>
                        Organization Details
                      </h2>
                      <p className='mt-2 text-gray-600'>
                        Tell us about your organization
                      </p>
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div>
                        <Label htmlFor='organizationName'>
                          Organization Name{' '}
                          <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                          name='organizationName'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className={`mt-1 ${getFieldError('organizationName') ? 'border-red-500' : ''}`}
                              placeholder='Enter organization name'
                            />
                          )}
                        />
                        {getFieldError('organizationName') && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('organizationName')}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='organizationTypes'>
                          Organization Type{' '}
                          <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                          name='organizationTypes'
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className={`mt-1 w-full ${
                                  getFieldError('organizationTypes')
                                    ? 'border-red-500'
                                    : ''
                                }`}
                              >
                                <SelectValue placeholder='Select type' />
                              </SelectTrigger>
                              <SelectContent className='z-50 w-full'>
                                {organizationTypes.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={String(option.value)}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {getFieldError('organizationTypes') && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('organizationTypes')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor='timeZone'>
                        TimeZone <span className='text-red-500'>*</span>
                      </Label>
                      <Controller
                        name='timeZone'
                        control={control}
                        render={({ field }) => {
                          const selectedOption = TimeZoneList.find(
                            (option) => option.value === field.value
                          )
                          return (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className={`mt-1 w-full ${
                                  getFieldError('timeZone')
                                    ? 'border-red-500'
                                    : ''
                                }`}
                              >
                                <SelectValue placeholder='Select timezone'>
                                  {selectedOption ? selectedOption.label : null}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className='z-50 w-full'>
                                {TimeZoneList.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )
                        }}
                      />
                      {getFieldError('timeZone') && (
                        <p className='text-sm text-red-500'>
                          {getFieldError('timeZone')}
                        </p>
                      )}
                    </div>
                    {/* Website field moved outside grid for full width */}
                    <div>
                      <Label htmlFor='website'>Website</Label>
                      <Controller
                        name='website'
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={`mt-1 ${
                              getFieldError('website')
                                ? 'border-red-500'
                                : 'border-gray-300'
                            }`}
                            placeholder='https://www.example.com'
                          />
                        )}
                      />
                      {getFieldError('website') && (
                        <p className='text-sm text-red-500'>
                          {getFieldError('website')}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor='description'>
                        Organization Description{' '}
                      </Label>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={4}
                            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              getFieldError('description')
                                ? 'border-red-500'
                                : 'border-gray-300'
                            }`}
                            placeholder='Brief description of your organization...'
                          />
                        )}
                      />
                      {getFieldError('description') && (
                        <p className='text-sm text-red-500'>
                          {getFieldError('description')}
                        </p>
                      )}
                    </div>
                    <Alert>
                      <Building />
                      <AlertDescription>
                        You are registering as an admin for{' '}
                        <strong>{watch('organizationName')}</strong>. This
                        organization was set up by the Super Admin and you were
                        invited to manage it.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className='space-y-6'>
                    <div className='text-center'>
                      <h2 className='text-3xl font-bold text-gray-900'>
                        Address Information
                      </h2>
                      <p className='mt-2 text-gray-600'>
                        Where is your organization located?
                      </p>
                    </div>

                    <div className='space-y-6'>
                      <div>
                        <Label htmlFor='streetAddress'>
                          Street Address <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                          name='streetAddress'
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className={`mt-1 ${getFieldError('streetAddress') ? 'border-red-500' : ''}`}
                              placeholder='Enter street address'
                            />
                          )}
                        />
                        {getFieldError('streetAddress') && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('streetAddress')}
                          </p>
                        )}
                      </div>

                      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div>
                          <Label htmlFor='city'>
                            City <span className='text-red-500'>*</span>
                          </Label>
                          <Controller
                            name='city'
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                className={`mt-1 ${getFieldError('city') ? 'border-red-500' : ''}`}
                                placeholder='Enter city'
                              />
                            )}
                          />
                          {getFieldError('city') && (
                            <p className='text-sm text-red-500'>
                              {getFieldError('city')}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor='state'>
                            State/Province{' '}
                            <span className='text-red-500'>*</span>
                          </Label>
                          <Controller
                            name='state'
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                className={`mt-1 ${getFieldError('state') ? 'border-red-500' : ''}`}
                                placeholder='Enter state/province'
                              />
                            )}
                          />
                          {getFieldError('state') && (
                            <p className='text-sm text-red-500'>
                              {getFieldError('state')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div>
                          <Label htmlFor='postalCode'>
                            ZIP/Postal Code{' '}
                            <span className='text-red-500'>*</span>
                          </Label>
                          <Controller
                            name='postalCode'
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                className={`mt-1 ${getFieldError('postalCode') ? 'border-red-500' : ''}`}
                                placeholder='Enter ZIP/postal code'
                              />
                            )}
                          />
                          {getFieldError('postalCode') && (
                            <p className='text-sm text-red-500'>
                              {getFieldError('postalCode')}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor='country'>
                            Country <span className='text-red-500'>*</span>
                          </Label>
                          <Controller
                            name='country'
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className={`mt-1 w-full ${
                                    getFieldError('country')
                                      ? 'border-red-500'
                                      : ''
                                  }`}
                                >
                                  <SelectValue placeholder='Select country' />
                                </SelectTrigger>
                                <SelectContent className='z-50 w-full'>
                                  {countryOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={String(option.value)}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {getFieldError('country') && (
                            <p className='text-sm text-red-500'>
                              {getFieldError('country')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Alert>
                      <Building />
                      <AlertDescription>
                        You are registering as an admin for{' '}
                        <strong>{watch('organizationName')}</strong>. This
                        organization was set up by the Super Admin and you were
                        invited to manage it.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className='space-y-8'>
                    <div className='text-center'>
                      <h2 className='text-3xl font-bold text-gray-900'>
                        Review & Confirm
                      </h2>
                      <p className='mt-2 text-gray-600'>
                        Please review your information before submitting
                      </p>
                    </div>

                    <div className='rounded-md bg-gray-100 p-4'>
                      <h3 className='mb-2 text-lg font-semibold'>
                        Organization Details
                      </h3>
                      <div className='grid grid-cols-1 gap-x-4 gap-y-2 text-sm text-gray-700 md:grid-cols-2'>
                        <div>
                          <strong>Name:</strong> {watch('organizationName')}
                        </div>
                        <div>
                          <strong>Department:</strong>{' '}
                          {department.find(
                            (d) => d.value === watch('department')
                          )?.label || '-'}
                        </div>
                        <div>
                          <strong>Type:</strong>{' '}
                          {organizationTypes.find(
                            (t) => t.value === watch('organizationTypes')
                          )?.label || '-'}
                        </div>
                        <div>
                          <strong>website:</strong> {watch('website')}
                        </div>
                      </div>
                    </div>

                    <div className='rounded-md bg-gray-100 p-4'>
                      <h3 className='mb-2 text-lg font-semibold'>
                        Admin Contact
                      </h3>
                      <div className='grid grid-cols-1 gap-x-4 gap-y-2 text-sm text-gray-700 md:grid-cols-2'>
                        <div>
                          <strong>Name:</strong> {watch('firstName')}{' '}
                          {watch('lastName')}
                        </div>
                        <div>
                          <strong>Email:</strong> {watch('email')}
                        </div>
                        <div>
                          <strong>Phone:</strong> {watch('phoneNumber')}
                        </div>
                        <div>
                          <strong>Title:</strong> {watch('jobTitle')}
                        </div>
                      </div>
                    </div>
                    <div className='rounded-md bg-gray-100 p-4'>
                      <h3 className='mb-2 text-lg font-semibold'>
                        Address Information
                      </h3>
                      <div className='grid grid-cols-1 gap-x-4 gap-y-2 text-sm text-gray-700 md:grid-cols-2'>
                        <div>
                          <strong>Street Address:</strong>{' '}
                          {watch('streetAddress')}
                        </div>
                        <div>
                          <strong>City:</strong> {watch('city')}
                        </div>
                        <div>
                          <strong>State/Province:</strong> {watch('state')}
                        </div>
                        <div>
                          <strong>ZIP/Postal Code:</strong>{' '}
                          {watch('postalCode')}
                        </div>
                        <div>
                          <strong>Country:</strong>{' '}
                          {countryOptions.find(
                            (c) => c.value === watch('country')
                          )?.label || '-'}
                        </div>
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Controller
                          name='terms'
                          control={control}
                          render={({ field }) => (
                            <label className='flex items-center space-x-2 text-sm'>
                              <input
                                type='checkbox'
                                className='form-checkbox'
                                checked={field.value}
                                onChange={field.onChange}
                              />
                              <span>
                                I agree to the{' '}
                                <a href='#' className='text-blue-600 underline'>
                                  Terms of Service
                                </a>
                              </span>
                            </label>
                          )}
                        />
                        {getFieldError('terms') && formState.isSubmitted && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('terms')}
                          </p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Controller
                          name='privacy'
                          control={control}
                          render={({ field }) => (
                            <label className='flex items-center space-x-2 text-sm'>
                              <input
                                type='checkbox'
                                className='form-checkbox'
                                checked={field.value}
                                onChange={field.onChange}
                              />
                              <span>
                                I agree to the{' '}
                                <a href='#' className='text-blue-600 underline'>
                                  Privacy Policy
                                </a>
                              </span>
                            </label>
                          )}
                        />
                        {getFieldError('privacy') && formState.isSubmitted && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('privacy')}
                          </p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Controller
                          name='consent'
                          control={control}
                          render={({ field }) => (
                            <label className='flex items-center space-x-2 text-sm'>
                              <input
                                type='checkbox'
                                className='form-checkbox'
                                checked={field.value}
                                onChange={field.onChange}
                              />
                              <span>
                                I consent to data processing as described in our{' '}
                                <a href='#' className='text-blue-600 underline'>
                                  Data Processing Agreement
                                </a>
                              </span>
                            </label>
                          )}
                        />
                        {getFieldError('consent') && formState.isSubmitted && (
                          <p className='text-sm text-red-500'>
                            {getFieldError('consent')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Separator className='my-8' />

                <div className='flex justify-between'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className='px-8'
                  >
                    Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button type='button' onClick={handleNext} className='px-8'>
                      Next
                    </Button>
                  ) : (
                    <Button type='submit' className='px-8'>
                      Submit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}

export default RegistrationForm
