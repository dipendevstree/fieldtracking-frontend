import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { AlertCircle, Mail } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useSelectOptions } from '@/hooks/use-select-option'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TreeSelect from '@/components/ui/multiTreeSelect'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CustomButton from '@/components/shared/custom-button'
import { formSchema, TFormSchema } from '../data/schema'
import {
  useGetEmployeeRange,
  useGetIndustry,
  useGetMenu,
} from '../services/organization.hook'

interface Props {
  currentRow?: any
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TFormSchema) => void
}

export function OrganizationActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: Props) {
  const isEdit = !!currentRow
  const { data: employeeRangeList } = useGetEmployeeRange()
  const { data: industryList } = useGetIndustry()
  const { data: rawMenuList } = useGetMenu()
  const menuList = rawMenuList?.filter(
    (menu: any) => menu.menuKey !== 'super_admin'
  )

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      industry: '',
      employeeRange: '',
      isSeparateSchema: false,
      adminName: '',
      adminPhone: '',
      adminEmail: '',
      adminJobTitle: '',
      adminPhoneCountryCode: '',
      menuIds: [],
    },
  })

  const { control, formState, setValue, getValues, reset } = form
  const { errors } = formState

  const onSubmit = (values: TFormSchema) => {
    console.log('Form submitted with values:', values)
    onSubmitValues(values)
  }

  const onError = (error: any) => {
    console.log('Form validation error:', error)
  }

  const employeeRange = useSelectOptions<any>({
    listData: employeeRangeList ?? [],
    labelKey: 'employeeRange',
    valueKey: 'employeeRangeId',
  })

  const industry = useSelectOptions<any>({
    listData: industryList ?? [],
    labelKey: 'industryName',
    valueKey: 'industryId',
  })

  const buildTreeData = (menuList: any[]) => {
    if (!menuList || menuList.length === 0) return []

    const map = new Map<string, any>()
    const tree: any[] = []

    try {
      // Step 1: Initialize each node
      menuList.forEach((item) => {
        map.set(item.menuId, {
          title: item.menuName,
          value: item.menuId,
          key: item.menuId,
          children: [], // initially assign empty
        })
      })

      // Step 2: Build parent-child relationships
      menuList.forEach((item) => {
        if (item.parentMenuId) {
          const parent = map.get(item.parentMenuId)
          if (parent) {
            parent.children.push(map.get(item.menuId))
          }
        } else {
          tree.push(map.get(item.menuId))
        }
      })

      // Step 3: Clean up empty children arrays
      const cleanChildren = (nodes: any[]) => {
        return nodes.map((node) => {
          const cleanedNode = { ...node }
          if (cleanedNode.children && cleanedNode.children.length > 0) {
            cleanedNode.children = cleanChildren(cleanedNode.children)
          } else {
            delete cleanedNode.children
          }
          return cleanedNode
        })
      }

      return cleanChildren(tree)
    } catch (error) {
      console.error('Error building tree data:', error)
      return []
    }
  }

  const treeData = buildTreeData(menuList ?? [])
  console.log('menuList', menuList)

  // Initialize form values when editing - FIXED VERSION
  useEffect(() => {
    if (isEdit && currentRow && open) {
      console.log('Setting edit values:', currentRow)

      // Construct the phone number with country code if available
      const fullPhoneNumber =
        currentRow.countryCode && currentRow.phoneNumber
          ? `${currentRow.countryCode}${currentRow.phoneNumber}`
          : currentRow.phoneNumber || ''

      const editValues = {
        name: currentRow.name || currentRow.organizationName || '',
        industry: String(
          currentRow.industry?.industryId || currentRow.industryId || ''
        ),
        employeeRange: String(
          currentRow.employeeRange?.employeeRangeId ||
            currentRow.employeeRangeId ||
            ''
        ),
        isSeparateSchema:
          currentRow.isSeparateSchema || currentRow.is_separate_schema || false,
        adminName:
          currentRow.adminName ||
          currentRow.adminData?.firstName +
            ' ' +
            currentRow.adminData?.lastName ||
          '',
        adminPhone: fullPhoneNumber,
        adminEmail: currentRow.adminEmail || currentRow.adminData?.email || '',
        jobTitle: currentRow.jobTitle || '',
        adminPhoneCountryCode: currentRow.adminPhoneCountryCode || '',
        menuIds: currentRow.menuIds || [],
      }

      console.log('Constructed edit values:', editValues)
      reset(editValues)
    } else if (!isEdit && open) {
      // Reset to default values for new organization
      reset({
        name: '',
        industry: '',
        employeeRange: '',
        isSeparateSchema: false,
        adminName: '',
        adminPhone: '',
        adminEmail: '',
        adminJobTitle: '',
        adminPhoneCountryCode: '',
        menuIds: [],
      })
    }
  }, [isEdit, currentRow, open, reset])

  // Set default menu selection for new organizations
  useEffect(() => {
    if (!isEdit && treeData && treeData.length > 0 && open) {
      const currentMenuIds = getValues('menuIds')
      if (!currentMenuIds || currentMenuIds.length === 0) {
        const defaultValue = treeData[0]?.value ? [treeData[0].value] : []
        console.log('Setting default menu selection:', defaultValue)
        setValue('menuIds', defaultValue, { shouldValidate: true })
      }
    }
  }, [treeData, isEdit, open, setValue, getValues])

  const handleDialogOpenChange = (state: boolean) => {
    if (!state) {
      // Reset form when closing dialog
      reset({
        name: '',
        industry: '',
        employeeRange: '',
        isSeparateSchema: false,
        adminName: '',
        adminPhone: '',
        adminEmail: '',
        adminJobTitle: '',
        adminPhoneCountryCode: '',
        menuIds: [],
      })
    }
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className='max-h-[80vh] !max-w-4xl overflow-y-auto'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Organization</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update organization details and admin contact information.'
              : 'Set up a new organization and send invitation to the admin contact.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='user-form'
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className='space-y-4 p-0.5'
          >
            <div className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Organization Details */}
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium'>Organization Details</h4>

                  {/* Organization Name */}
                  <div className='space-y-2'>
                    <Label htmlFor='orgName'>
                      Organization Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='name'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id='orgName'
                          placeholder='Enter organization name'
                        />
                      )}
                    />
                    {errors.name && (
                      <p className='flex items-center gap-1 text-xs text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Industry */}
                  <div className='space-y-2'>
                    <Label htmlFor='industry'>
                      Industry <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='industry'
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select industry' />
                          </SelectTrigger>
                          <SelectContent className='!w-full'>
                            {industry.map((option) => (
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
                    {errors.industry && (
                      <p className='flex items-center gap-1 text-xs text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.industry.message}
                      </p>
                    )}
                  </div>

                  {/* Employee Range */}
                  <div className='space-y-2'>
                    <Label htmlFor='employeeRange'>
                      Employee Count <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='employeeRange'
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select range' />
                          </SelectTrigger>
                          <SelectContent>
                            {employeeRange.map((option) => (
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
                    {errors.employeeRange && (
                      <p className='flex items-center gap-1 text-xs text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.employeeRange.message}
                      </p>
                    )}
                  </div>

                  {/* Modules */}
                  <div className='space-y-2'>
                    <Label htmlFor='modules'>
                      Modules <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='menuIds'
                      control={control}
                      render={({ field }) => (
                        <TreeSelect
                          treeData={treeData}
                          value={field.value || []}
                          onChange={(value) => {
                            console.log('TreeSelect value changed:', value)
                            field.onChange(value)
                          }}
                          treeCheckable={true}
                          showCheckedStrategy='SHOW_ALL'
                          placeholder='Select modules'
                          className='w-full'
                          style={{ width: '100%' }}
                        />
                      )}
                    />
                    {errors.menuIds && (
                      <p className='flex items-center gap-1 text-xs text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.menuIds.message}
                      </p>
                    )}
                  </div>

                  {/* Separate Schema Checkbox */}
                  <div className='flex items-center space-x-2'>
                    <Controller
                      name='isSeparateSchema'
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <Checkbox
                          checked={value}
                          onCheckedChange={(checked) => onChange(!!checked)}
                          id='isSeparateSchema'
                          {...rest}
                        />
                      )}
                    />
                    <Label
                      htmlFor='isSeparateSchema'
                      className='text-sm font-normal'
                    >
                      Use separate schema for this organization
                    </Label>
                  </div>
                </div>

                {/* Admin Contact Details */}
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium'>Admin Contact Details</h4>

                  {/* Admin Name */}
                  <div className='space-y-2'>
                    <Label htmlFor='adminName'>
                      Admin Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='adminName'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id='adminName'
                          placeholder='Enter admin full name'
                        />
                      )}
                    />
                    {errors.adminName && (
                      <p className='flex items-center gap-1 text-xs text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.adminName.message}
                      </p>
                    )}
                  </div>

                  {/* Admin Email */}
                  <div className='space-y-2'>
                    <Label htmlFor='adminEmail'>
                      Admin Email <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='adminEmail'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id='adminEmail'
                          type='email'
                          placeholder='admin@company.com'
                        />
                      )}
                    />
                    {errors.adminEmail && (
                      <p className='flex items-center gap-1 text-xs text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.adminEmail.message}
                      </p>
                    )}
                  </div>

                  {/* Admin Phone */}
                  <div className='space-y-2'>
                    <Label htmlFor='adminPhone'>
                      Admin Phone <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name='adminPhone'
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
                                'adminPhoneCountryCode',
                                `+${phoneNumber.countryCallingCode}`,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                }
                              )
                            } else {
                              setValue('adminPhoneCountryCode', '', {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                            }
                          }}
                          className='w-full rounded-md border border-gray-300 px-3 py-2'
                        />
                      )}
                    />
                    {errors.adminPhone && (
                      <p className='flex items-center gap-1 text-xs text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.adminPhone.message}
                      </p>
                    )}
                  </div>

                  {/* Admin Job Title */}
                  <div className='space-y-2'>
                    <Label htmlFor='adminJobTitle'>Admin Job Title</Label>
                    <Controller
                      name='adminJobTitle'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id='adminJobTitle'
                          placeholder='e.g., IT Director, Operations Manager'
                        />
                      )}
                    />
                    {errors.adminJobTitle && (
                      <p className='flex items-center gap-1 text-xs text-red-500'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.adminJobTitle.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Information Alert */}
              <Alert>
                <Mail className='h-4 w-4' />
                <AlertDescription>
                  {isEdit
                    ? 'Changes will be saved and the admin will be notified of any updates.'
                    : 'An invitation email will be sent to the admin contact with instructions to register and access the system.'}
                </AlertDescription>
              </Alert>
            </div>
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <CustomButton type='submit' loading={loading} form='user-form'>
            {isEdit ? 'Update Organization' : 'Create Organization'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
