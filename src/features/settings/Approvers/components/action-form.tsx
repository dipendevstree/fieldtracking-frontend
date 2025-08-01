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
  hierarchyFormSchema, 
  categoryApproverFormSchema,
  THierarchyFormSchema,
  TCategoryApproverFormSchema 
} from '../data/schema'
import { ApprovalHierarchy, CategoryApprover } from '../type/type'

// Hierarchy Action Form
interface HierarchyFormProps {
  currentRow?: Partial<ApprovalHierarchy>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: THierarchyFormSchema) => void
}

export function HierarchyActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: HierarchyFormProps) {
  const isEdit = !!currentRow

  const form = useForm<THierarchyFormSchema>({
    resolver: zodResolver(hierarchyFormSchema),
    defaultValues: {
      level: currentRow?.level ?? 1,
      minAmount: currentRow?.amountRange?.min ?? 0,
      maxAmount: currentRow?.amountRange?.max ?? 0,
      approverRole: currentRow?.approverRole ?? '',
      isRequired: currentRow?.isRequired ?? true,
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: THierarchyFormSchema) => {
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
              {isEdit ? 'Edit Approval Level' : 'Add Approval Level'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground mt-1 text-sm'>
              {isEdit
                ? 'Update approval hierarchy level.'
                : 'Create a new approval hierarchy level.'}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id='hierarchy-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Level Field */}
            <div className='space-y-2'>
              <Label htmlFor='level'>Approval Level *</Label>
              <Controller
                name='level'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='level'
                    type='number'
                    placeholder='Enter approval level'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.level && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.level.message}
                </p>
              )}
            </div>

            {/* Min Amount Field */}
            <div className='space-y-2'>
              <Label htmlFor='minAmount'>Minimum Amount *</Label>
              <Controller
                name='minAmount'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='minAmount'
                    type='number'
                    placeholder='Enter minimum amount'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.minAmount && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.minAmount.message}
                </p>
              )}
            </div>

            {/* Max Amount Field */}
            <div className='space-y-2'>
              <Label htmlFor='maxAmount'>Maximum Amount *</Label>
              <Controller
                name='maxAmount'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='maxAmount'
                    type='number'
                    placeholder='Enter maximum amount'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.maxAmount && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.maxAmount.message}
                </p>
              )}
            </div>

            {/* Approver Role Field */}
            <div className='space-y-2'>
              <Label htmlFor='approverRole'>Approver Role *</Label>
              <Controller
                name='approverRole'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select approver role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='direct-manager'>Direct Manager</SelectItem>
                      <SelectItem value='regional-manager'>Regional Manager</SelectItem>
                      <SelectItem value='finance-director'>Finance Director</SelectItem>
                      <SelectItem value='hr-department'>HR Department</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.approverRole && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.approverRole.message}
                </p>
              )}
            </div>

            {/* Required Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='isRequired'>Required</Label>
                <Controller
                  name='isRequired'
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
          <CustomButton type='submit' loading={loading} form='hierarchy-form'>
            {isEdit ? 'Update Level' : 'Create Level'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Category Approver Action Form
interface CategoryApproverFormProps {
  currentRow?: Partial<CategoryApprover>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TCategoryApproverFormSchema) => void
}

export function CategoryApproverActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: CategoryApproverFormProps) {
  const isEdit = !!currentRow

  const form = useForm<TCategoryApproverFormSchema>({
    resolver: zodResolver(categoryApproverFormSchema),
    defaultValues: {
      categoryName: currentRow?.categoryName ?? '',
      approverRole: currentRow?.approverRole ?? '',
      isEnabled: currentRow?.isEnabled ?? true,
      description: currentRow?.description ?? '',
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TCategoryApproverFormSchema) => {
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
              {isEdit ? 'Edit Category Approver' : 'Add Category Approver'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground mt-1 text-sm'>
              {isEdit
                ? 'Update category-specific approver.'
                : 'Create a new category-specific approver.'}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id='category-approver-form'
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

            {/* Approver Role Field */}
            <div className='space-y-2'>
              <Label htmlFor='approverRole'>Approver Role *</Label>
              <Controller
                name='approverRole'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select approver role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='direct-manager'>Direct Manager</SelectItem>
                      <SelectItem value='regional-manager'>Regional Manager</SelectItem>
                      <SelectItem value='finance-director'>Finance Director</SelectItem>
                      <SelectItem value='hr-department'>HR Department</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.approverRole && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.approverRole.message}
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
                  <Input
                    {...field}
                    id='description'
                    placeholder='Enter description'
                    value={field.value || ''}
                  />
                )}
              />
            </div>

            {/* Enabled Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='isEnabled'>Enabled</Label>
                <Controller
                  name='isEnabled'
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
          <CustomButton type='submit' loading={loading} form='category-approver-form'>
            {isEdit ? 'Update Category' : 'Create Category'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
