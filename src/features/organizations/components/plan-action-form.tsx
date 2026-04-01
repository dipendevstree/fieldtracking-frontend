import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SimpleDatePicker } from "@/components/ui/datepicker";
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
import { useGetPlans } from "../services/organization.hook";
import { planAssignmentSchema, TPlanAssignmentSchema } from "../data/schema";
import { useEffect, useMemo } from "react";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { enumToOptions } from "@/utils/commonFunction";
import { PlanFrequency } from "@/data/app.data";
import { useSelectOptions } from "@/hooks/use-select-option";
import { checkIfPaidPlan } from "@/permissions/hooks/use-plan-status";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TPlanAssignmentSchema) => void;
  loading?: boolean;
  title: string;
  description: string;
  currentRow?: any;
}

export function PlanActionForm({
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
  title,
  description,
  currentRow,
}: Props) {
  const { plans, isLoading: plansLoading } = useGetPlans({
    isActive: true,
    sort: "asc",
  });

  const form = useForm<TPlanAssignmentSchema>({
    resolver: zodResolver(planAssignmentSchema),
    defaultValues: {
      planId: "",
      planStartDate: "",
      frequency: undefined,
      notes: "",
    },
  });

  const { reset, handleSubmit, watch, setValue } = form;

  const selectedPlanId = watch("planId");

  const isPaidPlan = useMemo(
    () => checkIfPaidPlan(plans, selectedPlanId),
    [plans, selectedPlanId],
  );

  useEffect(() => {
    if (selectedPlanId && !isPaidPlan) {
      setValue("frequency", undefined);
    }
  }, [isPaidPlan, selectedPlanId, setValue]);

  useEffect(() => {
    if (open) {
      reset({
        planId: currentRow?.planId || currentRow?.plan?.id || "",
        planStartDate:
          currentRow?.planStartDate || currentRow?.plan?.startDate || "",
        frequency:
          currentRow?.frequency || currentRow?.plan?.frequency || undefined,
        notes: currentRow?.notes || currentRow?.plan?.notes || "",
      });
    }
  }, [open, reset, currentRow]);

  const onSubmit = (values: TPlanAssignmentSchema) => {
    onSubmitValues(values);
  };

  const planOptions = useSelectOptions({
    listData: plans,
    labelKey: "name",
    valueKey: "id",
  }) as { label: string; value: string }[];

  const frequencyOptions = useMemo(() => enumToOptions(PlanFrequency), []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="plan-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            {/* Plan Dropdown */}
            <FormField
              control={form.control}
              name="planId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select Plan <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={planOptions}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={plansLoading}
                      placeholder="Select a plan"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plan Start Date */}
            <FormField
              control={form.control}
              name="planStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Plan Start Date <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SimpleDatePicker
                      date={field.value}
                      setDate={field.onChange}
                      className="w-full"
                      disablePast
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Frequency */}
            {isPaidPlan && (
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Frequency <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={frequencyOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select frequency"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="notes"
                      placeholder="Add any notes here..."
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
            form="plan-form"
            className="w-full sm:w-fit h-10"
          >
            Submit
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
