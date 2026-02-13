import { useState, useMemo, useEffect } from "react";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import { Loader2, ArrowRight } from "lucide-react";
import { IconEdit, IconX } from "@tabler/icons-react";

// Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Main } from "@/components/layout/main";
import AttendanceCalendarView, {
  AttendanceEvent,
} from "./components/attendance-calendar";
import { AttendanceCorrectionDialog } from "./components/attendance-correction-dialog";
import { PermissionGate } from "@/permissions/components/PermissionGate";

// Utils & Data
import { cn } from "@/lib/utils";
import { ATTENDANCE_STATUS } from "@/data/app.data";

// Hooks & Services
import {
  useGetMyAttendance,
  useGetDashboardCalendarData,
} from "../../services/attendance-action.hook";
import {
  useAttendanceCorrectionOwnRequestCancel,
  useGetMyAttendanceCorrections,
} from "../../services/attendance-correction-action.hook";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useViewType } from "@/context/view-type-context";
import { ViewType } from "@/components/layout/types";

// --- HELPERS (Keep existing helpers) ---
const formatStatus = (status: string) => {
  return status
    ?.replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getStatusDot = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-500";
    case "PENDING":
      return "bg-amber-600";
    case "REJECTED":
      return "bg-red-500";
    case "CANCEL":
      return "bg-red-500";
    default:
      return "bg-slate-300";
  }
};

