import { useState, useMemo } from "react";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  parseISO,
  isSameDay,
  isSunday,
  isSaturday,
  previousSunday,
  nextSaturday,
} from "date-fns";
import {
  CalendarIcon,
  // Plus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Custom Components
import CalendarView from "./components/CalendarView";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { IconEdit, IconX } from "@tabler/icons-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

import { ApplyLeaveDialog } from "./components/apply-leave-dialog";
// import { LeaveBalanceCard } from "./components/leave-balance-card";
import { TopStatsCard } from "../../../../components/ui/TopStatsCard";

// Services & Hooks
import { useGetAllLeaveTypes } from "@/features/leave-management/services/leave-type.action.hook";
import { useGetMyHolidays } from "@/features/holiday-management/services/holiday.action.hook";
import {
  useCancelLeave,
  useGetAllLeaves,
  useGetLeaveStats,
  // useGetMyLeaves,
} from "../../services/leave-action.hook";

// ... (other imports)
import StatusBadge, {
  statusColors,
} from "@/components/shared/common-status-badge";
import { Main } from "@/components/layout/main";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import LeaveRequest from "../leave-request/LeaveRequest";

// --- LOGIC HELPER ---
const getEventStatusKey = (isHoliday: boolean, text: string, date: Date) => {
  const lowerText = text?.toLowerCase() || "";

  if (!isHoliday) {
    return lowerText; // return 'pending', 'approved', etc.
  }

  // Holiday Priorities
  if (lowerText.includes("national")) return "national";
  if (lowerText.includes("festival")) return "festival";
  if (lowerText.includes("regional")) return "regional";
  if (lowerText.includes("optional")) return "optional";

  // Check for Weekend
  if (date.getDay() === 0 || lowerText.includes("sunday")) return "weekend";

  return "national"; // Default fallback
};

// --- MAIN COMPONENT ---
export default function MyLeaveBalance() {
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
  const { data: stats } = useGetLeaveStats();
  // const { data: myLeavesList } = useGetMyLeaves();

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

  // Mutations
  const cancelLeaveMutation = useCancelLeave(cancelLeaveId, () => {
    setIsApplyLeaveOpen(false);
    setIsCancelDialogOpen(false);
    setLeaveToCancel(null);
  });

  // Handlers
  // const openApplyLeaveDialog = (leaveTypeId?: string) => {
  //   setEditingLeaveId(null);
  //   setSelectedLeaveTypeId(leaveTypeId);
  //   setIsApplyLeaveOpen(true);
  // };

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

  const confirmCancel = () => {
    if (cancelLeaveId) cancelLeaveMutation.mutate();
  };

  // Calendar Logic
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
        if (!lr.halfDay) end = addDays(end, 1);

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

  // const cardStyles = [
  //   { headerBg: "bg-blue-50", titleColor: "text-blue-700" },
  //   { headerBg: "bg-green-50", titleColor: "text-green-700" },
  //   { headerBg: "bg-purple-50", titleColor: "text-purple-700" },
  //   { headerBg: "bg-orange-50", titleColor: "text-orange-700" },
  // ];

  return (
    <Main className="space-y-6 pb-10">
      {/* <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Leave Dashboard
        </h2>
        <PermissionGate requiredPermission="leave_balance" action="add">
          <Button
            className="ml-auto shadow-sm"
            onClick={() => openApplyLeaveDialog()}
          >
            <Plus className="mr-2 h-4 w-4" /> Apply for Leave
          </Button>
        </PermissionGate>
      </div> */}

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <TopStatsCard
          title="Total Available"
          value={`${stats?.totalAvailableLeaves || 0} days`}
          description="Across all leave types"
          icon={CalendarIcon}
        />
        <TopStatsCard
          title="Leave Taken"
          value={`${stats?.leaveTaken || 0} days`}
          description="Used this year"
          icon={CalendarIcon}
        />
        <TopStatsCard
          title="Pending Requests"
          value={`${stats?.pendingRequests || 0} requests`}
          description="Awaiting approval"
          icon={CalendarIcon}
        />
      </div>

      {/* Leave Type Cards */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {myLeavesList
          ?.filter((item: any) => item && item.id)
          ?.map((item: any, index: number) => {
            const bal = item?.leaveBalance || {};
            const totalQuota =
              parseFloat(bal.earned || "0") +
              parseFloat(bal.carryForward || "0");
            const used = parseFloat(bal.used || "0");
            const percentage =
              totalQuota > 0 ? Math.round((used / totalQuota) * 100) : 0;

            return (
              <LeaveBalanceCard
                key={item?.id}
                title={item?.name}
                total={totalQuota}
                taken={used}
                balance={parseFloat(bal.remaining || "0")}
                percentage={percentage}
                headerBg={cardStyles[index % cardStyles.length].headerBg}
                titleColor={cardStyles[index % cardStyles.length].titleColor}
                onApply={() => openApplyLeaveDialog(item.id)}
              />
            );
          })}
      </div> */}

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
              weekOffDays={weekOffDays}
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
                        <div
                          className={cn("w-1 h-9 rounded-full", styles.dot)}
                        />

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
                      {!isHoliday &&
                        statusText?.toLowerCase() === "pending" && (
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
                No {calendarMode === "holiday" ? "holidays" : "leaves"} found
                for {format(viewDate, "MMMM yyyy")}.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* --- DIALOG: APPLY / EDIT LEAVE --- */}
      <ApplyLeaveDialog
        open={isApplyLeaveOpen}
        onOpenChange={setIsApplyLeaveOpen}
        leaveToEditId={editingLeaveId}
        defaultLeaveTypeId={selectedLeaveTypeId}
        leaveTypesList={leaveTypesList}
      />

      {/* --- CONFIRM CANCEL DIALOG --- */}
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

      <LeaveRequest dashboardView />
    </Main>
  );
}
