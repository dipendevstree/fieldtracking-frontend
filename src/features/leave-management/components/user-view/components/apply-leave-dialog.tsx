import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, subDays } from "date-fns";
import { Loader2, Paperclip, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";

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
import moment from "moment";

interface ApplyLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveToEditId?: string | null;
  defaultLeaveTypeId?: string;
  leaveTypesList: any[];
  workFromHomeTypeOpen?: boolean;
  selectDateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export function ApplyLeaveDialog({
  open,
  onOpenChange,
  leaveToEditId,
  defaultLeaveTypeId,
  leaveTypesList,
  workFromHomeTypeOpen,
  selectDateRange,
}: ApplyLeaveDialogProps) {
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
    onOpenChange(false),
  );

  const leaveTypeOptions = leaveTypesList
    .filter((type: any) =>
      workFromHomeTypeOpen
        ? type.superAdminCreatedBy
        : !type.superAdminCreatedBy,
    )
    .map((type: any) => ({
      value: type.id,
      label: type.name,
    }));

  const requiredAttachmentIds = useMemo(() => {
    return leaveTypesList
      .filter((lt: any) => lt.requiresAttachment)
      .map((lt: any) => lt.id);
  }, [leaveTypesList]);

  const formSchema = useMemo(
    () => getApplyLeaveSchema(requiredAttachmentIds),
    [requiredAttachmentIds],
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
    getValues,
    formState: { errors },
  } = form;

  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");
  const watchHalfDay = watch("halfDay");
  const watchLeaveTypeId = watch("leaveTypeId");
  const watchAttachments = watch("attachments") || [];
  const singleDay =
    watchStartDate &&
    watchEndDate &&
    moment(watchStartDate).isSame(watchEndDate, "day");
  const requiresAttachment = requiredAttachmentIds.includes(watchLeaveTypeId);

  // Initial Reset / Population
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        reset({
          startDate: new Date(),
          endDate: new Date(),
          reason: "",
          leaveTypeId: "",
          halfDay: false,
          halfDayType: undefined,
          attachments: [],
        });
        setDateRange({ from: undefined, to: undefined });
      }, 200);
      return;
    }

    if (leaveToEditId && singleLeaveData) {
      const leaveData = singleLeaveData;
      const startDate = parseISO(leaveData.startDate);
      const endDate = parseISO(leaveData.endDate);

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

      if (workFromHomeTypeOpen) {
        const workFromHomeType = leaveTypesList.find(
          (lt: any) => lt.superAdminCreatedBy,
        );
        if (workFromHomeType) {
          setValue("leaveTypeId", workFromHomeType.id);
        }
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
      setDateRange({
        from: watchStartDate,
        to: watchEndDate || watchStartDate,
      });
    }
  }, [watchStartDate, watchEndDate]);

  useEffect(() => {
    if (selectDateRange && selectDateRange.from && selectDateRange.to) {
      setDateRange({
        from: selectDateRange.from,
        to: subDays(selectDateRange.to, 1), // Subtract 1 day to make it inclusive
      });
      form.setValue("startDate", selectDateRange.from);
      form.setValue("endDate", subDays(selectDateRange.to, 1));
    }
  }, [selectDateRange]);

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

    // Filter attachments: separate actual new Files and existing string paths
    const currentAttachments = data.attachments || [];
    const newFiles = currentAttachments.filter(
      (a): a is File => a instanceof File,
    );
    const remainingExisting = currentAttachments.filter(
      (a): a is string => typeof a === "string",
    );

    // Append actual files
    newFiles.forEach((file) => formData.append("attachments", file));

    // Calculate deleteFileKeys: anything in original but not in current
    if (leaveToEditId && singleLeaveData?.attachments) {
      const originalAttachments: string[] = singleLeaveData.attachments;
      const deleteFileKeys = originalAttachments.filter(
        (path) => !remainingExisting.includes(path),
      );
      deleteFileKeys.forEach((key) => formData.append("deleteFileKeys", key));
    }

    if (leaveToEditId) {
      updateLeaveMutation.mutate(formData);
    } else {
      createLeaveMutation.mutate(formData);
    }
  };

  const onDropList = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const current = getValues("attachments") || [];
        setValue("attachments", [...current, ...acceptedFiles], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [getValues, setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropList,
    noClick: false,
  });

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
            {leaveToEditId
              ? "Edit Leave Request"
              : `Apply for ${workFromHomeTypeOpen ? `Work From Home` : `Leave`}`}
          </DialogTitle>
        </DialogHeader>

        {leaveToEditId && isLoadingSingleLeave ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm">Fetching leave details...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="leaveTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type *</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={leaveTypeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select leave type"
                        disabled={workFromHomeTypeOpen}
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

              {singleDay && (
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
                                  { shouldValidate: true },
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
              )}

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
              {(requiresAttachment || watchAttachments.length > 0) && (
                <div>
                  <FormLabel
                    className={cn(errors.attachments && "text-destructive")}
                  >
                    Attachments {requiresAttachment && "*"}
                  </FormLabel>
                  <div
                    {...getRootProps()}
                    className={cn(
                      "mt-2 flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer focus:outline-none",
                      isDragActive
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-slate-300 hover:border-slate-400",
                    )}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center space-y-2">
                      {isDragActive ? (
                        <UploadCloud className="w-8 h-8 text-blue-500 animate-bounce" />
                      ) : (
                        <Paperclip className="w-6 h-6 text-slate-400" />
                      )}
                      <div className="text-center">
                        <span className="font-semibold text-slate-700 text-sm block">
                          {isDragActive
                            ? "Drop files now"
                            : "Click to upload or drag and drop"}
                        </span>
                        <span className="text-xs text-slate-500 mt-1 block">
                          PDF, JPG, PNG or DOC (Max 5MB)
                        </span>
                      </div>
                    </div>
                  </div>

                  {watchAttachments.length > 0 && (
                    <div className="mt-3 border rounded-md bg-slate-50">
                      <div className="max-h-[150px] overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {watchAttachments.map((file: any, idx: number) => {
                          const isNew = file instanceof File;
                          const name = isNew
                            ? file.name
                            : file.split("/").pop() || file;
                          const attachmentError = (errors.attachments as any)?.[
                            idx
                          ]?.message;

                          return (
                            <AttachmentItem
                              key={idx}
                              name={name}
                              isNew={isNew}
                              error={attachmentError}
                              onPreview={() => handlePreviewFile(file)}
                              onRemove={() => {
                                const current = getValues("attachments") || [];
                                setValue(
                                  "attachments",
                                  current.filter((_, i) => i !== idx),
                                  { shouldValidate: true, shouldDirty: true },
                                );
                              }}
                            />
                          );
                        })}
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
                <Button
                  type="submit"
                  disabled={
                    isSaving || (requiresAttachment && !!errors.attachments)
                  }
                >
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
