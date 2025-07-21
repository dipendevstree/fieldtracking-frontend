import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

export interface TextInputFieldProps {
    control: any
    name: string
    label: string
    placeholder: string
}

export function TextInputField({ control, name, label, placeholder }: TextInputFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>{label}</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            className='col-span-4'
                            autoComplete='off'
                            {...field}
                        />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
            )}
        />
    )
}