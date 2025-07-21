import { SelectDropdown } from "../select-dropdown"
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

export interface SelectInputFieldProps {
    control: any
    name: string
    label: string
    placeholder: string
    items: { label: string; value: string }[]
}

export function SelectInputField({ control, name, label, placeholder, items }: SelectInputFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>{label}</FormLabel>
                    <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder={placeholder}
                        className='col-span-4'
                        items={items}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
            )}
        />
    )
}