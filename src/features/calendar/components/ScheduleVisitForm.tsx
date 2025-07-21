import { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import moment from 'moment-timezone'
import { useSelectOptions } from '@/hooks/use-select-option'
import { LocationSearchBox } from '@/components/ui/LocationSearchBox'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SimpleDatePicker } from '@/components/ui/datepicker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Main } from '@/components/layout/main'
import { useGetAllRolesForDropdown } from '@/features/UserManagement/services/Roles.hook'
import { useGetUsersForDropdown } from '@/features/buyers/services/users.hook'
import { formSchema, TFormSchema } from '../data/schema'
import {
  useCreateVisits,
  useUpdateVisits,
  useGetVisitByID,
  useGetAllCustomer,
} from '../services/calendar-view.hook'

interface ScheduleVisitFormProps {
  onClose: () => void
}

export function ScheduleVisitForm({ onClose }: ScheduleVisitFormProps) {
  const params = useParams({ strict: false })
  const visitId = params.id // Get visit ID from URL parameters
  const isEditMode = !!visitId

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: '',
      customer: '',
      roleId: '',
      salesRep: '',
      date: '',
      time: '',
      location: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      latitude: undefined,
      longitude: undefined,
      reportType: '',
      priority: 'Medium',
      duration: '1',
      preparationNotes: '',
    },
  })

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = form

  const roleId = watch('roleId')
  const customerId = watch('customer')

  // Fetch visit data by ID when in edit mode
  const {
    data: visitData,
    isLoading: isVisitLoading,
    error: visitError,
  } = useGetVisitByID(visitId || '', isEditMode)

  // useEffect(() => {
  //   if (visitData && isEditMode) {
  //     const formatDateForInput = (dateString: string) => {
  //       if (!dateString) return ''
  //       return moment(dateString).format('YYYY-MM-DD')
  //     }

  //     const formatTimeForInput = (timeString: string) => {
  //       if (!timeString) return ''
  //       return moment(timeString, 'h:mm A').format('HH:mm')
  //     }
  //     console.log(
  //       'visitData.salesRepresentativeUser',
  //       visitData.salesRepresentativeUser
  //     )
  //     console.log('visitData.priority', visitData.priority)

  //     const formData = {
  //       purpose: visitData.purpose || '',
  //       customer: visitData.customerId || '',
  //       roleId: String(visitData.salesRepresentativeUser?.roleId) ?? '',
  //       salesRep: visitData.salesRepresentativeUser?.id || '',
  //       date: formatDateForInput(visitData.date),
  //       time: formatTimeForInput(visitData.time),
  //       location: visitData.location || visitData.streetAddress || '',
  //       address: visitData.streetAddress || '',
  //       city: visitData.city || '',
  //       state: visitData.state || '',
  //       zipCode: visitData.zipCode ? String(visitData.zipCode) : '',
  //       country: visitData.country || '',
  //       latitude: visitData.latitude || undefined,
  //       longitude: visitData.longitude || undefined,
  //       reportType: visitData.reportType || '',
  //       priority: visitData.priority ?? 'Medium',
  //       duration: visitData.duration ? String(visitData.duration) : '1',
  //       preparationNotes: visitData.preparationNotes || '',
  //     }
  //     visitData && form.reset(formData)
  //   } else if (!isEditMode) {
  //     reset()
  //   }
  // }, [visitData, isEditMode])
  useEffect(() => {
    // Reset form when switching between edit and create modes
    if (!isEditMode) {
      reset()
      return
    }

    // Handle edit mode: Populate form with visitData
    if (visitData) {
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return ''
        return moment(dateString).format('YYYY-MM-DD')
      }

      const formatTimeForInput = (timeString: string) => {
        if (!timeString) return ''
        return moment(timeString, 'h:mm A').format('HH:mm')
      }

      const formData: TFormSchema = {
        purpose: visitData.purpose || '',
        customer: visitData.customerId || '',
        roleId: String(visitData.salesRepresentativeUser?.roleId) || '',
        salesRep: visitData.salesRepresentativeUser?.id || '',
        date: formatDateForInput(visitData.date),
        time: formatTimeForInput(visitData.time),
        location: visitData.location || visitData.streetAddress || '',
        address: visitData.streetAddress || '',
        city: visitData.city || '',
        state: visitData.state || '',
        zipCode: visitData.zipCode ? String(visitData.zipCode) : '',
        country: visitData.country || '',
        latitude: visitData.latitude || undefined,
        longitude: visitData.longitude || undefined,
        reportType: visitData.reportType || '',
        priority:
          visitData.priority &&
          ['Low', 'Medium', 'High'].includes(visitData.priority)
            ? visitData.priority
            : 'Medium',
        duration: visitData.duration ? String(visitData.duration) : '1',
        preparationNotes: visitData.preparationNotes || '',
      }

      reset(formData) // Reset form with visitData
    }
  }, [visitData, isEditMode, reset, setValue])

  const { data: customerList = [], isLoading: isCustomersLoading } =
    useGetAllCustomer()

  const customerOptions = customerList.map((customer: any) => ({
    value: customer.customerId,
    label: customer.companyName,
  }))
  const { data: allRoles, isLoading: isRolesLoading } =
    useGetAllRolesForDropdown()
  const roles = useSelectOptions<any>({
    listData: allRoles ?? [],
    labelKey: 'roleName',
    valueKey: 'roleId',
  })

  const { data: userList = [], isLoading: isUsersLoading } =
    useGetUsersForDropdown({
      roleId: roleId,
      enabled: !!roleId,
    })

  const enhancedUserList = userList.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
  }))

  const users = useSelectOptions<any>({
    listData: enhancedUserList,
    labelKey: 'fullName',
    valueKey: 'id',
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }))

  // Auto-fill location when customer is selected (only for new visits)
  // useEffect(() => {
  //   if (customerId && !isEditMode) {
  //     const selectedCustomer = customerList.find(
  //       (customer: any) => customer.customerId === customerId
  //     )
  //     if (selectedCustomer) {
  //       const address = [
  //         selectedCustomer.streetAddress,
  //         selectedCustomer.city,
  //         selectedCustomer.state,
  //         selectedCustomer.country,
  //         selectedCustomer.zipCode,
  //       ]
  //         .filter(Boolean)
  //         .join(', ')
  //       setValue('location', address)
  //       setValue('address', selectedCustomer.streetAddress || '')
  //       setValue('city', selectedCustomer.city || '')
  //       setValue('state', selectedCustomer.state || '')
  //       setValue('zipCode', String(selectedCustomer.zipCode) || '')
  //       setValue('country', selectedCustomer.country || '')
  //       setValue('latitude', selectedCustomer.latitude)
  //       setValue('longitude', selectedCustomer.longitude)
  //     }
  //   }
  // }, [customerId, customerList, setValue, isEditMode])
  // console.log('roleId', roleId)

  // useEffect(() => {
  //   form.setValue('roleId', roleId)
  // }, [roleId])
  // useEffect(() => {
  //   visitData?.priority && form.setValue('priority', visitData?.priority)
  // }, [visitData, form])
  useEffect(() => {
    // Update customer-related fields when customerId changes
    if (customerId && !isEditMode && customerList?.length) {
      const selectedCustomer = customerList.find(
        (customer: any) => customer.customerId === customerId
      )
      if (selectedCustomer) {
        const address = [
          selectedCustomer.streetAddress,
          selectedCustomer.city,
          selectedCustomer.state,
          selectedCustomer.country,
          selectedCustomer.zipCode,
        ]
          .filter(Boolean)
          .join(', ')

        setValue('location', address)
        setValue('address', selectedCustomer.streetAddress || '')
        setValue('city', selectedCustomer.city || '')
        setValue('state', selectedCustomer.state || '')
        setValue('zipCode', String(selectedCustomer.zipCode) || '')
        setValue('country', selectedCustomer.country || '')
        setValue('latitude', selectedCustomer.latitude || undefined)
        setValue('longitude', selectedCustomer.longitude || undefined)
        setValue('customer', selectedCustomer.customerId || '')
      }
    }
  }, [customerId, customerList, setValue, isEditMode])

  const priorityId = watch('priority')
  console.log('priorityId', priorityId)

  useEffect(() => {
    // Update roleId when it changes
    if (roleId) {
      setValue('roleId', String(roleId))
    }
  }, [roleId, setValue])
  useEffect(() => {
    if (priorityId) {
      form.setValue('priority', priorityId)
    }
  }, [priorityId])

  // Optional: Log for debugging
  useEffect(() => {
    console.log('Form Values:', watch())
    console.log('Errors:', errors)
  }, [watch, errors])

  const onSubmit = (data: any) => {
    const formattedTime = moment(data.time, 'HH:mm').format('h:mm A')
    let payload = {}

    if (isEditMode) {
      payload = {
        date: moment(data.date).format('DD-MM-YYYY'),
        time: formattedTime,
        duration: parseInt(data.duration),
        purpose: data.purpose,
        customerId: data.customer,
        priority: data.priority,
        streetAddress: data.location || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode ? parseInt(data.zipCode) : 0,
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        country: data.country || '',
        preparationNotes: data.preparationNotes || '',
      }
      updateVisit(payload)
    } else {
      payload = {
        salesRepresentativeUserId: data.salesRep,
        date: moment(data.date).format('DD-MM-YYYY'),
        visits: [
          {
            time: formattedTime,
            duration: parseInt(data.duration),
            purpose: data.purpose,
            customerId: data.customer,
            priority: data.priority,
            streetAddress: data.location || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode ? parseInt(data.zipCode) : 0,
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            country: data.country || '',
            preparationNotes: data.preparationNotes || '',
          },
        ],
      }
      createVisit(payload)
    }
  }

  const { mutate: createVisit, isPending: isCreateLoading } =
    useCreateVisits(onClose)

  const { mutate: updateVisit, isPending: isUpdateLoading } = useUpdateVisits(
    visitId || '',
    onClose
  )

  const isLoading = isCreateLoading || isUpdateLoading
  const showLoadingSpinner = isEditMode && isVisitLoading
  const roleValueId = form.getValues('roleId')
  console.log('roleValueId', roleValueId)

  return (
    <Main className='flex flex-col gap-6 p-6'>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? 'Edit Visit' : 'Schedule New Visit'}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Update the visit details below'
              : 'Fill in the details to schedule a new visit'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showLoadingSpinner ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-center'>
                <div className='border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2'></div>
                <p className='text-muted-foreground mt-2 text-sm'>
                  Loading visit details...
                </p>
              </div>
            </div>
          ) : visitError ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-center'>
                <AlertCircle className='mx-auto h-8 w-8 text-red-500' />
                <p className='mt-2 text-sm text-red-500'>
                  Error loading visit details: {visitError.message}
                </p>
              </div>
            </div>
          ) : (
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='purpose'>
                      Purpose of Visit <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='purpose'
                      control={control}
                      render={({ field }) => (
                        <Input
                          id='purpose'
                          placeholder='Enter purpose of visit'
                          {...field}
                        />
                      )}
                    />
                    {errors.purpose && (
                      <p className='flex items-center gap-1 text-xs text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.purpose.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='customer'>
                      Customer <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='customer'
                      control={control}
                      render={({ field }) => (
                        <SearchableSelect
                          options={customerOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={
                            isCustomersLoading
                              ? 'Loading...'
                              : 'Select customer...'
                          }
                          disabled={isCustomersLoading}
                        />
                      )}
                    />
                    {errors.customer && (
                      <p className='text-2xs flex items-center gap-1 text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.customer.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='roleId'>
                      Role <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='roleId'
                      control={control}
                      render={({ field }) => (
                        <ShadSelect
                          value={roleId}
                          onValueChange={field.onChange}
                          disabled={isRolesLoading}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue
                              placeholder={
                                isRolesLoading ? 'Loading...' : 'Select role...'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className='!w-full'>
                            {roles.map((option) => {
                              console.log('option', option)

                              return (
                                <SelectItem
                                  key={option.value}
                                  value={String(option.value)}
                                >
                                  {option.label}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </ShadSelect>
                      )}
                    />
                    {errors.roleId && (
                      <p className='flex items-center gap-1 text-xs text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.roleId.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='salesRep'>
                      Sales Representative{' '}
                      <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='salesRep'
                      control={control}
                      render={({ field }) => (
                        <SearchableSelect
                          options={users}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={
                            isUsersLoading
                              ? 'Loading...'
                              : !roleId
                                ? 'Select a role first'
                                : 'Select user...'
                          }
                          disabled={isUsersLoading || !roleId}
                        />
                      )}
                    />
                    {errors.salesRep && (
                      <p className='flex items-center gap-1 text-xs text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.salesRep.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='w-full space-y-2'>
                    <Label htmlFor='date'>
                      Date <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='date'
                      control={control}
                      render={({ field }) => (
                        <SimpleDatePicker
                          date={field.value || ''}
                          setDate={(date: string) => field.onChange(date)}
                        />
                      )}
                    />
                    {errors.date && (
                      <p className='text-sm text-red-500'>
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='time'>
                      Time <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='time'
                      control={control}
                      render={({ field }) => (
                        <Input type='time' id='time' {...field} />
                      )}
                    />
                    {errors.time && (
                      <p className='text-sm text-red-500'>
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='location'>
                    Location <span className='text-red-500'>*</span>
                  </Label>
                  <Controller
                    name='location'
                    control={control}
                    render={({ field }) => (
                      <LocationSearchBox
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        onSelectLocation={(place) => {
                          if (place && place.formatted_address) {
                            setValue('location', place.formatted_address)
                            if (place.geometry && place.geometry.location) {
                              setValue(
                                'latitude',
                                place.geometry.location.lat()
                              )
                              setValue(
                                'longitude',
                                place.geometry.location.lng()
                              )
                            }
                            if (place.address_components) {
                              let street = ''
                              let city = ''
                              let state = ''
                              let zipCode = ''
                              let country = ''
                              place.address_components.forEach((component) => {
                                const types = component.types
                                if (
                                  types.includes('street_number') ||
                                  types.includes('route')
                                ) {
                                  street = street
                                    ? `${street} ${component.long_name}`
                                    : component.long_name
                                }
                                if (types.includes('locality')) {
                                  city = component.long_name
                                }
                                if (
                                  types.includes('administrative_area_level_1')
                                ) {
                                  state = component.long_name
                                }
                                if (types.includes('postal_code')) {
                                  zipCode = component.long_name
                                }
                                if (types.includes('country')) {
                                  country = component.long_name
                                }
                              })
                              if (street) setValue('address', street)
                              if (city) setValue('city', city)
                              if (state) setValue('state', state)
                              if (zipCode) setValue('zipCode', zipCode)
                              if (country) setValue('country', country)
                            }
                          }
                        }}
                      />
                    )}
                  />
                  {errors.location && (
                    <p className='text-sm text-red-500'>
                      {errors.location.message}
                    </p>
                  )}
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='priority'>
                      Priority <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='priority'
                      control={control}
                      render={({ field }) => (
                        console.log('field.value', field.value),
                        (
                          <ShadSelect
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id='priority' className='w-full'>
                              <SelectValue placeholder='Select Priority' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='High'>High</SelectItem>
                              <SelectItem value='Medium'>Medium</SelectItem>
                              <SelectItem value='Low'>Low</SelectItem>
                            </SelectContent>
                          </ShadSelect>
                        )
                      )}
                    />
                    {errors.priority && (
                      <p className='text-sm text-red-500'>
                        {errors.priority.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='duration'>
                      Duration (hours) <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='duration'
                      control={control}
                      render={({ field }) => (
                        <Input id='duration' type='number' min='1' {...field} />
                      )}
                    />
                    {errors.duration && (
                      <p className='text-sm text-red-500'>
                        {errors.duration.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='preparationNotes'>Preparation Notes</Label>
                  <Controller
                    name='preparationNotes'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='preparationNotes'
                        placeholder='Any special preparation or notes for the visit...'
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className='flex justify-end space-x-2'>
                  <Button type='button' variant='outline' onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isLoading}>
                    {isLoading
                      ? 'Saving...'
                      : isEditMode
                        ? 'Update Visit'
                        : 'Schedule Visit'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}
        </CardContent>
      </Card>
    </Main>
  )
}

export default ScheduleVisitForm
