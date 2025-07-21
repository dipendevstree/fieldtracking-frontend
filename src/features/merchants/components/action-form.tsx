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
import { PasswordInputField } from '@/components/shared/custom-password-input-field'
import { SelectInputField } from '@/components/shared/select-input-field'
import { GENDER_OPTIONS } from '../data/merchants.data'
import { formSchema, TFormSchema } from '../data/schema'
import { Merchant } from '../types'

interface Props {
  currentRow?: Merchant
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TFormSchema) => void
}

export function MerchantsActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: Props) {
  const isEdit = !!currentRow
  const form = useForm<TFormSchema>({
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
          password: '',
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
              id='user-form'
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
                name='user_name'
                label='Username'
                placeholder='ex john.doe'
              />
              <TextInputField
                control={form.control}
                name='merchant_id'
                label='Merchant ID'
                placeholder='ex john@123'
              />
              <TextInputField
                control={form.control}
                name='email'
                label='Email'
                placeholder='john.doe@gmail.com'
              />
              <PasswordInputField
                control={form.control}
                name='password'
                label='Password'
                placeholder='Enter password'
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
          <CustomButton type='submit' loading={loading} form='user-form'>
            Save Changes
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
