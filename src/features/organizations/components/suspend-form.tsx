import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/shared/custom-button";
import { suspendSchema, TSuspendSchema } from "../data/schema";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TSuspendSchema) => void;
  loading?: boolean;
}

export function SuspendOrganizationForm({
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: Props) {
  const form = useForm<TSuspendSchema>({
    resolver: zodResolver(suspendSchema),
    defaultValues: {
      suspendReason: "",
    },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (open) {
      reset({ suspendReason: "" });
    }
  }, [open, reset]);

  const onSubmit = (values: TSuspendSchema) => {
    onSubmitValues(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Suspend Organization</DialogTitle>
          <DialogDescription>
            Are you sure you want to suspend this organization? Please provide a
            reason.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="suspend-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="suspendReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reason <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="suspendReason"
                      placeholder="Enter reason for suspension..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-fit h-10"
          >
            Cancel
          </Button>
          <CustomButton
            type="submit"
            loading={loading}
            form="suspend-form"
            className="w-full sm:w-fit h-10"
          >
            Suspend
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
