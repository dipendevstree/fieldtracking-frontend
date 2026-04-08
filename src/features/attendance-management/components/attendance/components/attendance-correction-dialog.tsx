import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { format, formatISO, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

import {
  useRequestAttendanceCorrection,
  useUpdateAttendanceCorrection,
} from "@/features/attendance-management/services/attendance-correction-action.hook";
import {
  AttendanceCorrectionRequest,
  AttendanceCorrectionSchema,
} from "@/features/attendance-management/data/schema";
import { TimePicker } from "@/components/ui/TimePicker";
import { AttendanceCorrectionDialogProps } from "@/features/attendance-management/types";

// Helper: Extract HH:mm from ISO string
const extractTime = (dateStr?: string | null) => {
  if (!dateStr) return "";
  try {
    return format(parseISO(dateStr), "HH:mm");
  } catch (e) {
    return "";
  }
};

export function AttendanceCorrectionDialog({
  open,
  onOpenChange,
  selectedAttendance,
  correctionToEdit,
}: AttendanceCorrectionDialogProps) {
  // Determine Mode
  const isEditMode = !!correctionToEdit;

  // Create Mutation
  const { mutate: createCorrection, isPending: isCreatePending } =
    useRequestAttendanceCorrection(() => handleSuccess());

  // Update Mutation
  const { mutate: updateCorrection, isPending: isUpdatePending } =
    useUpdateAttendanceCorrection(correctionToEdit?.correctionId || "", () =>
      handleSuccess(),
    );

  const isPending = isCreatePending || isUpdatePending;

  const form = useForm<AttendanceCorrectionRequest>({
    resolver: zodResolver(AttendanceCorrectionSchema),
    defaultValues: {
      attendanceId: "",
      requestedCheckIn: "",
      requestedCheckOut: "",
      reason: "",
    },
  });

  const handleSuccess = () => {
    onOpenChange(false);
  };

  // --- POPULATE FORM ---
  useEffect(() => {
    if (open) {
      if (isEditMode && correctionToEdit) {
        // EDIT MODE: Use requested times from the correction object
        form.reset({
          attendanceId: correctionToEdit.attendanceId,
          requestedCheckIn: extractTime(correctionToEdit.requestedCheckIn),
          requestedCheckOut: extractTime(correctionToEdit.requestedCheckOut),
          reason: correctionToEdit.reason || "",
        });
      } else if (selectedAttendance) {
        // CREATE MODE: Use original check-in/out from attendance record
        form.reset({
          attendanceId: selectedAttendance.attendanceId, // Ensure we get the ID correctly
          requestedCheckIn: extractTime(selectedAttendance.firstCheckIn),
          requestedCheckOut: extractTime(selectedAttendance.lastCheckOut),
          reason: "",
        });
      }
    }
  }, [open, selectedAttendance, correctionToEdit, isEditMode, form]);

  // --- SUBMIT HANDLER ---
  const onSubmit = (values: AttendanceCorrectionRequest) => {
    if (!selectedAttendance) return;
    // Convert Time (HH:mm) to ISO Date String based on the Attendance Date
    const baseDate = new Date(selectedAttendance.date);

    const toISO = (time?: string) => {
      if (!time) return undefined;
      const [hours, minutes] = time.split(":").map(Number);
      const date = new Date(baseDate);
      date.setHours(hours, minutes, 0, 0);
      return formatISO(date);
    };

    if (isEditMode) {
      // For update, include the correction ID in the payload
      const updatePayload = {
        ...values,
        id: correctionToEdit?.id,
        requestedCheckIn: toISO(values.requestedCheckIn),
        requestedCheckOut: toISO(values.requestedCheckOut),
      };
      updateCorrection(updatePayload);
    } else {
      const createPayload = {
        ...values,
        requestedCheckIn: toISO(values.requestedCheckIn),
        requestedCheckOut: toISO(values.requestedCheckOut),
      };
      createCorrection(createPayload);
    }
  };

  // Safe check for rendering
  if (!selectedAttendance && !correctionToEdit) return null;

  // Get date for display
  const displayDate = selectedAttendance?.date
    ? new Date(selectedAttendance.date)
    : new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Correction Request" : "Request Correction"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update details for " : "Correction for "}
            <strong>{format(displayDate, "PPP")}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="attendanceId"
              render={({ field }) => <Input type="hidden" {...field} />}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requestedCheckIn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Correct Check-In <span className="text-red-500">*</span>
                    </FormLabel>
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
                control={form.control}
                name="requestedCheckOut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Correct Check-Out <span className="text-red-500">*</span>
                    </FormLabel>
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

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reason <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Forgot to punch out..."
                      className="resize-none min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Update Request" : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
