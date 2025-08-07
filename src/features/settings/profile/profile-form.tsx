import { z } from 'zod';
// import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
import { showSubmittedData } from '@/utils/show-submitted-data'; // Assume this handles form submission

import { useAuthStore } from '@/stores/use-auth-store';
// import { Mail, Phone, Save, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Define the Zod schema based on your user data
const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name must not be longer than 50 characters.' }),
  email: z
    .string({ required_error: 'Please enter a valid email.' })
    .email({ message: 'Please enter a valid email address.' }),
  mobile: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      { message: 'Please enter a valid phone number.' }
    ),
  bio: z.string().max(160, { message: 'Bio must not exceed 160 characters.' }).min(4, { message: 'Bio must be at least 4 characters.' }).optional(),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' }),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { user } = useAuthStore();

console.log("user11111111")
  // Default values based on user data from useAuthStore
  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || null,
    bio: 'I love technology!',
    urls: [{ value: 'https://example.com' }],
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // const { fields, append, remove } = useFieldArray({
  //   name: 'urls',
  //   control: form.control,
  // });

  const onSubmit = (data: ProfileFormValues) => {
    showSubmittedData(data); // Handle submission (e.g., API call)
    toast.success('Profile updated successfully', {
      description: 'Your profile has been successfully updated.',
    });
  };

  return (

    
    <Card className='w-full max-w-md'>

      <CardContent className='space-y-4'>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} className="rounded-md" />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public display name. It can be your real name or a pseudonym.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} className="rounded-md" />
                  </FormControl>
                  {/* <FormDescription>
                  Your email address. You can manage email settings{' '}
                  <Link to="/settings" className="text-primary hover:underline">
                    here
                  </Link>.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Field */}
            {/* <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Mobile
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1234567890"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    className="rounded-md"
                  />
                </FormControl>
                <FormDescription>
                  Your mobile number (optional). Enter a valid phone number with country code.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

            {/* Bio Field */}
            {/* <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself"
                    className="resize-none rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A short bio (max 160 characters). Mention your interests or expertise.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

            {/* URLs Field */}
            {/* <div>
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="h-4 w-4" />
              <FormLabel>Links</FormLabel>
            </div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`urls.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex items-end gap-2">
                    <div className="flex-1">
                      <FormLabel className={cn(index !== 0 && 'sr-only')}>
                        URL {index + 1}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} className="rounded-md" />
                      </FormControl>
                      <FormMessage />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: '' })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div> */}

            {/* Submit Button
          <Button type="submit" className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Update Profile
          </Button> */}
          </form>
        </Form>
      </CardContent>
    </Card>

    
  );
}