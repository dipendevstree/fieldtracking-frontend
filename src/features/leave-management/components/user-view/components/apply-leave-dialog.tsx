import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { Loader2, Paperclip } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { DateRangeFilter } from "@/features/reports/components/DateRangeFilter";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

import {
  ApplyLeaveFormValues,
  getApplyLeaveSchema,
} from "@/features/leave-management/data/schema";
import { LEAVE_HALF_DAY_TYPE } from "@/data/app.data";
import {
  useCreateLeave,
  useUpdateLeave,
  useGetLeaveById,
} from "@/features/leave-management/services/leave-action.hook";

import { AttachmentItem } from "./attachment-item";

interface ApplyLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveToEditId?: string | null;
  defaultLeaveTypeId?: string;
  leaveTypesList: any[];
}

export function ApplyLeaveDialog({
  open,
  onOpenChange,
  leaveToEditId,
  defaultLeaveTypeId,
  leaveTypesList,
}: ApplyLeaveDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [deleteFileKeys, setDeleteFileKeys] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  // Fetch single leave data if editing
  const { data: singleLeaveData, isLoading: isLoadingSingleLeave } =
    useGetLeaveById(leaveToEditId || "", { enabled: !!leaveToEditId && open });

  // Mutations
  const createLeaveMutation = useCreateLeave(() => onOpenChange(false));
  const updateLeaveMutation = useUpdateLeave(leaveToEditId || "", () =>
    onOpenChange(false)
  );

  const requiredAttachmentIds = useMemo(() => {
    return leaveTypesList
      .filter((lt: any) => lt.requiresAttachment)
      .map((lt: any) => lt.id);
  }, [leaveTypesList]);

  const formSchema = useMemo(
    () => getApplyLeaveSchema(requiredAttachmentIds),
    [requiredAttachmentIds]
  );

  const form = useForm<ApplyLeaveFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      leaveTypeId: "",
      reason: "",
      halfDay: false,
      halfDayType: undefined,
      attachments: [],
    },
  });

  const {
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitted },
  } = form;

  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");
  const watchHalfDay = watch("halfDay");
  const watchLeaveTypeId = watch("leaveTypeId");

  const requiresAttachment = requiredAttachmentIds.includes(watchLeaveTypeId);

  // Sync files to form
  useEffect(() => {
    const combinedFiles = [...existingFiles, ...selectedFiles];
    const shouldValidate = isSubmitted || combinedFiles.length > 0;
    setValue("attachments", combinedFiles, {
      shouldValidate: shouldValidate,
      shouldDirty: true,
    });
  }, [selectedFiles, existingFiles, setValue, isSubmitted]);

  // Initial Reset / Population
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        reset({
          startDate: new Date(), // default
          endDate: new Date(),
          reason: "",
          leaveTypeId: "",
          halfDay: false,
          halfDayType: undefined,
          attachments: [],
        }); // clear form
        setSelectedFiles([]);
        setExistingFiles([]);
        setDeleteFileKeys([]);
        setDateRange({ from: undefined, to: undefined });
      }, 200);
      return;
    }

    if (leaveToEditId && singleLeaveData) {
      const leaveData = singleLeaveData;
      const startDate = parseISO(leaveData.startDate);
      const endDate = parseISO(leaveData.endDate);

      if (leaveData.attachments && Array.isArray(leaveData.attachments)) {
        setExistingFiles(leaveData.attachments);
      } else {
        setExistingFiles([]);
      }
      setSelectedFiles([]);
      setDeleteFileKeys([]);

      setDateRange({ from: startDate, to: endDate });

      reset({
        leaveTypeId: leaveData.leaveTypeId,
        startDate: startDate,
        endDate: endDate,
        reason: leaveData.reason || "",
        halfDay: Boolean(leaveData.halfDay),
        halfDayType: leaveData.halfDayType || undefined,
        attachments: leaveData.attachments || [],
      });
    } else if (!leaveToEditId) {
      // New Application Mode
      if (defaultLeaveTypeId) {
        setValue("leaveTypeId", defaultLeaveTypeId);
      } else if (leaveTypesList.length > 0 && !watchLeaveTypeId) {
        setValue("leaveTypeId", leaveTypesList[0].id);
      }

      if (!dateRange.from) {
        setDateRange({ from: new Date(), to: new Date() });
        setValue("startDate", new Date());
        setValue("endDate", new Date());
      }
    }
  }, [
    open,
    leaveToEditId,
    singleLeaveData,
    reset,
    leaveTypesList,
    defaultLeaveTypeId,
  ]);

  // Sync Date Range Picker to Form
  useEffect(() => {
    if (watchStartDate) {
      // Only update dateRange if it mismatches to avoid cycles,
      // but typically we drive form from dateRange picker or vice versa.
      // The original code pushed watch -> dateRange.
      setDateRange({
        from: watchStartDate,
        to: watchEndDate || watchStartDate,
      });
    }
  }, [watchStartDate, watchEndDate]);

  const onSubmit = (data: ApplyLeaveFormValues) => {
    const formData = new FormData();
    formData.append("leaveTypeId", data.leaveTypeId);
    formData.append("reason", data.reason || "");
    if (data.startDate)
      formData.append("startDate", format(data.startDate, "yyyy-MM-dd"));
    if (data.endDate)
      formData.append("endDate", format(data.endDate, "yyyy-MM-dd"));
    formData.append("halfDay", data.halfDay ? "true" : "false");
    if (data.halfDay && data.halfDayType)
      formData.append("halfDayType", data.halfDayType);

    // Append actual files
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => formData.append("attachments", file));
    }

    // Append deleteFileKeys
    if (deleteFileKeys.length > 0) {
      deleteFileKeys.forEach((key) => formData.append("deleteFileKeys", key));
    }

    if (leaveToEditId) {
      updateLeaveMutation.mutate(formData);
    } else {
      createLeaveMutation.mutate(formData);
    }
  };

  const handlePreviewFile = (file: File | string) => {
    if (typeof file === "string") {
      window.open(file, "_blank");
    } else {
      window.open(URL.createObjectURL(file), "_blank");
    }
  };

  const isSaving =
    createLeaveMutation.isPending || updateLeaveMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[550px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {leaveToEditId ? "Edit Leave Request" : "Apply for Leave"}
          </DialogTitle>
        </DialogHeader>

        {leaveToEditId && isLoadingSingleLeave ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm">Fetching leave details...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="leaveTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type *</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={leaveTypesList.map((type: any) => ({
                          value: type.id,
                          label: type.name,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select leave type"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <FormLabel
                  className={cn(errors.startDate && "text-destructive")}
                >
                  Duration *
                </FormLabel>
                <DateRangeFilter
                  dateRange={dateRange}
                  disablePastDates={true}
                  allowClear={false}
                  setDateRange={(range) => {
                    const safeRange = range
                      ? { from: range.from, to: range.to }
                      : { from: undefined, to: undefined };
                    setDateRange(safeRange);
                    if (safeRange.from) {
                      setValue("startDate", safeRange.from, {
                        shouldValidate: true,
                      });
                      setValue("endDate", safeRange.to || safeRange.from, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  placeholder="Select duration"
                />
                {errors.startDate && (
                  <p className="text-[0.9rem] text-destructive">
                    {errors.startDate.message?.toString()}
                  </p>
                )}
              </div>

              <div className="flex flex-row items-center space-x-4 border p-3 rounded-md bg-slate-50">
                <FormField
                  control={form.control}
                  name="halfDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // Auto-select First Half if enabling half day
                            if (checked) {
                              setValue(
                                "halfDayType",
                                LEAVE_HALF_DAY_TYPE.FIRST_HALF,
                                { shouldValidate: true }
                              );
                            } else {
                              setValue("halfDayType", undefined);
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-medium mt-0">
                        Half Day?
                      </FormLabel>
                    </FormItem>
                  )}
                />
                {watchHalfDay && (
                  <FormField
                    control={form.control}
                    name="halfDayType"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <SearchableSelect
                            options={[
                              {
                                value: LEAVE_HALF_DAY_TYPE.FIRST_HALF,
                                label: "First Half",
                              },
                              {
                                value: LEAVE_HALF_DAY_TYPE.SECOND_HALF,
                                label: "Second Half",
                              },
                            ]}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select half"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter reason..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- ATTACHMENTS SECTION --- */}
              {(requiresAttachment ||
                selectedFiles.length > 0 ||
                existingFiles.length > 0) && (
                <div>
                  <FormLabel
                    className={cn(errors.attachments && "text-destructive")}
                  >
                    Attachments {requiresAttachment && "*"}
                  </FormLabel>
                  <div className="mt-2">
                    <label className="flex items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-slate-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-slate-400 focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <Paperclip className="w-5 h-5 text-slate-600" />
                        <span className="font-medium text-slate-600 text-sm">
                          Drop files here or click to upload
                        </span>
                      </span>
                      <input
                        type="file"
                        name="file_upload"
                        className="hidden"
                        multiple
                        onChange={(e) => {
                          if (e.target.files)
                            setSelectedFiles((prev) => [
                              ...prev,
                              ...Array.from(e.target.files as FileList),
                            ]);
                        }}
                      />
                    </label>
                  </div>

                  {(selectedFiles.length > 0 || existingFiles.length > 0) && (
                    <div className="mt-3 border rounded-md bg-slate-50">
                      <div className="max-h-[150px] overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {existingFiles.map((filePath, idx) => (
                          <AttachmentItem
                            key={`existing-${idx}`}
                            name={filePath.split("/").pop() || filePath}
                            isNew={false}
                            onPreview={() => handlePreviewFile(filePath)}
                            onRemove={() => {
                              setDeleteFileKeys((prev) => [...prev, filePath]);
                              setExistingFiles((prev) =>
                                prev.filter((_, i) => i !== idx)
                              );
                            }}
                          />
                        ))}

                        {selectedFiles.map((file, idx) => (
                          <AttachmentItem
                            key={`new-${idx}`}
                            name={file.name}
                            isNew={true}
                            onPreview={() => handlePreviewFile(file)}
                            onRemove={() =>
                              setSelectedFiles((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.attachments && (
                    <p className="text-[0.9rem] text-destructive mt-2">
                      {errors.attachments.message as string}
                    </p>
                  )}
                </div>
              )}

              <DialogFooter className="gap-2 pt-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : leaveToEditId ? (
                    "Update Request"
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
