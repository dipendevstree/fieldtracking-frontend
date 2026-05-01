import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/TimePicker";
import { Info } from "lucide-react";
import { formatTimeTo12Hour } from "@/utils/commonFunction";
import { getShiftThresholdExpiryTime } from "@/features/attendance-management/utils/shift-time";

interface Props<T> {
  form: any;
  editingId: string | null;
  onSubmit: (data: T) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentRow?: any;
  allShifts?: any[];
}

export function ShiftActionForm<T>({
  form,
  editingId,
  onSubmit,
  open,
  onOpenChange,
  currentRow,
}: Props<T>) {
  const endTime = form.watch("endTime");
  const thresholdMinutes = Number(form.watch("thresholdMinutes") || 0);
  const formattedEndTime = formatTimeTo12Hour(endTime);
  const formattedExpiryTime = getShiftThresholdExpiryTime(
    endTime,
    thresholdMinutes,
  );

  return (
    <Dialog open={!!open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingId ? "Edit Shift" : "Add New Shift"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Shift Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Morning Shift" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="startTime"
                render={({ field }: any) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time *</FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        format="12h"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="endTime"
                render={({ field }: any) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Time *</FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        format="12h"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="fullDayHours"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel> Working Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="8"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="halfDayHours"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Half Day Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="breakMinutes"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Break Minutes</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="thresholdMinutes"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Threshold Time (Minutes) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="60"
                        min={1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <p className="flex items-center gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {formattedEndTime !== "-" && formattedExpiryTime !== "-"
                    ? `Shift ends at ${formattedEndTime}. If the required action isn’t completed by the threshold expiry time (${formattedExpiryTime}), the day will be automatically marked as Off.`
                    : "Select Shift End Time and Threshold Time to preview when the day will be automatically marked as Off."}
                </span>
              </p>
            </div>

            <FormField
              control={form.control as any}
              name="isDefault"
              render={({ field }: any) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        id="isDefault"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        disabled={editingId && currentRow?.isDefault}
                      />
                    </FormControl>
                    <Label
                      htmlFor="isDefault"
                      className="cursor-pointer text-sm"
                    >
                      Set as Default Shift
                    </Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {editingId ? "Update" : "Save"} Shift
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ShiftActionForm;
