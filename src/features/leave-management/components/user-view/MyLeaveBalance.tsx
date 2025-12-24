import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  format,
  differenceInBusinessDays,
  addDays,
  startOfMonth,
  endOfMonth,
  parseISO,
  isSameDay,
} from "date-fns";
import {
  CalendarIcon,
  Plus,
  Loader2,
  Paperclip,
  X,
  FileText,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

// Custom Components
import CalendarView from "./components/CalendarView";
import { DateRangeFilter } from "@/features/reports/components/DateRangeFilter";

// Services & Hooks
import { useGetAllLeaveTypes } from "@/features/leave-management/services/leave-type.action.hook";
import { useGetAllHolidays } from "@/features/leave-management/services/holiday.action.hook";

import {
  useCreateLeave,
  useDeleteLeave,
  useGetAllLeaves,
  useGetLeaveById,
  useGetLeaveStats,
  useGetMyLeaves,
  useUpdateLeave,
} from "../../services/leave-action.hook";
import { ApplyLeaveFormValues, ApplyLeaveSchema } from "../../data/schema";
import { LEAVE_HALF_DAY_TYPE } from "@/data/app.data";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { DeleteModal } from "@/components/shared/common-delete-modal";

// --- HELPER COMPONENT: Attachment Item ---
const AttachmentItem = ({
  name,
  isNew,
  onPreview,
  onRemove,
}: {
  name: string;
  isNew: boolean;
  onPreview: () => void;
  onRemove: () => void;
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-white border rounded-md text-sm shadow-sm transition-colors hover:bg-slate-50">
      <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 mr-2">
        <FileText
          className={cn(
            "h-4 w-4 shrink-0",
            isNew ? "text-green-600" : "text-blue-500"
          )}
        />
        <span
          onClick={onPreview}
          className={cn(
            "truncate max-w-[240px] text-slate-700 cursor-pointer hover:underline text-xs sm:text-sm",
            isNew ? "hover:text-green-700" : "hover:text-blue-700"
          )}
          title={`View ${name}`}
        >
          {name}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <CustomTooltip title="Preview">
          <button
            type="button"
            onClick={onPreview}
            className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
          >
            <Eye className="h-4 w-4" />
          </button>
        </CustomTooltip>
        <CustomTooltip title="Remove">
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </button>
        </CustomTooltip>
      </div>
    </div>
  );
};

// --- HELPER: LEAVE BALANCE CARD ---
function LeaveBalanceCard({
  title,
  total,
  taken,
  balance,
  percentage,
  headerBg,
  titleColor,
  onApply,
}: any) {
  const indicatorColorClass = `[&>*]:${titleColor.replace("text-", "bg-")}`;
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden border-slate-200">
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between space-y-0 py-3",
          headerBg
        )}
      >
        <div className="space-y-0.5">
          <CardTitle className={cn("text-sm font-bold", titleColor)}>
            {title}
          </CardTitle>
          <p className="text-[10px] text-slate-600 font-medium">
            Balance for current year
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 bg-white/80 hover:bg-white border-none text-xs"
          onClick={onApply}
        >
          <Plus className="mr-1 h-3 w-3" /> Apply
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between text-sm mb-4">
          <div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Total
            </p>
            <p className="font-bold text-lg">{total}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Taken
            </p>
            <p className="font-bold text-lg text-red-500">{taken}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Balance
            </p>
            <p className="font-bold text-lg text-green-600">{balance}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>Usage</span>
            <span>{percentage}%</span>
          </div>
          <Progress
            value={percentage}
            className={cn("h-1.5", indicatorColorClass)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// --- MAIN COMPONENT ---
export default function MyLeaveBalance() {
  const [calendarMode, setCalendarMode] = useState<"holiday" | "leave">(
    "holiday"
  );
  const [viewDate, setViewDate] = useState(new Date());

  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingLeaveId, setEditingLeaveId] = useState<string | null>(null);
  const [leaveToDelete, setLeaveToDelete] = useState<any | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);

  // Services
  const { data: leaveTypesResponse } = useGetAllLeaveTypes();
  const { data: stats } = useGetLeaveStats();
  const { data: myLeavesResponse } = useGetMyLeaves();
  const { data: holidays = [] } = useGetAllHolidays();

  const leaveTypesList = useMemo(() => {
    if (!leaveTypesResponse) return [];
    if (leaveTypesResponse.data?.list) return leaveTypesResponse.data.list;
    if (leaveTypesResponse.list) return leaveTypesResponse.list;
    if (Array.isArray(leaveTypesResponse)) return leaveTypesResponse;
    return [];
  }, [leaveTypesResponse]);

  const { data: singleLeaveData, isLoading: isLoadingSingleLeave } =
    useGetLeaveById(editingLeaveId || "");

  const calendarQueryParams = useMemo(
    () => ({
      startDate: format(startOfMonth(viewDate), "yyyy-MM-dd"),
      endDate: format(endOfMonth(viewDate), "yyyy-MM-dd"),
    }),
    [viewDate]
  );

  const { data: allLeavesResponse, isLoading: isLoadingLeaves } =
    useGetAllLeaves(calendarQueryParams);

  const normalizeList = (response: any) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.list && Array.isArray(response.list)) return response.list;
    return [];
  };

  const myLeavesList = useMemo(
    () => normalizeList(myLeavesResponse),
    [myLeavesResponse]
  );
  const allLeavesList = useMemo(
    () => normalizeList(allLeavesResponse),
    [allLeavesResponse]
  );

  // CHANGED: Logic to determine ID based on delete object or edit ID
  const targetLeaveId = leaveToDelete?.id || editingLeaveId || "";

  // Mutations
  const createLeaveMutation = useCreateLeave(() => setIsApplyLeaveOpen(false));
  const updateLeaveMutation = useUpdateLeave(editingLeaveId || "", () =>
    setIsApplyLeaveOpen(false)
  );
  const deleteLeaveMutation = useDeleteLeave(targetLeaveId, () => {
    setIsApplyLeaveOpen(false);
    setIsDeleteDialogOpen(false);
    setLeaveToDelete(null); // Reset
  });

  // Form
  const applyLeaveForm = useForm<ApplyLeaveFormValues>({
    resolver: zodResolver(ApplyLeaveSchema) as any,
    defaultValues: {
      leaveTypeId: "",
      reason: "",
      halfDay: false,
      halfDayType: undefined,
    },
  });

  const watchStartDate = applyLeaveForm.watch("startDate");
  const watchEndDate = applyLeaveForm.watch("endDate");
  const watchHalfDay = applyLeaveForm.watch("halfDay");
  const watchLeaveTypeId = applyLeaveForm.watch("leaveTypeId");

  const requiresAttachment = useMemo(() => {
    const selected = leaveTypesList.find(
      (lt: any) => lt.id === watchLeaveTypeId
    );
    return selected?.requiresAttachment === true;
  }, [leaveTypesList, watchLeaveTypeId]);

  useEffect(() => {
    if (
      !requiresAttachment &&
      (selectedFiles.length > 0 || existingFiles.length > 0)
    ) {
      if (!editingLeaveId) {
        setSelectedFiles([]);
        setExistingFiles([]);
      }
    }
  }, [requiresAttachment, editingLeaveId]);

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  useEffect(() => {
    if (editingLeaveId && singleLeaveData) {
      const leaveData = singleLeaveData;

      const startDate = parseISO(leaveData.startDate);
      const endDate = parseISO(leaveData.endDate);

      if (leaveData.attachments && Array.isArray(leaveData.attachments)) {
        setExistingFiles(leaveData.attachments);
      } else {
        setExistingFiles([]);
      }

      setDateRange({ from: startDate, to: endDate });

      applyLeaveForm.reset({
        leaveTypeId: leaveData.leaveTypeId,
        startDate: startDate,
        endDate: endDate,
        reason: leaveData.reason || "",
        halfDay: Boolean(leaveData.halfDay),
        halfDayType: leaveData.halfDayType || undefined,
      });

      setSelectedFiles([]);
    }
  }, [editingLeaveId, singleLeaveData, applyLeaveForm]);

  useEffect(() => {
    if (watchStartDate) {
      setDateRange({
        from: watchStartDate,
        to: watchEndDate || watchStartDate,
      });
    }
  }, [watchStartDate, watchEndDate]);

  // Handlers
  const openApplyLeaveDialog = (leaveTypeId?: string) => {
    setEditingLeaveId(null);
    setSelectedFiles([]);
    setExistingFiles([]);
    setDateRange({ from: undefined, to: undefined });
    applyLeaveForm.reset({
      startDate: new Date(),
      endDate: new Date(),
      reason: "",
      leaveTypeId:
        leaveTypeId || (leaveTypesList.length > 0 ? leaveTypesList[0].id : ""),
      halfDay: false,
      halfDayType: undefined,
    });
    setIsApplyLeaveOpen(true);
  };

  const handleEditClick = (leaveData: any) => {
    if (leaveData.status?.toLowerCase() === "approved") {
      toast.error("Cannot edit approved leave requests.");
      return;
    }
    setEditingLeaveId(leaveData.id);
    setIsApplyLeaveOpen(true);
    setSelectedFiles([]);
  };

  // CHANGED: Prepare object with a display property for the custom modal
  const handleDeleteClick = (leaveData: any) => {
    if (leaveData.status?.toLowerCase() === "approved") {
      toast.error("Cannot delete approved leave requests.");
      return;
    }

    const typeName =
      leaveData.leaveType?.name ||
      leaveTypesList.find((t: any) => t.id === leaveData.leaveTypeId)?.name ||
      "Leave";
    const dateStr = format(parseISO(leaveData.startDate), "MMM dd, yyyy");

    // Add a custom 'displayLabel' property to identify the item in the modal
    const preparedData = {
      ...leaveData,
      displayLabel: `${typeName} on ${dateStr}`,
    };

    setLeaveToDelete(preparedData);
    setIsDeleteDialogOpen(true);
  };

  const onApplyLeaveSubmit = (data: ApplyLeaveFormValues) => {
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

    if (requiresAttachment) {
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => formData.append("attachments", file));
      }
    }

    if (editingLeaveId) {
      updateLeaveMutation.mutate(formData);
    } else {
      createLeaveMutation.mutate(formData);
    }
  };

  const confirmDelete = () => {
    if (targetLeaveId) {
      deleteLeaveMutation.mutate();
    }
  };

  const handlePreviewFile = (file: File | string) => {
    if (typeof file === "string") {
      window.open(file, "_blank");
    } else {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
    }
  };

  const events = useMemo(() => {
    if (calendarMode === "holiday") {
      return holidays.map((h: any) => {
        const holidayDate = new Date(h.date);
        return {
          id: h.id,
          title: h.name,
          start: holidayDate,
          end: holidayDate,
          allDay: true,
          resource: {
            type: h.holidayType?.holidayTypeName || "National",
            originalData: h,
          },
        };
      });
    } else {
      return allLeavesList.map((lr: any) => {
        const typeName =
          lr.leaveType?.name ||
          leaveTypesList.find((t: any) => t.id === lr.leaveTypeId)?.name ||
          "Leave";
        const status = lr.status?.toLowerCase() || "pending";
        let color = "bg-blue-500";
        if (status === "approved") color = "bg-green-500";
        if (status === "rejected") color = "bg-red-500";
        if (status === "pending") color = "bg-orange-500";

        const start = new Date(lr.startDate);
        let end = new Date(lr.endDate);
        const isHalfDay = Boolean(lr.halfDay);

        if (!isHalfDay) {
          end = addDays(end, 1);
        }

        return {
          id: lr.id,
          title: typeName,
          start,
          end,
          allDay: !isHalfDay,
          resource: { type: "leave", originalData: lr, color },
        };
      });
    }
  }, [calendarMode, holidays, allLeavesList, leaveTypesList]);

  const currentMonthEvents = events
    .filter((e: any) => {
      const eDate = new Date(e.start);
      return (
        eDate.getMonth() === viewDate.getMonth() &&
        eDate.getFullYear() === viewDate.getFullYear()
      );
    })
    .sort((a: any, b: any) => a.start.getTime() - b.start.getTime());

  const calculateTaken = (typeId: string) => {
    if (stats?.leaveBalances) {
      const statItem = stats.leaveBalances.find(
        (b: any) => b.leaveTypeId === typeId
      );
      if (statItem) return statItem.taken;
    }
    return myLeavesList
      .filter(
        (l: any) =>
          l.leaveTypeId === typeId && l.status?.toLowerCase() === "approved"
      )
      .reduce((acc: number, curr: any) => {
        if (curr.halfDay) return acc + 0.5;
        const days = differenceInBusinessDays(
          addDays(new Date(curr.endDate), 1),
          new Date(curr.startDate)
        );
        return acc + Math.max(days, 1);
      }, 0);
  };

  const cardStyles = [
    { headerBg: "bg-blue-50", titleColor: "text-blue-700" },
    { headerBg: "bg-green-50", titleColor: "text-green-700" },
    { headerBg: "bg-purple-50", titleColor: "text-purple-700" },
    { headerBg: "bg-orange-50", titleColor: "text-orange-700" },
  ];

  const isSaving =
    createLeaveMutation.isPending || updateLeaveMutation.isPending;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          My Leave Balance
        </h2>
        <Button
          className="ml-auto shadow-sm"
          onClick={() => openApplyLeaveDialog()}
        >
          <Plus className="mr-2 h-4 w-4" /> Apply for Leave
        </Button>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Available
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.totalAvailableLeaves || 0} days
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Across all leave types
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Leave Taken
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.leaveTaken || 0} days
            </div>
            <p className="text-xs text-slate-500 mt-1">Used this year</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending Requests
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.pendingRequests || 0} requests
            </div>
            <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Type Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {leaveTypesList.map((lt: any, index: number) => {
          const total = lt.leaveBalance ? Number(lt.leaveBalance) : 0;
          const taken = calculateTaken(lt.id);
          const balance = total - taken;
          const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;

          return (
            <LeaveBalanceCard
              key={lt.id}
              title={lt.name}
              total={total}
              taken={taken}
              balance={balance > 0 ? balance : 0}
              percentage={percentage}
              headerBg={cardStyles[index % cardStyles.length].headerBg}
              titleColor={cardStyles[index % cardStyles.length].titleColor}
              onApply={() => openApplyLeaveDialog(lt.id)}
            />
          );
        })}
      </div>

      {/* Calendar & List Section */}
      <Card className="border-slate-200 shadow-sm overflow-hidden p-0">
        <CardContent className="p-0">
          {isLoadingLeaves ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <CalendarView
              events={events}
              defaultView="month"
              currentMode={calendarMode}
              onModeChange={setCalendarMode}
              date={viewDate}
              onNavigate={setViewDate}
            />
          )}

          <div className="bg-slate-50/50 border-t border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
              {calendarMode === "holiday" ? "Holidays" : "Leaves"} this month
              <span className="ml-2 bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">
                {currentMonthEvents.length}
              </span>
            </h3>

            {currentMonthEvents.length > 0 ? (
              <div className="space-y-2">
                {currentMonthEvents.map((evt: any) => {
                  const originalData = evt.resource.originalData;
                  const isPending =
                    originalData?.status?.toLowerCase() === "pending";

                  const isHoliday = evt.resource.type !== "leave";
                  const statusText = isHoliday
                    ? evt.resource.type
                    : originalData.status;

                  // Determine Badge Color
                  let badgeClass = "";
                  if (isHoliday) {
                    badgeClass = "bg-blue-50 text-blue-700 border-blue-200";
                    if (statusText?.toLowerCase()?.includes("optional")) {
                      badgeClass =
                        "bg-purple-50 text-purple-700 border-purple-200";
                    }
                  } else {
                    switch (statusText?.toLowerCase()) {
                      case "approved":
                        badgeClass =
                          "bg-green-50 text-green-700 border-green-200";
                        break;
                      case "rejected":
                        badgeClass = "bg-red-50 text-red-700 border-red-200";
                        break;
                      case "pending":
                        badgeClass =
                          "bg-orange-50 text-orange-700 border-orange-200";
                        break;
                      default:
                        badgeClass =
                          "bg-slate-100 text-slate-700 border-slate-200";
                    }
                  }

                  const isOneDay = isSameDay(evt.start, evt.end);

                  return (
                    <div
                      key={evt.id}
                      className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-center gap-3 flex-1 cursor-default">
                        {/* Status Color Strip */}
                        <div
                          className={cn(
                            "w-1 h-9 rounded-full",
                            evt.resource.type === "National"
                              ? "bg-blue-500"
                              : evt.resource.type === "leave"
                                ? evt.resource.color || "bg-orange-500"
                                : "bg-green-500"
                          )}
                        />
                        <div>
                          {/* Name + Badge Row */}
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-800">
                              {evt.title}
                            </p>
                            <span
                              className={cn(
                                "text-[10px] px-2 py-[1px] rounded-full border uppercase font-semibold tracking-wide",
                                badgeClass
                              )}
                            >
                              {statusText}
                            </span>
                          </div>
                          {/* Date Row with Range Logic */}
                          <span className="text-xs text-slate-500">
                            {isOneDay
                              ? format(evt.start, "PPP")
                              : `${format(evt.start, "PPP")} - ${format(
                                  evt.end,
                                  "PPP"
                                )}`}
                          </span>
                        </div>
                      </div>

                      {calendarMode === "leave" && isPending && (
                        <div className="flex items-center space-x-2">
                          <CustomTooltip title="Edit">
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(originalData);
                              }}
                            >
                              <IconEdit size={16} />
                            </Button>
                          </CustomTooltip>

                          <CustomTooltip title="Delete">
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                // CHANGED: Pass full object for Modal context
                                handleDeleteClick(originalData);
                              }}
                            >
                              <IconTrash size={16} />
                            </Button>
                          </CustomTooltip>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm italic">
                No {calendarMode === "holiday" ? "holidays" : "leaves"} found
                for {format(viewDate, "MMMM yyyy")}.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* --- DIALOG: APPLY / EDIT LEAVE --- */}
      <Dialog
        open={isApplyLeaveOpen}
        onOpenChange={(open) => {
          setIsApplyLeaveOpen(open);
          if (!open) {
            setTimeout(() => {
              setEditingLeaveId(null);
              applyLeaveForm.reset();
              setSelectedFiles([]);
              setExistingFiles([]);
              setDateRange({ from: undefined, to: undefined });
            }, 200);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-[550px]"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {editingLeaveId ? "Edit Leave Request" : "Apply for Leave"}
            </DialogTitle>
          </DialogHeader>

          {editingLeaveId && isLoadingSingleLeave ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm">Fetching leave details...</p>
            </div>
          ) : (
            <Form {...applyLeaveForm}>
              <form
                onSubmit={applyLeaveForm.handleSubmit(onApplyLeaveSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={applyLeaveForm.control}
                  name="leaveTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type</FormLabel>
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
                    className={cn(
                      applyLeaveForm.formState.errors.startDate &&
                        "text-destructive"
                    )}
                  >
                    Duration
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
                        applyLeaveForm.setValue("startDate", safeRange.from, {
                          shouldValidate: true,
                        });
                        applyLeaveForm.setValue(
                          "endDate",
                          safeRange.to || safeRange.from,
                          { shouldValidate: true }
                        );
                      }
                    }}
                    placeholder="Select duration"
                  />
                  {applyLeaveForm.formState.errors.startDate && (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {applyLeaveForm.formState.errors.startDate.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-row items-center space-x-4 border p-3 rounded-md bg-slate-50">
                  <FormField
                    control={applyLeaveForm.control}
                    name="halfDay"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-y-0 gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
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
                      control={applyLeaveForm.control}
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
                  control={applyLeaveForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter reason..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {requiresAttachment && (
                  <div>
                    <FormLabel>Attachments</FormLabel>
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
                              onRemove={() =>
                                setExistingFiles((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                )
                              }
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
                  </div>
                )}

                <DialogFooter className="gap-2 pt-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingLeaveId ? (
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

      {/* --- CONFIRM DELETE MODAL --- */}
      {leaveToDelete && (
        <DeleteModal
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          currentRow={leaveToDelete}
          onDelete={confirmDelete}
          itemName="Leave Request"
          itemIdentifier="displayLabel"
        />
      )}
    </div>
  );
}
