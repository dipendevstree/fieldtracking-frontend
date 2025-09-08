import { Controller, useForm } from 'react-hook-form'
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
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
  TExpenseLimitFormSchema
} from '../data/schema'
import { TIER } from '@/data/app.data'
import { ExpenseCategory } from '../../Expense-categories/type/type'


// Expense Limit Action Form
interface Props {
  currentLimit?: Partial<TExpenseLimitFormSchema>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  expenseCategories?: ExpenseCategory[]
  onSubmit: (values: TExpenseLimitFormSchema) => void
}

export function ExpenseLimitActionForm({
  currentLimit,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
  expenseCategories = [],
}: Props) {
  const isEdit = !!currentLimit

  // Define tier options using the TIER enum from app.data.ts
  const tiers = Object.values(TIER).map((tierValue) => ({
    label: tierValue.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: tierValue,
  }))

  const form = useForm<TExpenseLimitFormSchema>({
    resolver: zodResolver(expenseLimitFormSchema),
    defaultValues: {
      tierkey: '',
      expenseCategoryId: '',
      dailyLimit: 0,
      monthlyLimit: 0,
      isActive: true,
    },
    mode: 'onChange', // Enable real-time validation
  });

  // Debug form state
  const watchedValues = form.watch();
  console.log('Form watched values:', watchedValues);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TExpenseLimitFormSchema) => {
    console.log('Form submission triggered with values:', values);
    console.log('Form errors:', errors);
    console.log('Form is valid:', Object.keys(errors).length === 0);
    
    try {
      onSubmitValues(values);
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  }

  // Reset form values when currentLimit changes (for edit mode)
  useEffect(() => {
    console.log('Form reset triggered:', { currentLimit, isEdit });
    if (currentLimit && isEdit) {
      const resetValues = {
        tierkey: currentLimit.tierkey || '',
        expenseCategoryId: currentLimit.expenseCategoryId || '',
        dailyLimit: currentLimit.dailyLimit || 0,
        monthlyLimit: currentLimit.monthlyLimit || 0,
        isActive: currentLimit.isActive ?? true,
      };
      console.log('Resetting form with values:', resetValues);
      reset(resetValues);
    } else if (!currentLimit) {
      const defaultValues = {
        tierkey: '',
        expenseCategoryId: '',
        dailyLimit: 0,
        monthlyLimit: 0,
        isActive: true,
      };
      console.log('Resetting form to default values:', defaultValues);
      reset(defaultValues);
    }
  }, [currentLimit, isEdit, reset])

  const handleDialogChange = (state: boolean) => {
    if (!state) {
      // Reset form to default values when closing
      reset({
        tierkey: '',
        expenseCategoryId: '',
        dailyLimit: 0,
        monthlyLimit: 0,
        isActive: true,
      });
    }
    onOpenChange(state);
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

            {/* Tier Field */}
            <div className='space-y-2 w-full'>
              <Label htmlFor='tierkey'>Tier <span className="text-red-500">*</span></Label>
              <Controller
                name='tierkey'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select tier' />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          {tier.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tierkey && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.tierkey.message}
                </p>
              )}
            </div>

            {/* Category Field */}
            <div className='space-y-2 w-full'>
              <Label htmlFor='expenseCategoryId'>Category<span className="text-red-500">*</span></Label>
              <Controller
                name='expenseCategoryId'
                control={control}
                render={({ field }) => {
                  return (
                    <Select 
                      key={`category-select-${open}`} // Removed field.value from key
                      value={field.value || ""} 
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories?.length > 0 ? (
                          expenseCategories.map((category) => {
                            return (
                              <SelectItem 
                                key={category.categoryId} 
                                value={category.categoryName}
                                className="cursor-pointer"
                              >
                                {category.categoryName}
                              </SelectItem>
                            );
                          })
                        ) : (
                          <SelectItem value="no-categories" disabled>
                            No categories available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.expenseCategoryId && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.expenseCategoryId.message}
                </p>
              )}
            </div>

            {/* Daily Limit Field */}
            <div className='space-y-2'>
              <Label htmlFor='dailyLimit'>Daily Limit ($) <span className="text-red-500">*</span></Label>
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
              <Label htmlFor='monthlyLimit'>Monthly Limit ($) <span className="text-red-500">*</span></Label>
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

            {/* Is Active Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='isActive'>Active <span className="text-red-500">*</span></Label>
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
