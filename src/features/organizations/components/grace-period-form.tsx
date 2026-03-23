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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/shared/custom-button";
import {
  extendGracePeriodSchema,
  TExtendGracePeriodSchema,
} from "../data/schema";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TExtendGracePeriodSchema) => void;
  loading?: boolean;
}

export function ExtendGracePeriodForm({
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: Props) {
  const form = useForm<TExtendGracePeriodSchema>({
    resolver: zodResolver(extendGracePeriodSchema),
    defaultValues: {
      extendByDays: 7,
      notes: "",
    },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (open) {
      reset({ extendByDays: 7, notes: "" });
    }
  }, [open, reset]);

  const onSubmit = (values: TExtendGracePeriodSchema) => {
    onSubmitValues(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Extend Grace Period</DialogTitle>
          <DialogDescription>
            Extend the grace period for this organization.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="extend-grace-period-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="extendByDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Extend By (Days) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="extendByDays"
                      type="number"
                      min={1}
                      placeholder="Enter number of days"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Notes <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="notes"
                      placeholder="Enter notes..."
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
            form="extend-grace-period-form"
            className="w-full sm:w-fit h-10"
          >
            Extend
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
