
import CustomButton from '@/components/shared/custom-button'
import { TextInputField } from '@/components/shared/custom-input-text'
import { SelectInputField } from '@/components/shared/select-input-field'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { GENDER_OPTIONS } from '../data/users.data'
import { formSchema, TFormSchema } from '../data/schema'
import { User } from '../types'

interface Props {
    currentRow?: User
    open: boolean
    onOpenChange: (open: boolean) => void
    loading?: boolean
    onSubmit: (values: TFormSchema) => void
}

export function ActionForm({ currentRow, open, onOpenChange, onSubmit: onSubmitValues, loading }: Props) {
    const isEdit = !!currentRow
    const form = useForm<TFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: isEdit
            ? {
                ...currentRow,
                gender: ['male', 'female', 'other'].includes(currentRow.gender) ? currentRow.gender as 'male' | 'female' | 'other' : undefined,
                country_code: currentRow.country_code || '',
                country: currentRow.country || '',
                isEdit,
            }
            : {
                name: '',
                email: '',
                mobile: '',
                gender: undefined,
                country_code: '',
                country: '',
                isEdit,
            },
    } as any)

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
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>{isEdit ? 'Edit' : 'Add'}</DialogTitle>
                </DialogHeader>
                <div className="-mr-4 h-fit w-full overflow-y-auto py-1 pr-4">
                    <Form {...form}>
                        <form
                            id="user-form"
                            onSubmit={form.handleSubmit(onSubmit as SubmitHandler<TFormSchema>)}
                            className="space-y-4 p-0.5"
                        >
                            <TextInputField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="John Doe"
                            />
                            <TextInputField
                                control={form.control}
                                name="email"
                                label="Email"
                                placeholder="john.doe@gmail.com"
                            />
                            <TextInputField
                                control={form.control}
                                name="mobile"
                                label="Mobile"
                                placeholder="+123456789"
                            />
                            <SelectInputField
                                control={form.control}
                                name="gender"
                                label="Gender"
                                placeholder="Select a gender"
                                items={GENDER_OPTIONS}
                            />
                            <TextInputField
                                control={form.control}
                                name="country_code"
                                label="Country Code"
                                placeholder="+91"

                            />
                            <TextInputField
                                control={form.control}
                                name="country"
                                label="Country"
                                placeholder="India"

                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <CustomButton type="submit" loading={loading} form="user-form">
                        Save Changes
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}