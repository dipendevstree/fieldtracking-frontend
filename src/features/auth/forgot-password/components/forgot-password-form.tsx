import { HTMLAttributes } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "../services/forgot-services";
import { useRouter } from "@tanstack/react-router";

type ForgotFormProps = HTMLAttributes<HTMLFormElement>;

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
});

export function ForgotPasswordForm({ className, ...props }: ForgotFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSuccess = (_data: any) => {
    // Handle success, e.g., show a success message or redirect
    router.navigate({ to: "/sign-in" });
  };

  const { mutate: forgotPasswordMutate, isPending: isLoading } =
    useForgotPassword(onSuccess);

  function onSubmit(data: z.infer<typeof formSchema>) {
    forgotPasswordMutate({ email: data.email });
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-2", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading}>
          Continue
        </Button>
      </form>
    </Form>
  );
}
