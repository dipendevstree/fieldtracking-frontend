import { Main } from "@/components/layout/main";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Loader2, Plus } from "lucide-react";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useEffect, useMemo, useState } from "react";
import { endOfMonth, format, startOfMonth } from "date-fns";
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
import CalendarView from "../user-view/components/CalendarView";
import { useNavigate } from "@tanstack/react-router";
import { useViewType } from "@/context/view-type-context";
import { ViewType } from "@/components/layout/types";
import { LeaveBalanceDialog } from "./components/leave-balance-modal";
import MyLeaveRequest from "./components/my-leave-request";
import { useLeaveRequestStore } from "../../store/leave-request.store";
import { useAuthStore } from "@/stores/use-auth-store";

export default function MyLeave() {
  const { user } = useAuthStore();
  const allowWorkFromHome = user?.organization?.allowWorkFromHome;
  const navigate = useNavigate();
  const { viewType, viewTypeToggle } = useViewType();
  const { open, setOpen, currentRow, setCurrentRow } = useLeaveRequestStore();

  useEffect(() => {
    if (viewType === ViewType.Admin && viewTypeToggle) {
      navigate({ to: "/leave-management/dashboard" });
      return;
    }
  }, [viewType, viewTypeToggle]);

  const [openLeaveBalance, setOpenLeaveBalance] = useState<boolean>(false);
  const [calendarMode, setCalendarMode] = useState<"holiday" | "leave">(
    "leave"
  );
  const [viewDate, setViewDate] = useState(new Date());

  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [workFromHomeTypeOpen, setWorkFromHomeTypeOpen] =
    useState<boolean>(false);

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
      userId: user?.id,
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

  const cancelLeaveId =
    (open === "cancel" && currentRow && currentRow.id) || "";

  const cancelLeaveMutation = useCancelLeave(cancelLeaveId, () => {
    setOpen(null);
    setCurrentRow(null);
  });

  const confirmCancel = () => {
    if (cancelLeaveId) cancelLeaveMutation.mutate();
  };

  const events = useMemo(() => {
    if (calendarMode === "holiday") {
      return holidays?.map((h: any) => {
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
    } else if (calendarMode === "leave") {
      return allLeavesList?.map((lr: any) => {
        const typeName =
          lr.leaveType?.name ||
          leaveTypesList.find((t: any) => t.id === lr.leaveTypeId)?.name ||
          "Leave";
        let status = lr.status?.toLowerCase() || "pending";
        if (lr.leaveType?.superAdminCreatedBy) {
          status =
            lr.leaveType?.name?.replaceAll(" ", "_").toLowerCase() || "pending";
        }
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
          {allowWorkFromHome && (
            <PermissionGate requiredPermission="my_leave" action="add">
              <Button onClick={() => setWorkFromHomeTypeOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Apply Work From Home
              </Button>
            </PermissionGate>
          )}
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

      <MyLeaveRequest calendarQueryParams={calendarQueryParams} />

      <LeaveBalanceDialog
        open={openLeaveBalance}
        onOpenChange={(value: boolean) => {
          setOpenLeaveBalance(value);
        }}
      />

      {/* --- DIALOG: APPLY / EDIT LEAVE --- */}
      <ApplyLeaveDialog
        open={isApplyLeaveOpen || workFromHomeTypeOpen || open === "edit"}
        onOpenChange={(value) => {
          if (open === "edit") {
            setOpen(null);
            setCurrentRow(null);
          } else {
            setCurrentRow(null);
            setIsApplyLeaveOpen(value);
            setWorkFromHomeTypeOpen(value);
          }
        }}
        leaveToEditId={currentRow && currentRow.id}
        leaveTypesList={leaveTypesList}
        workFromHomeTypeOpen={workFromHomeTypeOpen}
      />

      {open === "cancel" && (
        <ConfirmDialog
          open={open === "cancel"}
          onOpenChange={() => {
            if (open === "cancel") {
              setOpen(null);
              setCurrentRow(null);
            }
          }}
          title="Cancel Leave Request"
          desc={
            <span>
              Are you sure you want to cancel the leave request for{" "}
              <strong className="text-slate-900">{currentRow.typeName}</strong>{" "}
              on{" "}
              <strong className="text-slate-900">{currentRow.dateStr}</strong>?
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
