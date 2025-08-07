import { Controller, useForm } from 'react-hook-form'
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CustomButton from '@/components/shared/custom-button'
import { 
  expenseLimitFormSchema, 
  locationAdjustmentFormSchema,
  expenseExpirySettingsFormSchema,
  TExpenseLimitFormSchema,
  TLocationAdjustmentFormSchema,
  TExpenseExpirySettingsFormSchema 
} from '../data/schema'
import { ExpenseLimit, LocationAdjustment, ExpenseExpirySettings } from '../type/type'

// Expense Limit Action Form
interface ExpenseLimitFormProps {
  currentLimit?: Partial<ExpenseLimit>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TExpenseLimitFormSchema) => void
}

export function ExpenseLimitActionForm({
  currentLimit,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: ExpenseLimitFormProps) {
  const isEdit = !!currentLimit

  const form = useForm<TExpenseLimitFormSchema>({
    resolver: zodResolver(expenseLimitFormSchema),
    defaultValues: {
      designation: currentLimit?.designation ?? '',
      dailyLimit: currentLimit?.dailyLimit ?? 0,
      monthlyLimit: currentLimit?.monthlyLimit ?? 0,
      travelLimit: currentLimit?.travelLimit ?? 0,
      isActive: currentLimit?.isActive ?? true,
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TExpenseLimitFormSchema) => {
    onSubmitValues(values)
  }

  const handleDialogChange = (state: boolean) => {
    if (!state) reset()
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className='max-h-[80vh] !max-w-md overflow-y-auto'>
        <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <div>
            <DialogTitle className='text-xl font-semibold'>
              {isEdit ? 'Edit Expense Limit' : 'Add Expense Limit'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground mt-1 text-sm'>
              {isEdit
                ? 'Update expense limit for this designation.'
                : 'Create a new expense limit for a designation.'}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id='expense-limit-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Designation Field */}
            <div className='space-y-2'>
              <Label htmlFor='designation'>Designation *</Label>
              <Controller
                name='designation'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='designation'
                    placeholder='Enter designation'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.designation && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.designation.message}
                </p>
              )}
            </div>

            {/* Daily Limit Field */}
            <div className='space-y-2'>
              <Label htmlFor='dailyLimit'>Daily Limit ($) *</Label>
              <Controller
                name='dailyLimit'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='dailyLimit'
                    type='number'
                    placeholder='Enter daily limit'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.dailyLimit && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.dailyLimit.message}
                </p>
              )}
            </div>

            {/* Monthly Limit Field */}
            <div className='space-y-2'>
              <Label htmlFor='monthlyLimit'>Monthly Limit ($) *</Label>
              <Controller
                name='monthlyLimit'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='monthlyLimit'
                    type='number'
                    placeholder='Enter monthly limit'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.monthlyLimit && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.monthlyLimit.message}
                </p>
              )}
            </div>

            {/* Travel Limit Field */}
            <div className='space-y-2'>
              <Label htmlFor='travelLimit'>Travel Limit ($/mile) *</Label>
              <Controller
                name='travelLimit'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='travelLimit'
                    type='number'
                    step='0.01'
                    placeholder='Enter travel limit per mile'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.travelLimit && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.travelLimit.message}
                </p>
              )}
            </div>

            {/* Is Active Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='isActive'>Active</Label>
                <Controller
                  name='isActive'
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        
        <DialogFooter className='flex gap-2 pt-4'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <CustomButton type='submit' loading={loading} form='expense-limit-form'>
            {isEdit ? 'Update Limit' : 'Create Limit'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Location Adjustment Action Form
interface LocationAdjustmentFormProps {
  currentAdjustment?: Partial<LocationAdjustment>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TLocationAdjustmentFormSchema) => void
}

export function LocationAdjustmentActionForm({
  currentAdjustment,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: LocationAdjustmentFormProps) {
  const isEdit = !!currentAdjustment

  const form = useForm<TLocationAdjustmentFormSchema>({
    resolver: zodResolver(locationAdjustmentFormSchema),
    defaultValues: {
      locationType: currentAdjustment?.locationType ?? 'metropolitan',
      adjustmentPercentage: currentAdjustment?.adjustmentPercentage ?? 0,
      isActive: currentAdjustment?.isActive ?? true,
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TLocationAdjustmentFormSchema) => {
    onSubmitValues(values)
  }

  const handleDialogChange = (state: boolean) => {
    if (!state) reset()
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className='max-h-[80vh] !max-w-md overflow-y-auto'>
        <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <div>
            <DialogTitle className='text-xl font-semibold'>
              {isEdit ? 'Edit Location Adjustment' : 'Add Location Adjustment'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground mt-1 text-sm'>
              {isEdit
                ? 'Update location-based expense adjustment.'
                : 'Create a new location-based expense adjustment.'}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id='location-adjustment-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Location Type Field */}
            <div className='space-y-2'>
              <Label htmlFor='locationType'>Location Type *</Label>
              <Controller
                name='locationType'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select location type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='metropolitan'>Metropolitan</SelectItem>
                      <SelectItem value='rural'>Rural</SelectItem>
                      <SelectItem value='suburban'>Suburban</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.locationType && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.locationType.message}
                </p>
              )}
            </div>

            {/* Adjustment Percentage Field */}
            <div className='space-y-2'>
              <Label htmlFor='adjustmentPercentage'>Adjustment Percentage (%) *</Label>
              <Controller
                name='adjustmentPercentage'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='adjustmentPercentage'
                    type='number'
                    step='0.1'
                    placeholder='Enter adjustment percentage'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.adjustmentPercentage && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.adjustmentPercentage.message}
                </p>
              )}
            </div>

            {/* Is Active Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='isActive'>Active</Label>
                <Controller
                  name='isActive'
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        
        <DialogFooter className='flex gap-2 pt-4'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <CustomButton type='submit' loading={loading} form='location-adjustment-form'>
            {isEdit ? 'Update Adjustment' : 'Create Adjustment'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Expense Expiry Settings Action Form
interface ExpenseExpirySettingsFormProps {
  currentSettings?: Partial<ExpenseExpirySettings>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TExpenseExpirySettingsFormSchema) => void
}

export function ExpenseExpirySettingsActionForm({
  currentSettings,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: ExpenseExpirySettingsFormProps) {
  const isEdit = !!currentSettings

  const form = useForm<TExpenseExpirySettingsFormSchema>({
    resolver: zodResolver(expenseExpirySettingsFormSchema),
    defaultValues: {
      submissionDeadline: currentSettings?.submissionDeadline ?? 30,
      warningPeriod: currentSettings?.warningPeriod ?? 7,
      autoRejectAfterExpiry: currentSettings?.autoRejectAfterExpiry ?? false,
      allowLateSubmissions: currentSettings?.allowLateSubmissions ?? false,
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TExpenseExpirySettingsFormSchema) => {
    onSubmitValues(values)
  }

  const handleDialogChange = (state: boolean) => {
    if (!state) reset()
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className='max-h-[80vh] !max-w-md overflow-y-auto'>
        <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <div>
            <DialogTitle className='text-xl font-semibold'>
              {isEdit ? 'Edit Expiry Settings' : 'Configure Expiry Settings'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground mt-1 text-sm'>
              {isEdit
                ? 'Update expense expiry settings.'
                : 'Configure expense expiry settings.'}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id='expiry-settings-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Submission Deadline Field */}
            <div className='space-y-2'>
              <Label htmlFor='submissionDeadline'>Submission Deadline (days) *</Label>
              <Controller
                name='submissionDeadline'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='submissionDeadline'
                    type='number'
                    placeholder='Enter submission deadline in days'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.submissionDeadline && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.submissionDeadline.message}
                </p>
              )}
            </div>

            {/* Warning Period Field */}
            <div className='space-y-2'>
              <Label htmlFor='warningPeriod'>Warning Period (days) *</Label>
              <Controller
                name='warningPeriod'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='warningPeriod'
                    type='number'
                    placeholder='Enter warning period in days'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.warningPeriod && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.warningPeriod.message}
                </p>
              )}
            </div>

            {/* Auto Reject After Expiry Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='autoRejectAfterExpiry'>Auto-reject After Expiry</Label>
                <Controller
                  name='autoRejectAfterExpiry'
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Allow Late Submissions Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='allowLateSubmissions'>Allow Late Submissions</Label>
                <Controller
                  name='allowLateSubmissions'
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter className='flex gap-2 pt-4'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <CustomButton type='submit' loading={loading} form='expiry-settings-form'>
            {isEdit ? 'Update Settings' : 'Save Settings'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
