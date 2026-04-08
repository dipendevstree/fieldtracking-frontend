// import { useEffect } from 'react'
// import { Controller, useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { parsePhoneNumberFromString } from 'libphonenumber-js'
// import { AlertCircle, Mail } from 'lucide-react'
// import PhoneInput from 'react-phone-number-input'
// import 'react-phone-number-input/style.css'
// import { useSelectOptions } from '@/hooks/use-select-option'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Button } from '@/components/ui/button'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Form } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import TreeSelect from '@/components/ui/multiTreeSelect'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import CustomButton from '@/components/shared/custom-button'
// import { formSchema, TFormSchema } from '../data/schema'
// import {
//   useGetEmployeeRange,
//   useGetIndustry,
//   useGetMenu,
// } from '../services/Customers.hook'
// import { Customer } from '../types'

// interface Props {
//   currentRow?: Customer
//   loading?: boolean
//   onSubmit: (values: TFormSchema) => void
//   onCancel?: () => void
// }

// export function CustomerActionForm({
//   currentRow,
//   onSubmit: onSubmitValues,
//   loading,
//   onCancel,
// }: Props) {
//   const isEdit = !!currentRow
//   const { data: employeeRangeList } = useGetEmployeeRange()
//   const { data: industryList } = useGetIndustry()
//   const { data: rawMenuList } = useGetMenu()
//   const menuList = rawMenuList?.filter(
//     (menu: any) => menu.menuKey !== 'super_admin'
//   )

//   const form = useForm<TFormSchema>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: '',
//       industry: '',
//       employeeRange: '',
//       isSeparateSchema: false,
//       adminName: '',
//       adminPhone: '',
//       adminEmail: '',
//       adminJobTitle: '',
//       adminPhoneCountryCode: '',
//       menuIds: [],
//     },
//   })

//   const { control, formState, setValue, getValues, reset } = form
//   const { errors } = formState

//   const employeeRange = useSelectOptions<any>({
//     listData: employeeRangeList ?? [],
//     labelKey: 'employeeRange',
//     valueKey: 'employeeRangeId',
//   })

//   const industry = useSelectOptions<any>({
//     listData: industryList ?? [],
//     labelKey: 'industryName',
//     valueKey: 'industryId', 
//   })

//   const buildTreeData = (menuList: any[]) => {
//     if (!menuList || menuList.length === 0) return []

//     const map = new Map<string, any>()
//     const tree: any[] = []

//     try {
//       // Step 1: Initialize each node
//       menuList.forEach((item) => {
//         map.set(item.menuId, {
//           title: item.menuName,
//           value: item.menuId,
//           key: item.menuId,
//           children: [], // initially assign empty
//         })
//       })

//       // Step 2: Build parent-child relationships
//       menuList.forEach((item) => {
//         if (item.parentMenuId) {
//           const parent = map.get(item.parentMenuId)
//           if (parent) {
//             parent.children.push(map.get(item.menuId))
//           }
//         } else {
//           tree.push(map.get(item.menuId))
//         }
//       })

//       // Step 3: Clean up empty children arrays
//       const cleanChildren = (nodes: any[]) => {
//         return nodes.map((node) => {
//           const cleanedNode = { ...node }
//           if (cleanedNode.children && cleanedNode.children.length > 0) {
//             cleanedNode.children = cleanChildren(cleanedNode.children)
//           } else {
//             delete cleanedNode.children
//           }
//           return cleanedNode
//         })
//       }

//       return cleanChildren(tree)
//     } catch (error) {
//       console.error('Error building tree data:', error)
//       return []
//     }
//   }

//   const treeData = buildTreeData(menuList ?? [])

//   // Initialize form values when editing
//   useEffect(() => {
//     if (isEdit && currentRow) {
//       // Construct the phone number with country code if available
//       const fullPhoneNumber =
//         currentRow.adminPhoneCountryCode && currentRow.adminPhone
//           ? `${currentRow.adminPhoneCountryCode}${currentRow.adminPhone}`
//           : currentRow.adminPhone || ''

//       const editValues = {
//         name: currentRow.CustomerName || '',
//         industry: String(currentRow.industry?.industryId || ''),
//         employeeRange: currentRow.employeeRange?.employeeRangeId || '',
//         isSeparateSchema: Boolean(currentRow.is_separate_schema),
//         adminName:
//           (currentRow.adminData?.firstName && currentRow.adminData?.lastName
//             ? `${currentRow.adminData.firstName} ${currentRow.adminData.lastName}`
//             : '') || '',
//         adminPhone: fullPhoneNumber,
//         adminEmail: currentRow.adminData?.email || '',
//         adminJobTitle: currentRow.adminJobTitle || '',
//         adminPhoneCountryCode: currentRow.adminPhoneCountryCode || '',
//         menuIds: currentRow.menuIds || [],
//       }