const getRequestStatusStyles = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "REJECTED":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "PENDING":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "CANCEL":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function MyAttendance() {
  const navigate = useNavigate();
  // view type context
  const { viewType, viewTypeToggle } = useViewType();
  useEffect(() => {
    if (viewType === ViewType.Admin && viewTypeToggle) {
      navigate({ to: "/attendance-management/attendance-dashboard" });
      return;
    }
  }, [viewType, viewTypeToggle]);

  const [viewDate, setViewDate] = useState(new Date());
  const [isCorrectionDialogOpen, setIsCorrectionDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<any | null>(
    null,
  );
  const [correctionToEdit, setCorrectionToEdit] = useState<any | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [correctionToCancel, setCorrectionToCancel] = useState<any | null>(
    null,
  );

  const calendarQueryParams = useMemo(
    () => ({
      startDate: format(startOfMonth(viewDate), "yyyy-MM-dd"),
      endDate: format(endOfMonth(viewDate), "yyyy-MM-dd"),
    }),
    [viewDate],
  );

  // Queries
  const { data: attendanceData = [], isLoading } =
    useGetMyAttendance(calendarQueryParams);
  const { data: correctionsResponse } =
    useGetMyAttendanceCorrections(calendarQueryParams);

  // Fetch holiday data for calendar
  const { holidays = [], weekOffDays = [] } =
    useGetDashboardCalendarData(calendarQueryParams);

  const attendanceCorrectionsData = Array.isArray(correctionsResponse)
    ? correctionsResponse
    : correctionsResponse?.list || [];

  const cancelCorrectionMutation = useAttendanceCorrectionOwnRequestCancel(
    correctionToCancel?.correctionId || "",
    () => {
      handleCorrectionActionSuccess("Cancel");
      setIsCancelDialogOpen(false);
      setCorrectionToCancel(null);
    },
  );

  // Calendar Events
  const events: AttendanceEvent[] = useMemo(() => {
    return attendanceData.map((record: any) => ({
      id: record.id,
      title: record.status,
      start: new Date(record.date),
      end: new Date(record.date),
      resource: {
        status: record.status,
        checkIn: record.firstCheckIn
          ? format(parseISO(record.firstCheckIn), "hh:mm a")
          : null,
        checkOut: record.lastCheckOut
          ? format(parseISO(record.lastCheckOut), "hh:mm a")
          : null,
        originalData: record,
      },
    }));
  }, [attendanceData]);

  // --- Handlers ---

  // 1. Create New Request (from Calendar)
  const handleRequestCorrection = (record: any) => {
    if (!record?.attendanceId) return toast.warning("Attendance not found!");
    setSelectedAttendance(record);
    setCorrectionToEdit(null); // Create mode
    setIsCorrectionDialogOpen(true);
  };

  // Calendar click handler for events
  const handleCalendarEventSelect = (event: AttendanceEvent) => {
    const s = event.resource.status;
    if (s === ATTENDANCE_STATUS.LEAVE || s === ATTENDANCE_STATUS.ABSENT) {
      toast.warning(`Cannot request correction on ${formatStatus(s)}.`);
      return;
    }
    if (s !== ATTENDANCE_STATUS.WEEK_OFF && s !== ATTENDANCE_STATUS.HOLIDAY) {
      handleRequestCorrection(event.resource.originalData);
    }
  };

  // Calendar click handler for empty slots
  const handleCalendarSlotSelect = (slotInfo: any) => {
    const selectedDate = slotInfo.start;
    // Find the attendance record for this date
    const attendanceRecord = attendanceData.find((record: any) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getDate() === selectedDate.getDate() &&
        recordDate.getMonth() === selectedDate.getMonth() &&
        recordDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    if (attendanceRecord) {
      const s = attendanceRecord.status;
      if (s === ATTENDANCE_STATUS.LEAVE || s === ATTENDANCE_STATUS.ABSENT) {
        toast.warning(`Cannot request correction on ${formatStatus(s)}.`);
        return;
      }
      if (s !== ATTENDANCE_STATUS.WEEK_OFF && s !== ATTENDANCE_STATUS.HOLIDAY) {
        handleRequestCorrection(attendanceRecord);
      }
    } else {
      // No attendance record found for this date
      toast.info("No attendance record found for this date");
    }
  };

  // 2. Edit Request
  const handleEditCorrection = (item: any) => {
    if (!canModifyCorrection(item, "edit")) return;

    // Set the original attendance record (needed for date context)
    setSelectedAttendance(item.attendance);
    // Set the correction record (needed for form values and ID)
    setCorrectionToEdit(item);
    setIsCorrectionDialogOpen(true);
  };

  // 3. Cancel Request - Open Dialog
  const handleCancelClick = (item: any) => {
    if (!canModifyCorrection(item, "cancel")) return;

    setCorrectionToCancel(item);
    setIsCancelDialogOpen(true);
  };

  // 4. Confirm Cancel
  const confirmCancel = () => {
    if (correctionToCancel?.correctionId) {
      cancelCorrectionMutation.mutate({});
    }
  };

  // --- SHARED HANDLERS ---

  // Generic success handler for correction actions
  const handleCorrectionActionSuccess = (action: string) => {
    toast.success(`${action} request successfully!`);
  };

  // Check if a correction request can be modified
  const canModifyCorrection = (correction: any, action: "edit" | "cancel") => {
    if (correction?.status !== "PENDING") {
      toast.error(`Cannot ${action} processed requests.`);
      return false;
    }
    return true;
  };

  return (
    <Main className="space-y-6 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          My Attendance
        </h2>
        <p className="text-slate-500">
          Track your attendance, check-in times, and work patterns
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden p-0">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="animate-spin text-slate-400" />
            </div>
          ) : (
            <PermissionGate
              requiredPermission="my_attendance"
              action="add"
              fallback={
                <AttendanceCalendarView
                  events={events}
                  date={viewDate}
                  onNavigate={setViewDate}
                  holidays={holidays}
                  weekOffDays={weekOffDays}
                  isSelectable={false}
                />
              }
            >
              <AttendanceCalendarView
                events={events}
                date={viewDate}
                onNavigate={setViewDate}
                onSelectEvent={handleCalendarEventSelect}
                onSelectSlot={handleCalendarSlotSelect}
                holidays={holidays}
                weekOffDays={weekOffDays}
                isSelectable={true}
              />
            </PermissionGate>
          )}

          <div className="bg-slate-50/50 border-t border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              Correction Requests
              <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">
                {attendanceCorrectionsData.length}
              </span>
            </h3>

            <div className="space-y-3">
              {attendanceCorrectionsData.length > 0 ? (
                attendanceCorrectionsData.map((item: any) => {
                  const {
                    id,
                    requestedCheckIn,
                    requestedCheckOut,
                    status,
                    attendance,
                  } = item;
                  const originalDate = attendance?.date;
                  const isPending = status === "PENDING";
                  return (
                    <div
                      key={id}
                      className="group flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 gap-4"
                    >
                      {/* Left: Info */}
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div
                          className={cn(
                            "w-1 h-12 rounded-full",
                            getStatusDot(status),
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">
                            {originalDate
                              ? format(parseISO(originalDate), "dd MMM, EEEE")
                              : "N/A"}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] w-fit px-2 py-0.5 rounded-md font-semibold mt-1 uppercase tracking-wide",
                              getRequestStatusStyles(status),
                            )}
                          >
                            {formatStatus(status)}
                          </span>
                        </div>
                      </div>

                      {/* Center: Times */}
                      <div className="flex-1 flex items-center justify-start md:justify-center gap-6 text-sm">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 font-medium uppercase mb-0.5">
                            Check In
                          </span>
                          <span className="font-mono font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded">
                            {requestedCheckIn
                              ? format(parseISO(requestedCheckIn), "hh:mm a")
                              : "--:--"}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 hidden md:block" />
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 font-medium uppercase mb-0.5">
                            Check Out
                          </span>
                          <span className="font-mono font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded">
                            {requestedCheckOut
                              ? format(parseISO(requestedCheckOut), "hh:mm a")
                              : "--:--"}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}

                      <div className="flex items-center space-x-2 w-[72px] justify-end">
                        {isPending && (
                          <>
                            <PermissionGate
                              requiredPermission="my_attendance"
                              action="edit"
                            >
                              <CustomTooltip title="Edit Request">
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCorrection(item);
                                  }}
                                >
                                  <IconEdit size={16} />
                                </Button>
                              </CustomTooltip>
                            </PermissionGate>

                            <PermissionGate
                              requiredPermission="my_attendance"
                              action="delete"
                            >
                              <CustomTooltip title="Cancel Request">
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelClick(item);
                                  }}
                                >
                                  <IconX size={18} stroke={3} />
                                </Button>
                              </CustomTooltip>
                            </PermissionGate>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm italic">
                  No attendance correction requests found.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- DIALOGS --- */}
      <AttendanceCorrectionDialog
        open={isCorrectionDialogOpen}
        onOpenChange={setIsCorrectionDialogOpen}
        selectedAttendance={selectedAttendance}
        correctionToEdit={correctionToEdit}
      />

      {/* Confirm Cancel Dialog */}
      {correctionToCancel && (
        <ConfirmDialog
          open={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
          title="Cancel Correction Request"
          desc={
            <span>
              Are you sure you want to cancel the correction request for{" "}
              <strong className="text-slate-900">
                {correctionToCancel?.attendance?.date
                  ? format(
                      parseISO(correctionToCancel.attendance.date),
                      "MMM dd, yyyy",
                    )
                  : "this date"}
              </strong>
              ?
            </span>
          }
          handleConfirm={confirmCancel}
          confirmText="Yes, Cancel"
          destructive
          isLoading={cancelCorrectionMutation.isPending}
        />
      )}
    </Main>
  );
}
