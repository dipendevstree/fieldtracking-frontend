import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import CustomButton from '@/components/shared/custom-button'
import { TextInputField } from '@/components/shared/custom-input-text'
import { SelectInputField } from '@/components/shared/select-input-field'
import { formSchema, TFormSchema } from '../data/schema'
import { GENDER_OPTIONS } from '../data/users.data'
import { Driver } from '../types'

interface Props {
  currentRow?: Driver
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TFormSchema) => void
}

export function ActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: Props) {
  const isEdit = !!currentRow
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          gender: currentRow.gender as 'male' | 'female' | 'other' | undefined,
          isEdit,
        }
      : {
          name: '',
          email: '',
          mobile: '',
          gender: undefined,
          isEdit,
        },
  })

  const onSubmit = (values: TFormSchema) => {
    onSubmitValues(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'}</DialogTitle>
        </DialogHeader>
        <div className='-mr-4 h-fit w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='Driver-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <TextInputField
                control={form.control}
                name='name'
                label='Name'
                placeholder='John Doe'
              />
              <TextInputField
                control={form.control}
                name='email'
                label='Email'
                placeholder='john.doe@gmail.com'
              />
              <TextInputField
                control={form.control}
                name='mobile'
                label='Mobile'
                placeholder='+123456789'
              />
              <SelectInputField
                control={form.control}
                name='gender'
                label='Gender'
                placeholder='Select a gender'
                items={GENDER_OPTIONS}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <CustomButton type='submit' loading={loading} form='Driver-form'>
            Save Changes
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