//       reset(editValues)
//     }
//   }, [isEdit, currentRow, reset])

//   // Set default menu selection for new Customers
//   useEffect(() => {
//     if (!isEdit && treeData && treeData.length > 0) {
//       const currentMenuIds = getValues('menuIds')
//       if (!currentMenuIds || currentMenuIds.length === 0) {
//         const defaultValue = treeData[0]?.value ? [treeData[0].value] : []
//         setValue('menuIds', defaultValue, { shouldValidate: true })
//       }
//     }
//   }, [treeData, isEdit, setValue, getValues])

//   return (
//     <div className='max-h-[80vh] overflow-y-auto p-6'>
//       <div className='text-left mb-6'>
//         <h2 className='text-2xl font-semibold'>{isEdit ? 'Edit' : 'Add'} Customer</h2>
//         <p className='text-muted-foreground mt-1'>
//           {isEdit
//             ? 'Update Customer details and admin contact information.'
//             : 'Set up a new Customer and send invitation to the admin contact.'}
//         </p>
//       </div>

//       <Form {...form}>
//         <form
//           id='customer-form'
//           onSubmit={form.handleSubmit(onSubmitValues)}
//           className='space-y-4'
//         >
//           <div className='space-y-6'>
//             <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
//               {/* Customer Details */}
//               <div className='space-y-4'>
//                 <h4 className='text-lg font-medium'>Customer Details</h4>

//                 {/* Customer Name */}
//                 <div className='space-y-2'>
//                   <Label htmlFor='customerName'>
//                     Customer Name <span className='text-red-500'>*</span>
//                   </Label>
//                   <Controller
//                     name='name'
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         id='customerName'
//                         placeholder='Enter customer name'
//                       />
//                     )}
//                   />
//                   {errors.name && (
//                     <p className='flex items-center gap-1 text-xs text-red-500'>
//                       <AlertCircle className='h-3 w-3' />
//                       {errors.name.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Industry */}
//                 <div className='space-y-2'>
//                   <Label htmlFor='industry'>
//                     Industry <span className='text-red-500'>*</span>
//                   </Label>
//                   <Controller
//                     name='industry'
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         value={field.value}
//                         onValueChange={field.onChange}
//                       >
//                         <SelectTrigger className='w-full'>
//                           <SelectValue placeholder='Select industry' />
//                         </SelectTrigger>
//                         <SelectContent className='!w-full'>
//                           {industry.map((option) => (
//                             <SelectItem
//                               key={option.value}
//                               value={String(option.value)}
//                             >
//                               {option.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.industry && (
//                     <p className='flex items-center gap-1 text-xs text-red-500'>
//                       <AlertCircle className='h-3 w-3' />
//                       {errors.industry.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Employee Range */}
//                 <div className='space-y-2'>
//                   <Label htmlFor='employeeRange'>
//                     Employee Count <span className='text-red-500'>*</span>
//                   </Label>
//                   <Controller
//                     name='employeeRange'
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         value={field.value}
//                         onValueChange={field.onChange}
//                       >
//                         <SelectTrigger className='w-full'>
//                           <SelectValue placeholder='Select range' />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {employeeRange.map((option) => (
//                             <SelectItem
//                               key={option.value}
//                               value={String(option.value)}
//                             >
//                               {option.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.employeeRange && (
//                     <p className='flex items-center gap-1 text-xs text-red-500'>
//                       <AlertCircle className='h-3 w-3' />
//                       {errors.employeeRange.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Modules */}
//                 <div className='space-y-2'>
//                   <Label htmlFor='modules'>
//                     Modules <span className='text-red-500'>*</span>
//                   </Label>
//                   <Controller
//                     name='menuIds'
//                     control={control}
//                     render={({ field }) => (
//                       <TreeSelect
//                         treeData={treeData}
//                         value={field.value || []}
//                         onChange={(value) => {
//                           field.onChange(value)
//                         }}
//                         treeCheckable={true}
//                         showCheckedStrategy='SHOW_ALL'
//                         placeholder='Select modules'
//                         className='w-full'
//                         style={{ width: '100%' }}
//                       />
//                     )}
//                   />
//                   {errors.menuIds && (
//                     <p className='flex items-center gap-1 text-xs text-red-500'>
//                       <AlertCircle className='h-3 w-3' />
//                       {errors.menuIds.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Separate Schema Checkbox */}
//                 <div className='flex items-center space-x-2'>
//                   <Controller
//                     name='isSeparateSchema'
//                     control={control}
//                     render={({ field: { value, onChange, ...rest } }) => (
//                       <Checkbox
//                         checked={value}
//                         onCheckedChange={(checked) => onChange(!!checked)}
//                         id='isSeparateSchema'
//                         {...rest}
//                       />
//                     )}
//                   />
//                   <Label
//                     htmlFor='isSeparateSchema'
//                     className='text-sm font-normal'
//                   >
//                     Use separate schema for this Customer
//                   </Label>
//                 </div>
//               </div>

