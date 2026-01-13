import { Main } from "@/components/layout/main";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Loader2, Plus } from "lucide-react";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useEffect, useMemo, useState } from "react";
import { endOfMonth, format, isSameDay, startOfMonth } from "date-fns";
import { parseISO } from "date-fns";
import { IconEdit, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  useCancelLeave,
  useGetAllLeaves,
} from "../../services/leave-action.hook";
import { useGetAllLeaveTypes } from "../../services/leave-type.action.hook";
import { useGetMyHolidays } from "@/features/holiday-management/services/holiday.action.hook";
import { isSunday, isSaturday } from "date-fns";
import { previousSunday, nextSaturday } from "date-fns";
import { ApplyLeaveDialog } from "../user-view/components/apply-leave-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { getEventStatusKey } from "../user-view/MyLeaveBalance";
import { toast } from "sonner";
import CalendarView from "../user-view/components/CalendarView";
import StatusBadge, {
  statusColors,
} from "@/components/shared/common-status-badge";
import { cn } from "@/lib/utils";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { useNavigate } from "@tanstack/react-router";
import { useViewType } from "@/context/view-type-context";
import { ViewType } from "@/components/layout/types";
import { LeaveBalanceDialog } from "./components/leave-balance-modal";
import MyLeaveRequest from "./components/my-leave-request";
import { useLeaveRequestStore } from "../../store/leave-request.store";

