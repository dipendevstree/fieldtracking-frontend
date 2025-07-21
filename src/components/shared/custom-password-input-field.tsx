import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

export interface PasswordInputFieldProps {
    control: any
    name: string
    label: string
    placeholder: string
}

export function PasswordInputField({ control, name, label, placeholder }: PasswordInputFieldProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>{label}</FormLabel>
                    <div className='col-span-4 relative'>
                        <FormControl>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder={placeholder}
                                className='pr-10'
                                autoComplete='new-password'
                                {...field}
                            />
                        </FormControl>
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                        </button>
                    </div>
                    <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
            )}
        />
    )
}