//               {/* Admin Contact Details */}
//               <div className='space-y-4'>
//                 <h4 className='text-lg font-medium'>Admin Contact Details</h4>

//                 {/* Admin Name */}
//                 <div className='space-y-2'>
//                   <Label htmlFor='adminName'>
//                     Admin Name <span className='text-red-500'>*</span>
//                   </Label>
//                   <Controller
//                     name='adminName'
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         id='adminName'
//                         placeholder='Enter admin full name'
//                       />
//                     )}
//                   />
//                   {errors.adminName && (
//                     <p className='flex items-center gap-1 text-xs text-red-500'>
//                       <AlertCircle className='h-3 w-3' />
//                       {errors.adminName.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Admin Email */}
//                 <div className='space-y-2'>
//                   <Label htmlFor='adminEmail'>
//                     Admin Email <span className='text-red-500'>*</span>
//                   </Label>
//                   <Controller
//                     name='adminEmail'
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         id='adminEmail'
//                         type='email'
//                         placeholder='admin@company.com'
//                       />
//                     )}
//                   />
//                   {errors.adminEmail && (
//                     <p className='flex items-center gap-1 text-xs text-red-500'>
//                       <AlertCircle className='h-3 w-3' />
//                       {errors.adminEmail.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Admin Phone */}
//                 <div className='space-y-2'>
//                   <Label htmlFor='adminPhone'>
//                     Admin Phone <span className='text-red-500'>*</span>
//                   </Label>
//                   <Controller
//                     name='adminPhone'
//                     control={control}
//                     render={({ field }) => (
//                       <PhoneInput
//                         {...field}
//                         international
//                         countryCallingCodeEditable={false}
//                         defaultCountry='IN'
//                         value={field.value}
//                         onChange={(value) => {
//                           field.onChange(value)
//                           const phoneNumber = parsePhoneNumberFromString(
//                             value || ''
//                           )
//                           if (phoneNumber) {
//                             setValue(
//                               'adminPhoneCountryCode',
//                               `+${phoneNumber.countryCallingCode}`,
//                               {
//                                 shouldValidate: true,
//                                 shouldDirty: true,
//                               }
//                             )
//                           } else {
//                             setValue('adminPhoneCountryCode', '', {
//                               shouldValidate: true,
//                               shouldDirty: true,
//                             })
//                           }
//                         }}
//                         className='w-full rounded-md border border-gray-300 px-3 py-2'
//                       />
//                     )}
//                   />
//                   {errors.adminPhone && (
//                     <p className='flex items-center gap-1 text-xs text-red-500'>
//                       <AlertCircle className='h-3 w-3' />
//                       {errors.adminPhone.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Admin Job Title */}
//                 <div className='space-y-2'>
//                   <Label htmlFor='adminJobTitle'>Admin Job Title</Label>
//                   <Controller
//                     name='adminJobTitle'
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         id='adminJobTitle'
//                         placeholder='e.g., IT Director, Operations Manager'
//                       />
//                     )}
//                   />
//                   {errors.adminJobTitle && (
//                     <p className='flex items-center gap-1 text-xs text-red-500'>
//                       <AlertCircle className='h-3 w-3' />
//                       {errors.adminJobTitle.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Information Alert */}
//             <Alert>
//               <Mail className='h-4 w-4' />
//               <AlertDescription>
//                 {isEdit
//                   ? 'Changes will be saved and the admin will be notified of any updates.'
//                   : 'An invitation email will be sent to the admin contact with instructions to register and access the system.'}
//               </AlertDescription>
//             </Alert>
//           </div>

//           <div className='flex justify-end gap-4 mt-6'>
//             {onCancel && (
//               <Button type='button' variant='outline' onClick={onCancel}>
//                 Cancel
//               </Button>
//             )}
//             <CustomButton type='submit' loading={loading}>
//               {isEdit ? 'Update Customer' : 'Create Customer'}
//             </CustomButton>
//           </div>
//         </form>
//       </Form>
//     </div>
//   )
// }