export default function MyLeave() {
  const navigate = useNavigate();
  const { viewType } = useViewType();
  const { open, setOpen, currentRow } = useLeaveRequestStore();

  useEffect(() => {
    if (viewType === ViewType.Admin) {
      navigate({ to: "/leave-management/dashboard" });
      return;
    }
  }, [viewType]);

  const [openLeaveBalance, setOpenLeaveBalance] = useState<boolean>(false);
  const [calendarMode, setCalendarMode] = useState<"holiday" | "leave">(
    "holiday"
  );
  const [viewDate, setViewDate] = useState(new Date());

  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [editingLeaveId, setEditingLeaveId] = useState<string | null>(null);
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState<
    string | undefined
  >(undefined);
  const [leaveToCancel, setLeaveToCancel] = useState<any | null>(null);

  // Services
  const { data: leaveTypesList = [] } = useGetAllLeaveTypes();

  const calendarQueryParams = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);

    // If the month doesn't start on Sunday, get the previous month's last Sunday
    const calendarStart = isSunday(monthStart)
      ? monthStart
      : previousSunday(monthStart);

    // If the month doesn't end on Saturday, get the next month's first Saturday
    const calendarEnd = isSaturday(monthEnd)
      ? monthEnd
      : nextSaturday(monthEnd);

    return {
      startDate: format(calendarStart, "yyyy-MM-dd"),
      endDate: format(calendarEnd, "yyyy-MM-dd"),
    };
  }, [viewDate]);

  const { data: holidays = [] } = useGetMyHolidays(calendarQueryParams);

  const {
    data: allLeavesList,
    isLoading: isLoadingLeaves,
    weekOffDays,
  } = useGetAllLeaves(calendarQueryParams);

  const cancelLeaveId = leaveToCancel?.id || "";

  const cancelLeaveMutation = useCancelLeave(cancelLeaveId, () => {
    setIsApplyLeaveOpen(false);
    setIsCancelDialogOpen(false);
    setLeaveToCancel(null);
  });

  const confirmCancel = () => {
    if (cancelLeaveId) cancelLeaveMutation.mutate();
  };

  const handleEditClick = (leaveData: any) => {
    if (leaveData.status?.toLowerCase() === "approved") {
      toast.error("Cannot edit approved leave requests.");
      return;
    }
    setEditingLeaveId(leaveData.id);
    setSelectedLeaveTypeId(undefined);
    setIsApplyLeaveOpen(true);
  };

  const handleCancelClick = (leaveData: any) => {
    if (leaveData.status?.toLowerCase() === "approved") {
      toast.error("Cannot cancel approved leave requests.");
      return;
    }
    const typeName =
      leaveData.leaveType?.name ||
      leaveTypesList.find((t: any) => t.id === leaveData.leaveTypeId)?.name ||
      "Leave";
    const dateStr = format(parseISO(leaveData.startDate), "MMM dd, yyyy");
    setLeaveToCancel({
      ...leaveData,
      displayLabel: `${typeName} on ${dateStr}`,
      typeName,
      dateStr,
    });
    setIsCancelDialogOpen(true);
  };

  const events = useMemo(() => {
    if (calendarMode === "holiday") {
      return holidays.map((h: any) => {
        const statusKey = getEventStatusKey(
          true,
          h.holidayType?.holidayTypeName || h.name,
          new Date(h.date)
        );

        return {
          id: h.id,
          title: h.name,
          start: new Date(h.date),
          end: new Date(h.date),
          allDay: true,
          resource: {
            type: h.holidayType?.holidayTypeName || "National",
            originalData: h,
            statusKey: statusKey, // Only pass key
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
        // Calculate status key
        const statusKey = getEventStatusKey(
          false,
          status,
          new Date(lr.startDate)
        );

        const start = new Date(lr.startDate);
        let end = new Date(lr.endDate);

        return {
          id: lr.id,
          title: typeName,
          start,
          end,
          allDay: !lr.halfDay,
          resource: {
            type: "leave",
            originalData: lr,
            statusKey: statusKey,
          },
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

  return (
    <Main className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            My Leave
          </h2>
          <p className="text-slate-500">
            Track your leave, leave request and their status
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOpenLeaveBalance(true)} variant="outline">
            <Eye className="mr-2 h-4 w-4" /> My Leave Balance
          </Button>
          <PermissionGate requiredPermission="my_leave" action="add">
            <Button onClick={() => setIsApplyLeaveOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Apply Leave
            </Button>
          </PermissionGate>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden p-0 pb-6">
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
              weekOffDays={weekOffDays}
            />
          )}
        </CardContent>
      </Card>

      <MyLeaveRequest />

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
              const isHoliday = evt.resource.type !== "leave";
              const statusText = isHoliday
                ? evt.resource.type
                : originalData.status;

              // 1. Get the Key (we already calc it in events, but good to retrieve from resource)
              const statusKey = evt.resource.statusKey;

              // 2. Get the Styles for Vertical Bar (Purple for Regional, etc.)
              const styles = statusColors[statusKey] ||
                statusColors["default"] || { dot: "bg-slate-400" };

              return (
                <div
                  key={evt.id}
                  className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-3 flex-1 cursor-default">
                    {/* Dynamic Vertical Bar (using dot color as bg) */}
                    <div className={cn("w-1 h-9 rounded-full", styles.dot)} />

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-800">
                          {evt.title}
                        </p>
                        {/* Use StatusBadge Component */}
                        <StatusBadge status={statusKey} />
                      </div>
                      <span className="text-xs text-slate-500">
                        {isSameDay(evt.start, evt.end)
                          ? format(evt.start, "PPP")
                          : `${format(evt.start, "PPP")} - ${format(evt.end, "PPP")}`}
                      </span>
                    </div>
                  </div>

                  {/* Buttons (Only show for pending leaves) */}
                  {!isHoliday && statusText?.toLowerCase() === "pending" && (
                    <div className="flex items-center space-x-2">
                      <PermissionGate
                        requiredPermission="leave_balance"
                        action="edit"
                      >
                        <CustomTooltip title="Edit">
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(originalData);
                            }}
                          >
                            <IconEdit size={16} />
                          </Button>
                        </CustomTooltip>
                      </PermissionGate>
                      <PermissionGate
                        requiredPermission="leave_balance"
                        action="delete"
                      >
                        <CustomTooltip title="cancel">
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelClick(originalData);
                            }}
                          >
                            <IconX size={18} stroke={3} />
                          </Button>
                        </CustomTooltip>
                      </PermissionGate>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm italic">
            No {calendarMode === "holiday" ? "holidays" : "leaves"} found for{" "}
            {format(viewDate, "MMMM yyyy")}.
          </div>
        )}
      </div>

      <LeaveBalanceDialog
        open={openLeaveBalance}
        onOpenChange={(value: boolean) => {
          setOpenLeaveBalance(value);
        }}
      />

      {/* --- DIALOG: APPLY / EDIT LEAVE --- */}
      <ApplyLeaveDialog
        open={isApplyLeaveOpen || open === "edit"}
        onOpenChange={(value) => {
          if (open === "edit") {
            setOpen(null);
          } else {
            setIsApplyLeaveOpen(value);
          }
        }}
        leaveToEditId={editingLeaveId || (currentRow && currentRow.id)}
        defaultLeaveTypeId={selectedLeaveTypeId}
        leaveTypesList={leaveTypesList}
      />

      {leaveToCancel && (
        <ConfirmDialog
          open={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
          title="Cancel Leave Request"
          desc={
            <span>
              Are you sure you want to cancel the leave request for{" "}
              <strong className="text-slate-900">
                {leaveToCancel.typeName}
              </strong>{" "}
              on{" "}
              <strong className="text-slate-900">
                {leaveToCancel.dateStr}
              </strong>
              ?
            </span>
          }
          handleConfirm={confirmCancel}
          confirmText="Yes, Cancel"
          destructive
        />
      )}
    </Main>
  );
}
