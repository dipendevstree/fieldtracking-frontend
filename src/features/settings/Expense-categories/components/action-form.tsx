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
import { Textarea } from '@/components/ui/textarea'
import CustomButton from '@/components/shared/custom-button'
import { expenseCategoryFormSchema, TExpenseCategoryFormSchema } from '../data/schema'
import { ExpenseCategory } from '../type/type'

interface Props {
  currentRow?: Partial<ExpenseCategory>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TExpenseCategoryFormSchema) => void
}

export function ExpenseCategoryActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: Props) {
  const isEdit = !!currentRow

  const form = useForm<TExpenseCategoryFormSchema>({
    resolver: zodResolver(expenseCategoryFormSchema),
    defaultValues: {
      categoryName: currentRow?.categoryName ?? '',
      categoryType: currentRow?.categoryType ?? 'fixed-amount',
      defaultLimit: currentRow?.defaultLimit ?? 0,
      limitUnit: currentRow?.limitUnit ?? 'fixed',
      requiresReceipt: currentRow?.requiresReceipt ?? false,
      isActive: currentRow?.isActive ?? true,
      description: currentRow?.description ?? '',
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TExpenseCategoryFormSchema) => {
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
              {isEdit ? 'Edit Expense Category' : 'Add Expense Category'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground mt-1 text-sm'>
              {isEdit
                ? 'Update expense category information.'
                : 'Create a new expense category.'}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id='expense-category-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Category Name Field */}
            <div className='space-y-2'>
              <Label htmlFor='categoryName'>Category Name *</Label>
              <Controller
                name='categoryName'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='categoryName'
                    placeholder='Enter category name'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.categoryName && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.categoryName.message}
                </p>
              )}
            </div>

            {/* Category Type Field */}
            <div className='space-y-2'>
              <Label htmlFor='categoryType'>Category Type *</Label>
              <Controller
                name='categoryType'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select category type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='mileage'>Mileage</SelectItem>
                      <SelectItem value='per-diem'>Per Diem</SelectItem>
                      <SelectItem value='fixed-amount'>Fixed Amount</SelectItem>
                      <SelectItem value='percentage'>Percentage</SelectItem>
                      <SelectItem value='custom'>Custom</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryType && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.categoryType.message}
                </p>
              )}
            </div>

            {/* Default Limit Field */}
            <div className='space-y-2'>
              <Label htmlFor='defaultLimit'>Default Limit *</Label>
              <Controller
                name='defaultLimit'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='defaultLimit'
                    type='number'
                    placeholder='Enter default limit'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.defaultLimit && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.defaultLimit.message}
                </p>
              )}
            </div>

            {/* Limit Unit Field */}
            <div className='space-y-2'>
              <Label htmlFor='limitUnit'>Limit Unit *</Label>
              <Controller
                name='limitUnit'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select limit unit' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='per-mile'>Per Mile</SelectItem>
                      <SelectItem value='per-day'>Per Day</SelectItem>
                      <SelectItem value='per-meal'>Per Meal</SelectItem>
                      <SelectItem value='per-trip'>Per Trip</SelectItem>
                      <SelectItem value='fixed'>Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.limitUnit && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.limitUnit.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id='description'
                    placeholder='Enter description'
                    value={field.value || ''}
                  />
                )}
              />
            </div>

            {/* Requires Receipt Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='requiresReceipt'>Requires Receipt</Label>
                <Controller
                  name='requiresReceipt'
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
          <CustomButton type='submit' loading={loading} form='expense-category-form'>
            {isEdit ? 'Update Category' : 'Create Category'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
