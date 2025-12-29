import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCreateHoliday,
  useUpdateHoliday,
} from "@/features/holiday-management/services/holiday.action.hook";
import { useGetAllHolidayTypes } from "@/features/holiday-management/services/holiday-type.action.hook";
import { SimpleDatePicker } from "@/components/ui/datepicker";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { HolidaySchema } from "../../../data/schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holidayToEdit: any | null;
}

export function HolidayActionDialog({
  open,
  onOpenChange,
  holidayToEdit,
}: Props) {
  const { data: holidayTypes = [], isLoading: isLoadingTypes } =
    useGetAllHolidayTypes();

  const { mutate: createHoliday, isPending: isCreating } = useCreateHoliday(
    () => handleSuccess()
  );
  const { mutate: updateHoliday, isPending: isUpdating } = useUpdateHoliday(
    holidayToEdit?.id || "",
    () => handleSuccess()
  );

  const form = useForm<z.infer<typeof HolidaySchema>>({
    resolver: zodResolver(HolidaySchema) as any,
    defaultValues: {
      name: "",
      description: "",
      holidayTypeId: "",
      isSpecial: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (holidayToEdit) {
        form.reset({
          name: holidayToEdit.name,
          date: new Date(holidayToEdit.date),
          description: holidayToEdit.description || "",
          holidayTypeId: holidayToEdit.holidayTypeId || "",
          isSpecial: holidayToEdit.isSpecial || false,
        });
      } else {
        form.reset({
          name: "",
          date: new Date(),
          description: "",
          holidayTypeId: "",
          isSpecial: false,
        });
      }
    }
  }, [open, holidayToEdit, form]);

  const handleSuccess = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof HolidaySchema>) => {
    const payload = {
      ...values,
      date: format(values.date, "yyyy-MM-dd"),
    };

    if (holidayToEdit) {
      updateHoliday(payload);
    } else {
      createHoliday(payload);
    }
  };

  // Transform holidayTypes for SearchableSelect
  const holidayTypeOptions = useMemo(() => {
    return holidayTypes.map((type: any) => ({
      value: type.id,
      label: type.holidayTypeName,
    }));
  }, [holidayTypes]);

  const isSaving = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {holidayToEdit ? "Edit Holiday" : "Add Holiday"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Holiday Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. New Year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <SimpleDatePicker
                      date={
                        field.value ? format(field.value, "yyyy-MM-dd") : ""
                      }
                      setDate={(dateStr) => field.onChange(new Date(dateStr))}
                      disablePast={true}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="holidayTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Holiday Type</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={holidayTypeOptions}
                      value={field.value}
                      onChange={field.onChange}
                      onCancelPress={() => field.onChange("")}
                      placeholder={
                        isLoadingTypes ? "Loading types..." : "Select type"
                      }
                      disabled={isLoadingTypes}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Optional description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isSpecial"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Special Holiday</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Holiday
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
